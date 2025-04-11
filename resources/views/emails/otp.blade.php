<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your OTP Code</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <table width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #006838; color: #ffffff;">
                <h2 style="margin: 0;">Telemedicine Security Code</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 40px;">
                <p style="font-size: 16px; color: #333;">
                    Hello,
                </p>
                <p style="font-size: 16px; color: #333;">
                    Your One-Time Password (OTP) is:
                </p>
                <p style="font-size: 32px; font-weight: bold; color: #006838; text-align: center; letter-spacing: 4px; margin: 20px 0;">
                    {{ $otp }}
                </p>
                <p style="font-size: 16px; color: #555;">
                    Please use this code to complete your login. This code will expire in <strong>10 minutes</strong> for security purposes.
                </p>
                <p style="font-size: 14px; color: #999; margin-top: 30px;">
                    If you didn’t request this code, you can safely ignore this email.
                </p>
                <p style="font-size: 14px; color: #999; margin-top: 10px;">
                    Thank you,<br />
                    <strong>Telemedicine Support Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa;">
                &copy; {{ date('Y') }} Telemedicine. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>
