const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP or standard SMTP
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass, // Gmail App Password (16 characters without spaces)
        },
    });
};

/**
 * Send 6-digit OTP verification email for registration
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (toEmail, otp) => {
    const transporter = createTransporter();

    // Branded Zephyra HTML Email Template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zephyra Email Verification</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #F8F5F0;
                margin: 0;
                padding: 24px;
                color: #1E293B;
            }
            .container {
                max-width: 520px;
                margin: 0 auto;
                background: #FFFFFF;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                border: 1px solid #E2E8F0;
            }
            .header {
                background: linear-gradient(135deg, #FF8F6B 0%, #E2774C 50%, #F5C36B 100%);
                padding: 36px 24px;
                text-align: center;
            }
            .logo {
                font-size: 28px;
                font-weight: 900;
                color: #1A140D;
                letter-spacing: -0.5px;
                margin: 0;
            }
            .tagline {
                font-size: 13px;
                color: #382414;
                font-weight: 700;
                margin-top: 6px;
            }
            .content {
                padding: 36px 32px;
                text-align: center;
            }
            .title {
                font-size: 20px;
                font-weight: 800;
                color: #0F172A;
                margin-bottom: 12px;
            }
            .desc {
                font-size: 14px;
                color: #64748B;
                line-height: 1.6;
                margin-bottom: 28px;
            }
            .otp-box {
                background: #FFF7ED;
                border: 2px dashed #EA580C;
                border-radius: 18px;
                padding: 20px;
                margin: 0 auto 28px;
                display: inline-block;
            }
            .otp-code {
                font-size: 38px;
                font-weight: 900;
                letter-spacing: 8px;
                color: #C2410C;
                font-family: 'Courier New', Courier, monospace;
            }
            .expire-note {
                font-size: 12px;
                color: #EA580C;
                font-weight: 700;
                margin-top: 8px;
            }
            .security-warning {
                font-size: 12px;
                color: #94A3B8;
                border-top: 1px solid #F1F5F9;
                padding-top: 20px;
                line-height: 1.5;
            }
            .footer {
                background: #F8FAFC;
                padding: 20px;
                text-align: center;
                font-size: 11px;
                color: #94A3B8;
                border-top: 1px solid #E2E8F0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">Zephyra</h1>
                <p class="tagline">Where your voice carries on the wind</p>
            </div>
            <div class="content">
                <h2 class="title">Verify Your Email Address</h2>
                <p class="desc">
                    Thank you for signing up for Zephyra! Please use the following 6-digit verification code to complete your registration.
                </p>
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <div class="expire-note">Valid for 10 minutes</div>
                </div>
                <p class="security-warning">
                    If you did not request this verification code, please ignore this email or contact support if you suspect unauthorized activity. Never share this OTP with anyone.
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Zephyra Platform. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;

    console.log(`\n========================================`);
    console.log(`📨 [ZEPHYRA OTP VERIFICATION]`);
    console.log(`Recipient: ${toEmail}`);
    console.log(`OTP Code : ${otp}`);
    console.log(`Expires  : In 10 minutes`);
    console.log(`========================================\n`);

    if (!transporter) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS not found in .env. OTP logged to console above for development.');
        return { success: true, mode: 'console' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Zephyra" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `${otp} is your Zephyra verification code`,
            text: `Your Zephyra verification code is: ${otp}. This code is valid for 10 minutes.`,
            html: htmlContent,
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (error) {
        console.error('❌ Error sending OTP email via nodemailer:', error);
        // Fallback to console so user can still register during local dev
        return { success: true, mode: 'console_fallback', error: error.message };
    }
};

module.exports = {
    sendOtpEmail,
};
