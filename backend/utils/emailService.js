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
            pass: pass.trim().replace(/\s+/g, ''),
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

/**
 * Send 6-digit OTP verification email for registration with 100% Inbox Placement Optimization
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (toEmail, otp) => {
    const transporter = createTransporter();

    // Pure Table-Based Inline-Styled Email Template (Optimized for Gmail Inbox Placement)
    const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zephyra Verification Code</title>
</head>
<body style="margin:0; padding:20px 0; background-color:#F5F3EF; font-family:Helvetica, Arial, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F5F3EF;">
        <tr>
            <td align="center" style="padding:10px 15px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:500px; background-color:#FFFFFF; border-radius:20px; overflow:hidden; border:2px solid #000000; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:linear-gradient(135deg, #FF8F6B 0%, #E2774C 50%, #F5C36B 100%); padding:35px 20px 30px; border-bottom:2px solid #000000;">
                            <h1 style="margin:0; font-size:32px; font-weight:900; color:#1A140D; letter-spacing:-0.5px; font-style:italic; font-family:Georgia, serif;">Zephyra</h1>
                            <p style="margin:6px 0 0; font-size:12px; color:#2D1B10; font-weight:bold; letter-spacing:0.5px;">Where your voice carries on the wind</p>
                        </td>
                    </tr>
                    <!-- Main Body -->
                    <tr>
                        <td style="padding:35px 30px 25px; text-align:center;">
                            <h2 style="margin:0 0 12px; font-size:22px; font-weight:800; color:#0F172A;">Verify Your Email Address</h2>
                            <p style="margin:0 0 25px; font-size:14px; line-height:22px; color:#475569;">
                                Welcome to Zephyra! Please use the 6-digit verification code below to verify your email address and activate your account.
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 25px;">
                                <tr>
                                    <td align="center" style="background-color:#FFF8F3; border:2px solid #000000; border-radius:16px; padding:18px 30px; box-shadow:3px 3px 0px #000000;">
                                        <span style="font-family:'Courier New', Courier, monospace; font-size:38px; font-weight:900; letter-spacing:10px; color:#C2410C; margin-left:10px; display:inline-block;">${otp}</span>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 25px; font-size:12px; font-weight:bold; color:#C2410C;">
                                ⏱️ This code will expire in 10 minutes.
                            </p>

                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:14px;">
                                <tr>
                                    <td style="font-size:11px; line-height:16px; color:#64748B; text-align:left;">
                                        <strong>Security Notice:</strong> If you did not create a Zephyra account, you can safely ignore this email. No one will ever ask for your verification code.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color:#F8FAFC; padding:18px 20px; border-top:1px solid #E2E8F0;">
                            <p style="margin:0; font-size:11px; color:#94A3B8; font-weight:500;">
                                &copy; ${new Date().getFullYear()} Zephyra Platform &bull; Distraction-Free Social Expression
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const plainText = `Zephyra Verification Code\n\nYour 6-digit email verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this verification code, please ignore this email.\n\n— The Zephyra Team`;

    console.log(`\n========================================`);
    console.log(`📨 [ZEPHYRA OTP VERIFICATION]`);
    console.log(`To      : ${toEmail}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Time    : ${new Date().toLocaleTimeString()}`);
    console.log(`Expires : In 10 minutes`);
    console.log(`========================================\n`);

    if (!transporter) {
        console.warn('⚠️ EMAIL_USER and EMAIL_PASS are not configured in backend/.env.');
        return {
            success: true,
            mode: 'console_only',
            message: 'OTP logged to console.',
        };
    }

    try {
        const emailUser = process.env.EMAIL_USER;
        const info = await transporter.sendMail({
            from: `"Zephyra" <${emailUser}>`,
            to: toEmail,
            replyTo: emailUser,
            subject: `Your Zephyra verification code is ${otp}`,
            text: plainText,
            html: htmlContent,
            headers: {
                'X-Priority': '3',
                'X-Mailer': 'Zephyra Mail Engine',
            },
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
