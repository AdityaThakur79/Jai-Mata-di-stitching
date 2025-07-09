import Employee from "../models/Employee.js";
import moment from "moment";
import puppeteer from "puppeteer";
import bwipjs from "bwip-js";
import path from "path";
import fs from "fs";

// Helper to generate next Employee ID for the month
async function generateEmployeeId() {
  const prefix = "EMP";
  const now = moment();
  const yearMonth = now.format("YYYYMM");
  // Find the latest employee for this month
  const lastEmployee = await Employee.findOne({ employeeId: { $regex: `^${prefix}-${yearMonth}-` } })
    .sort({ createdAt: -1 });
  let nextSeq = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const parts = lastEmployee.employeeId.split("-");
    nextSeq = parseInt(parts[2], 10) + 1;
  }
  const employeeId = `${prefix}-${yearMonth}-${String(nextSeq).padStart(4, "0")}`;
  return employeeId;
}

export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      gender,
      address,
      aadhaarNumber,
      role,
      joiningDate,
      bankDetails,
      emergencyContact,
    } = req.body;
    console.log(req.body)
    if (!name || !mobile || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile, and role are required.",
      });
    }

    const existing = await Employee.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee with this mobile already exists.",
      });
    }

    let profileImage = "";
    if (req.files && req.files.profileImage) {
      profileImage = req.files.profileImage[0].path;
    }

    const employeeId = await generateEmployeeId();
    const newEmployee = await Employee.create({
      name,
      mobile,
      email,
      gender,
      address,
      aadhaarNumber,
      role,
      employeeId,
      joiningDate,
      profileImage,
      bankDetails: bankDetails ? JSON.parse(bankDetails) : undefined,
      emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Employee.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
      page,
      limit,
      total,
      currentPageCount: employees.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching employees",
    });
  }
};


