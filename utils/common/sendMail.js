import nodemailer from "nodemailer";

// Create transporter with better error handling
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.");
  }

  // For Gmail, you need to use an App Password if 2FA is enabled
  // Or use OAuth2 for better security
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be an App Password, not your regular password
    },
    // Add additional options for better reliability
    secure: true, // Use SSL
    port: 465, // Gmail SMTP port
    tls: {
      rejectUnauthorized: false // For development, remove in production
    }
  });

  return transporter;
};

// Verify transporter connection
const verifyTransporter = async (transporter) => {
  try {
    await transporter.verify();
    console.log("Email transporter verified successfully");
    return true;
  } catch (error) {
    console.error("Email transporter verification failed:", error);
    return false;
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection before sending
    const isVerified = await verifyTransporter(transporter);
    if (!isVerified) {
      throw new Error("Email service not available");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your OTP for registration is: <strong style="color: #007bff; font-size: 24px;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Send salary slip email
export const sendSalarySlipEmail = async (email, employeeData, salarySlip, month, pdfBuffer) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection before sending
    const isVerified = await verifyTransporter(transporter);
    if (!isVerified) {
      throw new Error("Email service not available");
    }

    // Create salary slip HTML content with JMD theme
    const salarySlipHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid #ff6b35; border-radius: 12px; background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);">
        <div style="text-align: center; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); margin: -20px -20px 30px -20px; padding: 30px 20px 20px 20px; border-radius: 10px 10px 0 0;">
          <div style="margin-bottom: 15px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">JMD STITCHING PRIVATE LIMITED</h1>
            <h2 style="color: #fff5f0; margin: 5px 0 0 0; font-size: 16px; font-weight: normal;">SALARY SLIP</h2>
          </div>
          <p style="color: #ffffff; margin: 0; font-size: 14px; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block;">${month}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35;">
            <h3 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; margin: 0 0 15px 0; font-size: 16px;">👤 Employee Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Name:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">${employeeData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Employee ID:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #ff6b35;">${employeeData.employeeId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Designation:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">${employeeData.designation || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Month:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #ff6b35;">${month}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35;">
            <h3 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; margin: 0 0 15px 0; font-size: 16px;">💰 Salary Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Basic Salary:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #28a745; font-size: 16px;">₹${salarySlip.basicSalary.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Advances Deducted:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #dc3545; font-size: 16px;">-₹${salarySlip.advancesDeducted.toLocaleString('en-IN')}</td>
              </tr>
              <tr style="border-top: 3px solid #ff6b35; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); margin-top: 10px;">
                <td style="padding: 15px 8px; font-weight: bold; font-size: 18px; color: white;">Final Payable:</td>
                <td style="padding: 15px 8px; font-weight: bold; font-size: 20px; color: white;">₹${salarySlip.finalPayable.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; color: white;">
          <h4 style="color: white; margin: 0 0 10px 0; font-size: 16px;">📝 Notes</h4>
          <p style="color: #fff5f0; margin: 0; font-size: 14px;">${salarySlip.notes || 'No additional notes'}</p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; border-top: 2px solid #ff6b35; padding-top: 20px; background: #f8f9fa; margin: 0 -20px -20px -20px; padding: 20px; border-radius: 0 0 10px 10px;">
          <p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">Generated on: ${new Date(salarySlip.generatedAt).toLocaleDateString('en-IN')}</p>
          <p style="margin: 5px 0; color: #666;">This is an automated salary slip. Please contact HR for any queries.</p>
          <p style="margin: 10px 0 0 0; color: #ff6b35; font-weight: bold;">JMD STITCHING PRIVATE LIMITED</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `JMD Stitching PRIVATE LIMITED - Salary Slip for ${month} - ${employeeData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: white; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">JMD STITCHING PRIVATE LIMITED</h2>
            <p style="color: #fff5f0; margin: 8px 0 0 0; font-size: 18px; font-weight: 500;">Salary Slip for ${month}</p>
          </div>
          
          <!-- Message Content -->
          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Dear <strong>${employeeData.name}</strong>,</p>
            <p style="color: #666; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">Please find attached your official salary slip PDF for ${month}.</p>
            <p style="color: #666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">Download the main salary slip from your employee dashboard on the website, login here: <a href="https://jdmstitching.com/login" style="color: #ff6b35; text-decoration: none; font-weight: bold;">https://jdmstitching.com/login</a></p>
            <p style="color: #ff6b35; font-weight: bold; margin: 0; font-size: 16px;">Best regards,<br>JMD Stitching PRIVATE LIMITED Team</p>
          </div>
          
          <!-- Salary Slip Preview -->
          <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style='color:#ff6b35;font-size:16px;font-weight:bold;margin:0 0 20px 0;text-align:center;background:#f8f9fa;padding:10px;border-radius:8px;'>📄 Salary Slip Preview</div>
            ${salarySlipHTML}
          </div>
        </div>
      `,
      attachments: pdfBuffer ? [
        {
          filename: `SalarySlip-${employeeData.employeeId}-${month}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ] : [],
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending salary slip email:", error);
    throw error;
  }
};

// Generic invoice email
export const sendInvoiceEmail = async ({ to, subject, htmlText, attachments }) => {
  const transporter = createTransporter();
  const isVerified = await verifyTransporter(transporter);
  if (!isVerified) throw new Error('Email service not available');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: subject || 'Your Invoice',
    html: htmlText || '<p>Please find your invoice attached.</p>',
    attachments: attachments || [],
  };
  return transporter.sendMail(mailOptions);
};
