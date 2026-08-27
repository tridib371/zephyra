const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // SSL
        auth: {
            user: user.trim(),
            pass: pass.trim().replace(/\s+/g, ''), // Strip spaces from Gmail 16-character App Password
        },
        connectionTimeout: 10000, // 10s timeout
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

/**
 * Send 6-digit OTP verification email for registration
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (toEmail, otp) => {
    const transporter = createTransporter();

    // High-End Custom Branded Zephyra HTML Email Template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zephyra Email Verification Code</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #F8F5F0;
                margin: 0;
                padding: 30px 15px;
                color: #1E293B;
                -webkit-font-smoothing: antialiased;
            }
            .wrapper {
                max-width: 520px;
                margin: 0 auto;
                background: #FFFFFF;
                border-radius: 28px;
                overflow: hidden;
                box-shadow: 0 15px 35px rgba(0,0,0,0.07);
                border: 2px solid #000000;
            }
            .header-banner {
                background: linear-gradient(135deg, #FF8F6B 0%, #E2774C 50%, #F5C36B 100%);
                padding: 40px 24px 34px;
                text-align: center;
                border-bottom: 2px solid #000000;
            }
            .logo-title {
                font-size: 32px;
                font-weight: 900;
                color: #1A140D;
                letter-spacing: -0.5px;
                margin: 0;
                font-style: italic;
            }
            .tagline {
                font-size: 13px;
                color: #382414;
                font-weight: 800;
                margin-top: 6px;
                letter-spacing: 0.5px;
            }
            .main-content {
                padding: 40px 32px 36px;
                text-align: center;
            }
            .badge {
                display: inline-block;
                padding: 6px 16px;
                background: #FFF7ED;
                border: 1.5px solid #EA580C;
                color: #C2410C;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 18px;
            }
            .heading {
                font-size: 24px;
                font-weight: 900;
                color: #0F172A;
                margin: 0 0 12px;
            }
            .description {
                font-size: 14px;
                color: #475569;
                line-height: 1.6;
                margin: 0 auto 30px;
                max-width: 420px;
                font-weight: 500;
            }
            .otp-container {
                background: #FFF9F5;
                border: 2px solid #000000;
                border-radius: 20px;
                padding: 24px 16px;
                margin: 0 auto 28px;
                max-width: 360px;
                box-shadow: 4px 4px 0px #000000;
            }
            .otp-code {
                font-size: 42px;
                font-weight: 900;
                letter-spacing: 12px;
                color: #C2410C;
                font-family: 'Courier New', Courier, monospace;
                margin-left: 12px; /* balance letter-spacing */
                line-height: 1;
            }
            .timer-badge {
                font-size: 12px;
                color: #C2410C;
                font-weight: 800;
                margin-top: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .divider {
                height: 1px;
                background: #E2E8F0;
                margin: 28px 0;
            }
            .security-note {
                font-size: 12px;
                color: #64748B;
                line-height: 1.5;
                text-align: left;
                background: #F8FAFC;
                padding: 16px 18px;
                border-radius: 14px;
                border: 1px solid #E2E8F0;
            }
            .footer {
                background: #F8FAFC;
                padding: 22px 20px;
                text-align: center;
                font-size: 12px;
                color: #64748B;
                border-top: 1px solid #E2E8F0;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <!-- Header -->
            <div class="header-banner">
                <h1 class="logo-title">Zephyra</h1>
                <p class="tagline">Where your voice carries on the wind</p>
            </div>

            <!-- Content Area -->
            <div class="main-content">
                <div class="badge">Security Verification</div>
                <h2 class="heading">Confirm Your Registration</h2>
                <p class="description">
                    Welcome to <strong>Zephyra</strong>! Enter the 6-digit verification code below to verify your email address and activate your account.
                </p>

                <!-- OTP Code Display Box -->
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <div class="timer-badge">
                        ⏱️ Code expires in <strong>10 minutes</strong>
                    </div>
                </div>

                <div class="security-note">
                    🔒 <strong>Security Tip:</strong> Never share this one-time code with anyone. Zephyra administrators will never ask for your verification code or password.
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                &copy; ${new Date().getFullYear()} Zephyra Platform &bull; Designed for distraction-free social expression
            </div>
        </div>
    </body>
    </html>
    `;

    console.log(`\n========================================`);
    console.log(`📨 [ZEPHYRA OTP VERIFICATION]`);
    console.log(`To      : ${toEmail}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Time    : ${new Date().toLocaleTimeString()}`);
    console.log(`Expires : In 10 minutes`);
    console.log(`========================================\n`);

    if (!transporter) {
        console.warn('⚠️ EMAIL_USER and EMAIL_PASS are not configured in backend/.env.');
        console.warn('⚠️ To send live emails to inboxes, add EMAIL_USER and EMAIL_PASS to backend/.env.');
        return {
            success: true,
            mode: 'console_only',
            message: 'OTP logged to console. Configure EMAIL_USER and EMAIL_PASS in .env to deliver to inboxes.',
        };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Zephyra" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `${otp} is your Zephyra verification code`,
            text: `Your Zephyra verification code is: ${otp}. This code is valid for 10 minutes.`,
            html: htmlContent,
        });

        console.log(`✅ Email delivered to ${toEmail}! MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (error) {
        console.error('❌ Error sending OTP email via nodemailer:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOtpEmail,
};
