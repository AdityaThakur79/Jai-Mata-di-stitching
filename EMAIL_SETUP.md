# Email Setup Guide for JMD Stitching System

This guide will help you configure email functionality for the JMD Stitching System, including OTP verification and salary slip emails.

## Prerequisites

1. **Gmail Account**: You need a Gmail account
2. **2-Factor Authentication**: Enable 2FA on your Gmail account
3. **App Password**: Generate an App Password for the application

## Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate App Password

1. In your Google Account settings, go to "Security"
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Click "Generate"
5. **Copy the 16-character password** (you'll only see it once!)

## Step 3: Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Standardized)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Database
MONGODB_URL=your-mongodb-connection-string

# JWT Secret
SECRETKEY=your-jwt-secret-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Step 4: Test Email Configuration

Run the test script to verify your email setup:

```bash
node test-email.js
```

This will:
- Check if all environment variables are set
- Verify email connection
- Test email sending (optional)

## Step 5: Features Available

Once configured, you can use:

### 1. OTP Email for Registration
- Sends 6-digit OTP to new users during registration
- Uses `utils/common/registerOTP.js`

### 2. Salary Slip Emails
- Sends salary slips to employees
- Includes detailed salary breakdown
- Uses `utils/common/sendMail.js`

## Troubleshooting

### Common Issues:

1. **"Invalid login" Error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2FA is enabled on your Gmail account
   - Regenerate the App Password if needed

2. **"Missing credentials" Error**
   - Check that `EMAIL_USER` and `EMAIL_PASS` are set in your `.env` file
   - Ensure no extra spaces or quotes around the values

3. **"Connection timeout" Error**
   - Check your internet connection
   - Verify Gmail SMTP settings are correct
   - Try again in a few minutes

### Security Notes:

- **Never commit your `.env` file** to version control
- **Use App Passwords** instead of your regular Gmail password
- **Rotate App Passwords** periodically for security
- **Use environment variables** in production

## Production Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Remove `tls: { rejectUnauthorized: false }` from email configuration
3. Use a dedicated email service (SendGrid, AWS SES) for better reliability
4. Implement email rate limiting to avoid Gmail restrictions

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are correctly set
3. Test with the provided test script
4. Ensure your Gmail account allows "less secure app access" or use App Passwords

---

**Note**: This system now uses standardized email configuration across all features. Both OTP emails and salary slip emails use the same `EMAIL_USER` and `EMAIL_PASS` environment variables. 