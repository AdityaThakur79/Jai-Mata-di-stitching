import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';
import { registerOTPTemplate } from "../emailTemplate/resgiterTemplate.js";
import dotenv from "dotenv";

// configing the dotenv file
dotenv.config();

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Initialize Brevo API client
const getBrevoClient = () => {
  // Check if Brevo API key is configured
  if (!process.env.BREVO_API_KEY) {
    throw new Error("Brevo API key not configured. Please set BREVO_API_KEY environment variable.");
  }

  // Initialize Brevo API client with proper authentication
  const apiInstance = new TransactionalEmailsApi();
  
  // Set API key - using the correct method
  try {
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY.trim());
    console.log('✅ Brevo API key set successfully (registerOTP)');
  } catch (error) {
    console.error('❌ Error setting Brevo API key (registerOTP):', error);
    throw new Error(`Failed to configure Brevo API: ${error.message}`);
  }

  return apiInstance;
};

// Get sender email and name from environment variables
const getSender = () => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
  const senderName = process.env.BREVO_SENDER_NAME || 'JMD Stitching';

  if (!senderEmail) {
    throw new Error("Sender email not configured. Please set BREVO_SENDER_EMAIL or EMAIL_USER environment variable.");
  }

  return { email: senderEmail, name: senderName };
};

// Function to send OTP via email
export const sendOTPEmail = async (name, email, otp) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "Your Registration OTP Code";
    sendSmtpEmail.htmlContent = registerOTPTemplate(name, otp);
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ OTP email sent successfully to ${email} via Brevo`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed. Check your BREVO_API_KEY');
      console.error('API Key status:', process.env.BREVO_API_KEY ? `Key exists (${process.env.BREVO_API_KEY.substring(0, 10)}...)` : 'Key missing');
      console.error('Response:', error.response?.data);
    }
    throw error;
  }
};
