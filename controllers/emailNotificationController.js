const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const MKUser = require("../models/mkUserModel");

const passWordResetLink = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await MKUser.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "user not registered" });
  }
  if (user) {
    try {
      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "jatinanjana51@gmail.com",
          pass: "socqywxcpsmtwvrn",
        },
      });

      const mailOptions = {
        from: "jatinanjana51@gmail.com",
        to: email,
        subject: "Password Reset Link",

        text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${email}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error sending email" });
    }
  }
});

module.exports = { passWordResetLink };
