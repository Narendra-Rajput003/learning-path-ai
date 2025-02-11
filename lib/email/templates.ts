export const getPasswordResetEmailTemplate = (resetUrl: string, username: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: linear-gradient(to right, #2563eb, #3b82f6);
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      background: white;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello ${username},</p>
      <p>We received a request to reset your password for your LearningPath.ai account. If you didn't make this request, you can safely ignore this email.</p>
      <p>To reset your password, click the button below. This link will expire in 1 hour.</p>
      <center>
        <a href="${resetUrl}" class="button">Reset Password</a>
      </center>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>For security reasons, this link will expire in 1 hour.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} LearningPath.ai. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;