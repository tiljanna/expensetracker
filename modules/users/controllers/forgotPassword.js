const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw "Email is required!";
  }

  // Check if user exists in the database
  const getUser = await usersModel.findOne({ email });
  if (!getUser) {
    throw "This email does not exist in the system!";
  }

  // Generate a random reset code
  const resetCode = Math.floor(10000 + Math.random() * 90000);

  // Update reset_code field in the database
  await usersModel.updateOne(
    { email },
    { reset_code: resetCode },
    { runValidators: true }
  );

  // Configure Nodemailer with SMTP settings
  const transport = nodemailer.createTransport({
    host: "smtp.mailersend.net",
    port: 587,
    auth: {
      user: "MS_4cojpc@trial-neqvygm7n2jg0p7w.mlsender.net",
      pass: "3PVbEJIVQT4xRcEr",
    },
  });

  // Custom HTML template for the email
  const htmlTemplate = `
    <html>
<head>
    <style>
        body {
            font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #36393f;
            color: #dcddde;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #2f3136;
            padding: 30px;
            border-radius: 5px;
        }
        h1 {
            color: #ffffff;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #dcddde;
            line-height: 1.6;
            font-size: 16px;
        }
        .reset-code {
            text-align: center;
            font-size: 32px;
            margin: 30px 0;
            color: #7289da;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #72767d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset</h1>
        <p>A password reset was requested for your Expense Tracker Pro account. If this was you, use the code below to reset your password. If you didn't request this, you can safely ignore this email.</p>
        <div class="reset-code">${resetCode}</div>
        <p>This code will expire in 30 minutes for security reasons.</p>
        <div class="footer">
            Expense Tracker Pro • Secure Financial Management
        </div>
    </div>
</body>
</html>
  `;

  // Send email using Nodemailer with custom HTML template
  await transport.sendMail({
    from: '"Expense Tracker" <MS_4cojpc@trial-neqvygm7n2jg0p7w.mlsender.net>',
    to: email,
    subject: "Reset your password - Expense tracker PRO",
    html: htmlTemplate,
  });

  // Send response to the client
  res.status(200).json({
    status: "Reset code sent to email successfully!",
  });
};

module.exports = forgotPassword;
