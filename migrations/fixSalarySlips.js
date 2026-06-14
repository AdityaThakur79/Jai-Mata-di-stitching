// Migration script to add totalEarnings and totalDeductions to existing salary slips
import mongoose from "mongoose";
import Employee from "../models/employee.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error("MONGODB_URL environment variable is not set");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const migrateSalarySlips = async () => {
  try {
    console.log("Starting salary slip migration...");
    
    const employees = await Employee.find({});
    let totalUpdated = 0;
    let totalSlips = 0;

    for (const employee of employees) {
      let needsUpdate = false;

      for (const slip of employee.salarySlips) {
        totalSlips++;
        
        // Check if totalEarnings and totalDeductions are missing
        if (slip.totalEarnings === undefined || slip.totalDeductions === undefined) {
          // Calculate from existing data
          const basicSalary = slip.basicSalary || slip.baseSalary || 0;
          const hra = slip.hra || 0;
          const da = slip.da || 0;
          const conveyanceAllowance = slip.conveyanceAllowance || 0;
          const medicalAllowance = slip.medicalAllowance || 0;
          const specialAllowance = slip.specialAllowance || 0;
          const otherEarnings = slip.otherEarnings || 0;
          const bonus = slip.bonus || 0;
          const incentive = slip.incentive || 0;

          slip.totalEarnings = basicSalary + hra + da + conveyanceAllowance + 
                              medicalAllowance + specialAllowance + otherEarnings + 
                              bonus + incentive;

          const advancesDeducted = slip.advancesDeducted || slip.totalAdvances || 0;
          const pf = slip.pf || 0;
          const esi = slip.esi || 0;
          const tds = slip.tds || 0;
          const professionalTax = slip.professionalTax || 0;
          const loanDeduction = slip.loanDeduction || 0;
          const otherDeductions = slip.otherDeductions || 0;

          slip.totalDeductions = advancesDeducted + pf + esi + tds + 
                                professionalTax + loanDeduction + otherDeductions;

          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        // Turn off validation to allow updating without hitting all the new required fields
        await Employee.updateOne(
          { _id: employee._id },
          { $set: { salarySlips: employee.salarySlips } },
          { runValidators: false }
        );
        totalUpdated++;
      }
    }

    console.log(`Migration completed!`);
    console.log(`Total employees processed: ${employees.length}`);
    console.log(`Total salary slips processed: ${totalSlips}`);
    console.log(`Employees updated: ${totalUpdated}`);
    
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};

// Run migration
(async () => {
  try {
    await connectDB();
    await migrateSalarySlips();
    console.log("Migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
