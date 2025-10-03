const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, resetURL, userName) {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Flood Cyclone Prediction'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: this.getPasswordResetTemplate(resetURL, userName)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendAlertToRecipients(recipients, subject, html) {
    // Use BCC to hide recipient list; fall back to 'to' if single recipient
    const hasMultiple = Array.isArray(recipients) && recipients.length > 1;
    const toAddress = hasMultiple ? (process.env.SMTP_FROM || process.env.SMTP_USER) : recipients[0];
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Flood Cyclone Prediction'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: toAddress,
      subject: subject || 'Disaster Alert Notification',
      html
    };

    if (hasMultiple) {
      mailOptions.bcc = recipients;
    }

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Alert email sent to ${hasMultiple ? recipients.length + ' recipients (bcc)' : recipients[0]}`);
    } catch (error) {
      console.error('Error sending alert email:', error);
      throw new Error('Failed to send alert emails');
    }
  }

  getAlertTemplate({ title, message, location, ctaUrl }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Area Alert'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; background: #f9fafb; }
          .container { max-width: 640px; margin: 0 auto; padding: 24px; }
          .header { background: #1f2937; color: #fff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .header h1 { margin: 0; font-size: 20px; }
          .badge { display: inline-block; background: #ef4444; color: #fff; padding: 4px 10px; border-radius: 999px; font-size: 12px; margin-top: 8px; }
          .content { background: #ffffff; padding: 24px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border: 1px solid #e5e7eb; }
          .location { color: #374151; font-weight: 600; margin: 0 0 12px; }
          .message { color: #111827; margin: 12px 0 20px; white-space: pre-line; }
          .button { display: inline-block; background: #2563eb; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title || 'Disaster Alert'}</h1>
            <span class="badge">Important</span>
          </div>
          <div class="content">
            ${location ? `<p class="location">Location: ${location}</p>` : ''}
            <div class="message">${message || 'Please stay alert and follow local authority guidance.'}</div>
            ${ctaUrl ? `<a class="button" href="${ctaUrl}" target="_blank" rel="noopener noreferrer">View Details</a>` : ''}
          </div>
          <div class="footer">
            <p>Sent by ${process.env.APP_NAME || 'Flood Cyclone Prediction System'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate(resetURL, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f8fafc; }
          .button { 
            display: inline-block; 
            background: #2563eb; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName || 'User'},</h2>
            <p>You have requested to reset your password for your Flood Cyclone Prediction account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetURL}" class="button">Reset Password</a>
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This link will expire in 10 minutes</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>For security reasons, do not share this link with anyone</li>
              </ul>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 3px;">${resetURL}</p>
          </div>
          <div class="footer">
            <p>This email was sent from Flood Cyclone Prediction System</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
