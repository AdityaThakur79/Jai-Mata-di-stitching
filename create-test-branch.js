import mongoose from "mongoose";
import Branch from "./models/branch.js";
import dotenv from "dotenv";

dotenv.config();

const createTestBranch = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Check if branch already exists
    const existingBranch = await Branch.findOne({ branchName: "Test Branch" });
    if (existingBranch) {
      console.log("Test branch already exists");
      process.exit(0);
    }

    // Create test branch
    const testBranch = new Branch({
      branchName: "Test Branch",
      address: "123 Test Street, Test City, Test State - 123456",
      phone: "1234567890",
      email: "test@jmdstitching.com",
      status: "active"
    });

    await testBranch.save();
    console.log("Test branch created successfully:", testBranch);

    process.exit(0);
  } catch (error) {
    console.error("Error creating test branch:", error);
    process.exit(1);
  }
};

createTestBranch();
