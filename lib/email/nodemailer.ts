import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@parentcircle.com';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;


const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, 
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    
    if (!SMTP_USER || !SMTP_PASS) {
      console.log('📧 Email would be sent (no SMTP configured):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Body:', text || html);
      return { success: true, messageId: 'dev-mode' };
    }

    const info = await transporter.sendMail({
      from: `"ParentCircle" <${EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw new Error('Failed to send email');
  }
}

export const emailTemplates = {
  passwordReset: (resetUrl: string, username: string) => ({
    subject: 'Reset Your Password - ParentCircle',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #fce7f3 0%, #ddd6fe 100%);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            }
            .logo {
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              width: 60px;
              height: 60px;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 10px;
            }
            p {
              color: #4b5563;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 9999px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #6b7280;
            }
            .link {
              color: #ec4899;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">👶</div>
            <h1>Reset Your Password</h1>
            <p>Hi ${username},</p>
            <p>We received a request to reset your password for your ParentCircle account.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p class="footer">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" class="link">${resetUrl}</a>
            </p>
            <p class="footer">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hi ${username},

      We received a request to reset your password for your ParentCircle account.

      Click the link below to reset your password (expires in 1 hour):
      ${resetUrl}

      If you didn't request a password reset, you can safely ignore this email.

      - The ParentCircle Team
    `,
  }),

  welcomeEmail: (username: string) => ({
    subject: 'Welcome to ParentCircle! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #fce7f3 0%, #ddd6fe 100%);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            }
            .logo {
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              width: 60px;
              height: 60px;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 10px;
            }
            p {
              color: #4b5563;
              margin-bottom: 20px;
            }
            .features {
              text-align: left;
              margin: 30px 0;
              background: white;
              padding: 20px;
              border-radius: 12px;
            }
            .feature {
              margin: 15px 0;
              display: flex;
              align-items: start;
            }
            .feature-icon {
              font-size: 24px;
              margin-right: 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 9999px;
              font-weight: 600;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">👶</div>
            <h1>Welcome to ParentCircle! 🎉</h1>
            <p>Hi ${username},</p>
            <p>We're so excited to have you join our community of parents!</p>
            
            <div class="features">
              <div class="feature">
                <span class="feature-icon">📸</span>
                <div>
                  <strong>Share Milestones</strong><br>
                  Celebrate every first with photos and videos
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">👥</span>
                <div>
                  <strong>Connect with Parents</strong><br>
                  Join groups and build your support network
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">📊</span>
                <div>
                  <strong>Track Growth</strong><br>
                  Monitor your baby's development privately
                </div>
              </div>
            </div>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed" class="button">
              Explore Your Feed
            </a>
            
            <p>Questions? Reply to this email anytime!</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hi ${username},

      Welcome to ParentCircle! We're so excited to have you join our community.

      Here's what you can do:
      • Share milestones with photos and videos
      • Connect with other parents in groups
      • Track your baby's growth privately

      Start exploring: ${process.env.NEXT_PUBLIC_APP_URL}/feed

      Questions? Just reply to this email!

      - The ParentCircle Team
    `,
  }),
};