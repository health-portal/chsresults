export class SendEmailSchema {
  toEmail: string;
  subject: string;
  htmlContent: string;
}

export class ResetPasswordSchema {
  name: string;
  otp: string;
}

export class InvitationSchema {
  name: string;
  registrationLink: string;
}

export class NotificationSchema {
  name: string;
  title: string;
  message: string;
  portalLink: string;
}

export const ResetPasswordTemplate = ({ name, otp }: ResetPasswordSchema) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password (OTP)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #2d4a3e; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; color: #333; text-align: center; }
        .otp-box { display: inline-block; background-color: #f0f0f0; color: #2d4a3e; font-size: 24px; letter-spacing: 3px; padding: 15px 25px; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; padding: 10px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Obafemi Awolowo University</h2>
            <p>College of Health Sciences</p>
        </div>
        <div class="content">
            <h3>Your One-Time Password (OTP)</h3>
            <p>Hello, ${name},</p>
            <p>Use the OTP below to complete your verification or login process. This code will expire in 10 minutes.</p>
            <div class="otp-box">${otp}</div>
            <p>If you didn’t request this code, you can safely ignore this email.</p>
            <p>Best regards,<br>OAU College of Health Sciences Team</p>
        </div>
        <div class="footer">
            <p>© 2025 Obafemi Awolowo University College of Health Sciences. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

export const InvitationTemplate = ({
  name,
  registrationLink,
}: InvitationSchema) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Join OAU Health Sciences Portal</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #2d4a3e; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; color: #333; }
        .button { display: inline-block; background-color: #2d4a3e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 10px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Obafemi Awolowo University</h2>
            <p>College of Health Sciences</p>
        </div>
        <div class="content">
            <h3>You're Invited to Join the Results Portal</h3>
            <p>Hello, ${name},</p>
            <p>You have been invited to join the OAU College of Health Sciences Results Portal. This platform will allow you to access your academic results and other important information.</p>
            <p>Click the button below to create your account:</p>
            <p><a href="${registrationLink}" class="button">Join Now</a></p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>OAU College of Health Sciences Team</p>
        </div>
        <div class="footer">
            <p>© 2025 Obafemi Awolowo University College of Health Sciences. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

export const NotificationTemplate = ({
  name,
  title,
  message,
  portalLink,
}: NotificationSchema) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Notification</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #2d4a3e; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; color: #333; }
        .button { display: inline-block; background-color: #2d4a3e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 10px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Obafemi Awolowo University</h2>
            <p>College of Health Sciences</p>
        </div>
        <div class="content">
            <h3>${title}</h3>
            <p>Hello, ${name},</p>
            <p>${message}</p>
            <p>For more details, visit the portal:</p>
            <p><a href="${portalLink}" class="button">Go to Portal</a></p>
            <p>Best regards,<br>OAU College of Health Sciences Team</p>
        </div>
        <div class="footer">
            <p>© 2025 Obafemi Awolowo University College of Health Sciences. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