export const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      mobile,
      email,
      gender,
      address,
      aadhaarNumber,
      joiningDate,
      role,
      designation,
      status,
      advancePayments,
      salarySlips,
      documents,
      bankDetails,
      emergencyContact,
      barcode
    } = req.body;
    const existingEmployee = await Employee.findOne({ employeeId });
    if (!existingEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    let profileImage = existingEmployee.profileImage;
    if (req.files && req.files.employeeProfilePhoto) {
      profileImage = req.files.employeeProfilePhoto[0].path;
    }
    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.mobile = mobile || existingEmployee.mobile;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.gender = gender || existingEmployee.gender;
    existingEmployee.address = address || existingEmployee.address;
    existingEmployee.aadhaarNumber = aadhaarNumber || existingEmployee.aadhaarNumber;
    existingEmployee.joiningDate = joiningDate || existingEmployee.joiningDate;
    existingEmployee.role = role || existingEmployee.role;
    existingEmployee.designation = designation || existingEmployee.designation;
    existingEmployee.status = status || existingEmployee.status;
    existingEmployee.advancePayments = advancePayments ? JSON.parse(advancePayments) : existingEmployee.advancePayments;
    existingEmployee.salarySlips = salarySlips ? JSON.parse(salarySlips) : existingEmployee.salarySlips;
    existingEmployee.profileImage = profileImage;
    existingEmployee.documents = documents ? JSON.parse(documents) : existingEmployee.documents;
    existingEmployee.bankDetails = bankDetails ? JSON.parse(bankDetails) : existingEmployee.bankDetails;
    existingEmployee.emergencyContact = emergencyContact ? JSON.parse(emergencyContact) : existingEmployee.emergencyContact;
    existingEmployee.barcode = barcode || existingEmployee.barcode;
    await existingEmployee.save();
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: existingEmployee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    await employee.deleteOne();
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const generateEmployeeIdCardPdf = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "employeeId is required" });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: employee.employeeId,
      scale: 1.5,
      height: 20,
      includetext: false,
      backgroundcolor: "FFFFFF",
      paddingwidth: 0,
      paddingheight: 0,
      barcolor: "f77f2f",
    });
    const barcodeDataUrl = `data:image/png;base64,${barcodeBuffer.toString("base64")}`;

    const logoPath = path.join(process.cwd(), "client/public/images/jmd_logo.jpeg");
    const logoDataUrl = `data:image/jpeg;base64,${fs.readFileSync(logoPath).toString("base64")}`;

    let photoDataUrl = logoDataUrl;
    if (employee.profileImage?.startsWith("http")) {
      photoDataUrl = employee.profileImage;
    } else if (employee.profileImage) {
      try {
        const photoPath = path.join(process.cwd(), employee.profileImage);
        photoDataUrl = `data:image/jpeg;base64,${fs.readFileSync(photoPath).toString("base64")}`;
      } catch (e) {
        photoDataUrl = logoDataUrl;
      }
    }

    const {
      name = "—",
      role = "—",
      email = "—",
      mobile = "—",
      address = "—",
      employeeId: empId = "—",
      joiningDate,
      gender = "—",
      emergencyContact = {},
    } = employee;

    const joinDate = joiningDate ? new Date(joiningDate).toLocaleDateString() : "—";
    const emergencyName = emergencyContact.name || "—";
    const emergencyMobile = emergencyContact.mobile || "—";

    const companyName = "JMD Stitching";
    const companyAddress = "108, Infinity Business park, Dombivali(E), Thane - 421203";
    const companyEmail = "info@jmdstitching.com";

    const html = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;font-family:'Inter','Roboto','Poppins',sans-serif;width:210mm;height:297mm;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
        <div style="display:flex;flex-direction:row;align-items:center;justify-content:center;padding:15mm;gap:15mm;width:100%;height:100%;box-sizing:border-box;">
    
          <!-- FRONT SIDE -->
          <div style="width:85mm;height:125mm;background:linear-gradient(135deg,#ffffff 0%,#fefefe 100%); border-radius:15px;overflow:hidden;position:relative;box-shadow:0 4mm 8mm rgba(255,111,0,0.15),0 2mm 4mm rgba(0,0,0,0.1);display:flex;flex-direction:column;justify-content:space-between;padding:0;transition:all 0.3s ease;">
            <!-- Enhanced Polygon Accent Top -->
            <div style="width:100%;height:25mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 0, 100% 0, 100% 70%, 0 100%);position:absolute;top:0;left:0;box-shadow:0 1mm 2mm rgba(255,111,0,0.2);"></div>
            
            <!-- Decorative Elements -->
            <div style="position:absolute;top:4mm;right:4mm;width:8mm;height:8mm;background:rgba(255,255,255,0.2);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:7mm;right:7mm;width:4mm;height:4mm;background:rgba(255,255,255,0.15);border-radius:50%;z-index:1;"></div>
            
            <div style="text-align:center;z-index:2;margin-top:5mm;padding:0 4mm;">
              <div style="background:white;border-radius:3mm;padding:1mm;display:inline-block;box-shadow:0 1mm 3mm rgba(255,111,0,0.2);margin-bottom:2mm;">
                <img src="${logoDataUrl}" style="width:12mm;height:12mm;border-radius:2mm;" />
              </div>
              <div style="background:white;border-radius:50%;padding:1mm;display:inline-block;box-shadow:0 2mm 4mm rgba(255,111,0,0.25);margin-bottom:3mm;">
                <img src="${photoDataUrl}" style="width:22mm;height:22mm;border-radius:50%;border:1mm solid #ff6f00;" />
              </div>
              <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:1mm;letter-spacing:-0.3px;">${name}</div>
              <div style="font-size:10px;color:#ff6f00;font-weight:600;margin-bottom:4mm;text-transform:uppercase;letter-spacing:0.3px;">${role}</div>
            </div>
    
            <div style="font-size:10px;color:#333;margin-top:2mm;padding:0 4mm;z-index:2;flex-grow:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">ID:</span>
                <span style="font-weight:600;color:#1a1a1a;font-size:8px;">${empId}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Phone:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:8px;">${mobile}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Email:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:7px;">${email}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Joined:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:8px;">${joinDate}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Address:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:7px;text-align:right;max-width:60%;">${address}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:0.5px solid #f0f0f0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Gender:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:8px;">${gender}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;">
                <span style="font-weight:600;color:#666;text-transform:uppercase;font-size:7px;letter-spacing:0.3px;">Emergency:</span>
                <span style="font-weight:500;color:#1a1a1a;font-size:7px;text-align:right;">${emergencyName} (${emergencyMobile})</span>
              </div>
              
              <!-- BARCODE - Positioned at bottom of data section -->
              <div style="text-align:center;margin-top:3mm;">
                <div style="background:white;border-radius:2mm;padding:2mm;display:inline-block;box-shadow:0 1mm 3mm rgba(255,111,0,0.15);">
                  <img src="${barcodeDataUrl}" style="width:35mm;height:9mm;border-radius:1mm;" />
                </div>
              </div>
            </div>
    
            <!-- Enhanced Polygon Accent Bottom -->
 <div style="position:absolute;bottom:0;left:0;width:100%;height:15mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 30%, 100% 0, 100% 100%, 0 100%);display:flex;align-items:center;justify-content:center;z-index:1;box-shadow:0 -1mm 2mm rgba(255,111,0,0.2);">
              <div style="font-size:9px;font-weight:700;color:white;text-align:center;margin-top:3mm;letter-spacing:0.2px;text-shadow:0 0.5mm 1mm rgba(0,0,0,0.2);">Your satisfaction is our first priority</div>
            </div>          </div>
    
          <!-- BACK SIDE -->
          <div style="width:85mm;height:125mm;background:linear-gradient(135deg,#ffffff 0%,#fefefe 100%);border-radius:15px;overflow:hidden;position:relative;box-shadow:0 4mm 8mm rgba(255,111,0,0.15),0 2mm 4mm rgba(0,0,0,0.1);padding:0;display:flex;flex-direction:column;justify-content:space-between;transition:all 0.3s ease;">
            <!-- Enhanced Polygon Accent Top -->
            <div style="width:100%;height:25mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 0, 100% 0, 100% 70%, 0 100%);position:absolute;top:0;left:0;box-shadow:0 1mm 2mm rgba(255,111,0,0.2);"></div>
    
            <!-- Decorative Elements -->
            <div style="position:absolute;top:4mm;right:4mm;width:8mm;height:8mm;background:rgba(255,255,255,0.2);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:7mm;right:7mm;width:4mm;height:4mm;background:rgba(255,255,255,0.15);border-radius:50%;z-index:1;"></div>
    
            <div style="z-index:2;text-align:center;margin-top:10mm;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 5mm;">
              <div style="background:white;border-radius:3mm;padding:2mm;display:inline-block;box-shadow:0 1mm 3mm rgba(255,111,0,0.2);margin-bottom:3mm;">
                <img src="${logoDataUrl}" style="width:14mm;height:14mm;border-radius:2mm;" />
              </div>
              <div style="font-size:14px;font-weight:700;color:#1a1a1a;text-align:center;margin-bottom:4mm;letter-spacing:-0.3px;">${companyName}</div>
              <div style="font-size:8px;color:#555;margin-bottom:1mm;line-height:1.2;"><span style="font-weight:600;color:#ff6f00;">Address:</span> ${companyAddress}</div>
              <div style="font-size:8px;color:#555;margin-bottom:4mm;line-height:1.2;"><span style="font-weight:600;color:#ff6f00;">Contact:</span> ${companyEmail}</div>
              
              <div style="width:15mm;height:0.5mm;background:linear-gradient(90deg,#ff6f00,#ff8f00);margin:0 auto 4mm;border-radius:0.25mm;"></div>
              
              <div style="font-size:9px;color:#ff6f00;font-weight:700;margin-bottom:3mm;text-transform:uppercase;letter-spacing:0.3px;">Terms & Conditions</div>
              <ul style="font-size:7px;color:#555;line-height:1.3;padding-left:4mm;margin:0;text-align:left;">
                <li style="margin-bottom:1mm;">ID card must be visible at all times during work hours</li>
                <li style="margin-bottom:1mm;">Report lost or damaged cards immediately to HR</li>
                <li style="margin-bottom:1mm;">This card remains property of the company</li>
                <li style="margin-bottom:1mm;">Must be returned upon resignation or termination</li>
                <li style="margin-bottom:1mm;">If found, please return to company address above</li>
              </ul>
            </div>
            
            <div style="text-align:center;font-size:6px;color:#999;margin-bottom:18mm;font-weight:400;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</div>
            
            <!-- Enhanced Tagline Banner -->
            <div style="position:absolute;bottom:0;left:0;width:100%;height:15mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 30%, 100% 0, 100% 100%, 0 100%);display:flex;align-items:center;justify-content:center;z-index:1;box-shadow:0 -1mm 2mm rgba(255,111,0,0.2);">
              <div style="font-size:9px;font-weight:700;color:white;text-align:center;margin-top:3mm;letter-spacing:0.2px;text-shadow:0 0.5mm 1mm rgba(0,0,0,0.2);">Your satisfaction is our first priority</div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '210mm',
      height: '297mm', // Portrait A4
      landscape: false,
      pageRanges: '1',
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=JMD-Employee-ID-${employee.employeeId}.pdf`,
    });
    res.end(pdfBuffer);
  } catch (err) {
    console.error("Error generating employee ID card PDF:", err);
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(`<html><body><div style='color:red;font-size:18px;padding:40px;text-align:center;'>Failed to generate ID Card PDF</div></body></html>`, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: "210mm",
      height: "297mm",
      landscape: false,
      pageRanges: "1",
    });
    await browser.close();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=JMD-Employee-ID-ERROR.pdf` });
    res.end(pdfBuffer);
  }
};



