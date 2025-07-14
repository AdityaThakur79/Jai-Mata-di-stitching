import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

console.log("🔍 Checking Email Configuration...\n");

// Check if required environment variables are set
const requiredVars = [
  'EMAIL_USER',
  'EMAIL_PASS',
  'MONGODB_URL',
  'SECRETKEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

console.log("📋 Environment Variables Check:");
let allVarsSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('PASS') || varName.includes('SECRET') ? '***SET***' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allVarsSet = false;
  }
});

console.log("\n" + "=".repeat(50));

if (!allVarsSet) {
  console.log("❌ Some required environment variables are missing!");
  console.log("Please check your .env file and ensure all variables are set.");
  process.exit(1);
}

// Test email configuration
console.log("\n📧 Testing Email Configuration...");

const testEmailConfig = async () => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    console.log("🔐 Verifying email connection...");
    await transporter.verify();
    console.log("✅ Email connection verified successfully!");

    // Test sending email (optional - uncomment to test)
    /*
    console.log("📤 Testing email sending...");
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test Email - JMD System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Test Successful!</h2>
          <p>Your email configuration is working correctly.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", result.messageId);
    */

    console.log("\n🎉 Email configuration is working correctly!");
    console.log("You can now use email features in your application.");

  } catch (error) {
    console.error("❌ Email configuration test failed:");
    console.error("Error:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.log("\n💡 Troubleshooting Tips:");
      console.log("1. Make sure you're using an App Password, not your regular Gmail password");
      console.log("2. Enable 2-Factor Authentication on your Gmail account");
      console.log("3. Generate an App Password from Google Account settings");
      console.log("4. Check EMAIL_USER and EMAIL_PASS in your .env file");
    }
    
    process.exit(1);
  }
};

testEmailConfig(); 