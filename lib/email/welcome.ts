export const getWelcomeEmailTemplate = (username: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #2563eb, #3b82f6);
      color: white;
      padding: 40px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .feature {
      margin: 20px 0;
      padding: 15px;
      background: #f8fafc;
      border-radius: 6px;
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
    .social-links {
      text-align: center;
      margin-top: 30px;
    }
    .social-links a {
      margin: 0 10px;
      color: #2563eb;
      text-decoration: none;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #64748b;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to LearningPath.ai!</h1>
    </div>
    <div class="content">
      <h2>Hi ${username},</h2>
      <p>We're thrilled to have you join our community of learners! LearningPath.ai is your personal guide to mastering new technologies and skills.</p>

      <div class="feature">
        <h3>🎯 Getting Started</h3>
        <p>Create your first learning path by:</p>
        <ol>
          <li>Choose a technology or skill you want to learn</li>
          <li>Let our AI generate a personalized roadmap</li>
          <li>Track your progress and start learning!</li>
        </ol>
      </div>

      <div class="feature">
        <h3>✨ Key Features</h3>
        <ul>
          <li>AI-powered learning paths</li>
          <li>Interactive mind maps</li>
          <li>Progress tracking</li>
          <li>Curated learning resources</li>
          <li>Community support</li>
        </ul>
      </div>

      <center>
        <a href="https://learningpath.ai/dashboard" class="button">Start Your Learning Journey</a>
      </center>

      <p>Need help? Our support team is always here to assist you at <a href="mailto:support@learningpath.ai">support@learningpath.ai</a></p>

      <div class="social-links">
        <a href="https://twitter.com/learningpathai">Twitter</a> |
        <a href="https://linkedin.com/company/learningpathai">LinkedIn</a> |
        <a href="https://github.com/learningpathai">GitHub</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} LearningPath.ai. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;