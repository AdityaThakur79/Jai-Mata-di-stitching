import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

// Logo is now hosted at https://jmdstitching.com/images/jmd_logo.jpeg
// No need for local file conversion

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
    console.log('✅ Brevo API key set successfully');
  } catch (error) {
    console.error('❌ Error setting Brevo API key:', error);
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

// Convert buffer to base64 for Brevo attachments
const bufferToBase64 = (buffer) => {
  if (Buffer.isBuffer(buffer)) {
    return buffer.toString('base64');
  }
  return Buffer.from(buffer).toString('base64');
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "OTP for Registration";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p>Your OTP for registration is: <strong style="color: #007bff; font-size: 24px;">${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `;
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ OTP email sent successfully via Brevo');
    return result;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed. Check your BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Key exists but invalid' : 'Key missing');
      console.error('Response:', error.response?.data);
    }
    throw error;
  }
};

// Send salary slip email
export const sendSalarySlipEmail = async (email, employeeData, salarySlip, month, pdfBuffer) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();

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

    const htmlContent = `
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
    `;

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `JMD Stitching PRIVATE LIMITED - Salary Slip for ${month} - ${employeeData.name}`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: email }];

    // Add PDF attachment if provided
    if (pdfBuffer) {
      sendSmtpEmail.attachment = [{
        name: `SalarySlip-${employeeData.employeeId}-${month}.pdf`,
        content: bufferToBase64(pdfBuffer)
      }];
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Salary slip email sent successfully via Brevo');
    return result;
  } catch (error) {
    console.error("❌ Error sending salary slip email:", error);
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed. Check your BREVO_API_KEY');
      console.error('Response:', error.response?.data);
    }
    throw error;
  }
};

// Generic invoice email
export const sendInvoiceEmail = async ({ to, subject, htmlText, attachments }) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = subject || 'Your Invoice';
    sendSmtpEmail.htmlContent = htmlText || '<p>Please find your invoice attached.</p>';
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: to }];

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      sendSmtpEmail.attachment = attachments.map(att => ({
        name: att.filename,
        content: bufferToBase64(att.content)
      }));
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Invoice email sent successfully via Brevo');
    return result;
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed. Check your BREVO_API_KEY');
      console.error('Response:', error.response?.data);
    }
    throw error;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async ({ clientName, clientEmail, billNumber, orderType, totalAmount, paymentStatus, isAdminCopy = false, pdfUrl = null, pdfBuffer = null }) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();
    
    let pdfAttachment = null;
    
    if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
      pdfAttachment = {
        name: `Invoice-${billNumber}.pdf`,
        content: bufferToBase64(pdfBuffer)
      };
    } else if (pdfUrl) {
      try {
        const pdfResponse = await fetch(pdfUrl);
        if (pdfResponse.ok) {
          const pdfArrayBuffer = await pdfResponse.arrayBuffer();
          pdfAttachment = {
            name: `Invoice-${billNumber}.pdf`,
            content: bufferToBase64(Buffer.from(pdfArrayBuffer))
          };
        }
      } catch (error) {
        // PDF attachment failed, continue without it
        console.warn('Failed to fetch PDF from URL:', error);
      }
    }

    const logoUrl = 'https://jmdstitching.com/images/jmd_logo.jpeg';
    
    const greeting = isAdminCopy ? "New Order Alert" : `Dear ${clientName}`;
    const headerText = isAdminCopy ? "Order Notification" : "Order Confirmation";
    
    const orderConfirmationHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
            <tr>
              <td>
                <img src="${logoUrl}" alt="JMD Stitching Logo" width="200" height="150" style="max-width: 200px; height: auto; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: block;" />
              </td>
            </tr>
          </table>
          <h2 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">JMD STITCHING PRIVATE LIMITED</h2>
          <p style="color: #fff5f0; margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">${headerText}</p>
        </div>
        
        <!-- Message Content -->
        <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">${greeting},</p>
          ${!isAdminCopy ? `
          <p style="color: #666; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">Thank you for your order with JMD Stitching PVT LTD!</p>
          <p style="color: #666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">Your order is confirmed.</p>
          ` : `
          <p style="color: #666; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">A new order has been placed with JMD Stitching PVT LTD.</p>
          `}
          ${!isAdminCopy ? `
          <p style="color: #ff6b35; font-weight: bold; margin: 0; font-size: 16px;">If you have any questions, just reply to this message.</p>
          <p style="color: #ff6b35; font-weight: bold; margin: 20px 0 0 0; font-size: 16px;">Team JMD Stitching</p>
          ` : ''}
        </div>
        
        <!-- Order Details -->
        <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style='color:#ff6b35;font-size:20px;font-weight:bold;margin:0 0 25px 0;text-align:center;background:linear-gradient(135deg, #fff5f0 0%, #f8f9fa 100%);padding:15px;border-radius:8px;letter-spacing:1px;'>
            📋 ORDER DETAILS
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #fff5f0 0%, #f8f9fa 100%); padding: 20px; border-radius: 10px; border-left: 5px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h3 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">📄 Order Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500; font-size: 14px;">Bill No:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 15px;">${billNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500; font-size: 14px;">Order Type:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 15px; text-transform: capitalize;">${orderType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500; font-size: 14px;">Payment Status:</td>
                  <td style="padding: 8px 0; font-weight: bold; font-size: 15px;">
                    <span style="background: ${paymentStatus.toLowerCase() === 'pending' ? '#fff3cd' : paymentStatus.toLowerCase() === 'partial' ? '#cfe2ff' : '#d1e7dd'}; color: ${paymentStatus.toLowerCase() === 'pending' ? '#856404' : paymentStatus.toLowerCase() === 'partial' ? '#084298' : '#0f5132'}; padding: 4px 10px; border-radius: 5px; display: inline-block;">
                      ${paymentStatus}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: linear-gradient(135deg, #fff5f0 0%, #f8f9fa 100%); padding: 20px; border-radius: 10px; border-left: 5px solid #ff6b35; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h3 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">💰 Payment Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-top: 3px solid #ff6b35; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); border-radius: 8px; margin-top: 10px;">
                  <td style="padding: 15px 10px; font-weight: bold; font-size: 18px; color: white;">Total:</td>
                  <td style="padding: 15px 10px; font-weight: bold; font-size: 22px; color: white;">₹${Number(totalAmount).toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 14px; border-top: 2px solid #ff6b35; padding-top: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #fff5f0 100%); margin: 0 -20px -20px -20px; padding: 25px 20px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ff6b35;">
            <p style="margin: 3px 0; color: #ff6b35; font-weight: bold; font-size: 16px;">JMD STITCHING PRIVATE LIMITED</p>
            <p style="margin: 3px 0; color: #666; font-size: 13px;">Visit Us: www.jmdstitching.com</p>
          </div>
          <p style="margin: 5px 0; color: #ff6b35; font-weight: bold; font-size: 13px;">Generated on: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">This is an automated order confirmation. Please contact us for any queries.</p>
        </div>
      </div>
    `;

    const subject = isAdminCopy 
      ? `New Order Alert - ${billNumber} - ${orderType}` 
      : `JMD Stitching - Order Confirmation ${billNumber}`;
    
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = orderConfirmationHTML;
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: clientEmail }];

    // Add PDF attachment if available
    if (pdfAttachment) {
      sendSmtpEmail.attachment = [pdfAttachment];
    }

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Order confirmation email sent successfully via Brevo');
        return result;
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", error);
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed. Check your BREVO_API_KEY');
      console.error('API Key status:', process.env.BREVO_API_KEY ? `Key exists (${process.env.BREVO_API_KEY.substring(0, 10)}...)` : 'Key missing');
      console.error('Response:', error.response?.data);
    }
    throw error;
  }
};

// Send joining letter email
export const sendJoiningLetterEmail = async ({ name, email, employeeId, role, baseSalary, joiningDate }) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();
    const logoUrl = 'https://jmdstitching.com/images/jmd_logo.jpeg';
    
    const formattedSalary = Number(baseSalary || 15000).toLocaleString('en-IN');
    const formattedDate = new Date(joiningDate || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #fcfcfc; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 30px; text-align: center; color: white;">
          <img src="${logoUrl}" alt="JMD Stitching Logo" width="120" height="90" style="max-width: 120px; height: auto; background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-block; margin-bottom: 20px;" />
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Welcome to JMD Stitching!</h1>
          <p style="margin: 5px 0 0 0; font-size: 15px; color: #fff5f0; font-weight: 500;">OFFICIAL LETTER OF APPOINTMENT</p>
        </div>

        <!-- Body -->
        <div style="padding: 35px 30px; color: #2d3748; line-height: 1.6;">
          <p style="font-size: 17px; margin-top: 0; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #4a5568; margin-bottom: 25px;">
            Congratulations! We are absolutely thrilled to welcome you to the <strong>JMD Stitching Private Limited</strong> family. We are impressed by your credentials and look forward to a mutually successful association.
          </p>

          <!-- Employment Summary Box -->
          <div style="background: #f8fafc; border-left: 4px solid #ff6b35; border-radius: 6px; padding: 20px; margin-bottom: 30px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #ff6b35; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">💼 Employment Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #718096; width: 40%;">Employee ID:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #1a202c;">${employeeId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096;">Assigned Role:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #1a202c; text-transform: capitalize;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096;">Base Salary:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #2f855a; font-size: 16px;">₹${formattedSalary} / month</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096;">Joining Date:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #1a202c;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <!-- Terms and Conditions -->
          <div style="margin-bottom: 30px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #ff6b35; font-size: 16px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">📋 Basic Terms &amp; Conditions</h3>
            <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #4a5568;">
              <li style="margin-bottom: 8px;"><strong>Working Hours:</strong> Standard working hours are from 9:30 AM to 6:30 PM, Monday through Saturday.</li>
              <li style="margin-bottom: 8px;"><strong>Probationary Period:</strong> You will be on probation for the first three (3) months. Upon successful performance review, your employment status will be formalized.</li>
              <li style="margin-bottom: 8px;"><strong>Attendance &amp; Barcode:</strong> You will be issued a digital ID card containing a barcode. It is mandatory to scan this barcode daily for clocking in/out. Do not share or allow others to use your barcode.</li>
              <li style="margin-bottom: 8px;"><strong>Notice Period:</strong> Should you wish to resign, a one (1) month written notice is required, or basic pay in lieu thereof.</li>
              <li style="margin-bottom: 8px;"><strong>Confidentiality:</strong> You must protect and maintain absolute secrecy regarding the Company’s proprietary designs, client data, fabric patterns, pricing, and system data.</li>
              <li style="margin-bottom: 8px;"><strong>Punctuality &amp; Discipline:</strong> Promptness is expected. Unexcused absences, non-compliance, or misconduct will invite disciplinary action, up to immediate termination.</li>
            </ul>
          </div>

          <!-- Access credentials info -->
          <div style="background-color: #fffaf0; border: 1px dashed #feebc8; border-radius: 8px; padding: 15px; margin-bottom: 30px; font-size: 13.5px; color: #dd6b20; text-align: center;">
            <strong>Pro Tip:</strong> Log in to the employee dashboard at <a href="https://jmdstitching.com/login" style="color: #dd6b20; text-decoration: underline; font-weight: bold;">https://jmdstitching.com/login</a> to view your profile and salary slips.
          </div>

          <p style="font-size: 15px; margin-bottom: 0;">
            Please accept our heartiest congratulations. We are excited about what we can accomplish together!
          </p>
          
          <p style="margin-top: 25px; margin-bottom: 0; font-size: 15px; color: #4a5568;">
            Best regards,<br />
            <strong>HR Operations</strong><br />
            JMD Stitching Private Limited
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
          This is a system-generated appointment letter. Reply to this mail if you have any questions or require support.
          <br /><br />
          &copy; ${new Date().getFullYear()} JMD Stitching Private Limited. All Rights Reserved.
        </div>
      </div>
    `;

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `Appointment Letter & Joining Welcome - ${name} (${employeeId})`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Joining letter welcome email sent successfully');
    return result;
  } catch (error) {
    console.error("❌ Error sending joining letter email:", error);
    throw error;
  }
};

// Send resignation letter email
export const sendResignationEmail = async ({ name, email, employeeId, role, resignationDate }) => {
  try {
    const apiInstance = getBrevoClient();
    const sender = getSender();
    const logoUrl = 'https://jmdstitching.com/images/jmd_logo.jpeg';
    
    const formattedDate = new Date(resignationDate || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #fcfcfc; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 30px; text-align: center; color: white;">
          <img src="${logoUrl}" alt="JMD Stitching Logo" width="120" height="90" style="max-width: 120px; height: auto; background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-block; margin-bottom: 20px;" />
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Resignation Processed</h1>
          <p style="margin: 5px 0 0 0; font-size: 15px; color: #fff5f0; font-weight: 500;">ACCOUNT DEACTIVATION &amp; EXIT CONFIRMATION</p>
        </div>

        <!-- Body -->
        <div style="padding: 35px 30px; color: #2d3748; line-height: 1.6;">
          <p style="font-size: 17px; margin-top: 0; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #4a5568; margin-bottom: 25px;">
            This email confirms that your resignation from your position as <strong>${role}</strong> at JMD Stitching Private Limited has been processed and accepted, effective on <strong>${formattedDate}</strong>.
          </p>

          <!-- Deactivation Alert Summary Box -->
          <div style="background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px; padding: 20px; margin-bottom: 30px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #c53030; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">⚠️ Deactivation Summary</h3>
            <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #2d3748;">
              <li style="margin-bottom: 8px;"><strong>Account Status:</strong> Deactivated instantly. You can no longer log in to the employee dashboard or workbenches.</li>
              <li style="margin-bottom: 8px;"><strong>ID Card:</strong> Rendered invalid. It cannot be used for company premises access or representation.</li>
              <li style="margin-bottom: 8px;"><strong>Barcode:</strong> Permanently deactivated in the scanning system. Any attempts to scan this barcode for attendance or order slip work will fail automatically.</li>
            </ul>
          </div>

          <p style="font-size: 15px; color: #4a5568; margin-bottom: 20px;">
            Please ensure you have returned all company property, inventory, design sheets, or tools in your possession to your branch manager. Your final settlement (full and final) including pending dues will be cleared in due course as per company policy.
          </p>

          <p style="font-size: 15px; margin-bottom: 0;">
            We thank you for your contributions and dedicated service during your tenure with us, and we wish you all the very best in your future career endeavors.
          </p>
          
          <p style="margin-top: 25px; margin-bottom: 0; font-size: 15px; color: #4a5568;">
            Best regards,<br />
            <strong>Exit Clearance Team</strong><br />
            JMD Stitching Private Limited
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
          This is an automated exit and deactivation confirmation email. If you believe this resignation was marked in error, please immediately contact JMD Stitching HR Support.
          <br /><br />
          &copy; ${new Date().getFullYear()} JMD Stitching Private Limited. All Rights Reserved.
        </div>
      </div>
    `;

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `Exit & Resignation Confirmation - ${name} (${employeeId})`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { email: sender.email, name: sender.name };
    sendSmtpEmail.to = [{ email: email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Resignation letter confirmation email sent successfully');
    return result;
  } catch (error) {
    console.error("❌ Error sending resignation confirmation email:", error);
    throw error;
  }
};

