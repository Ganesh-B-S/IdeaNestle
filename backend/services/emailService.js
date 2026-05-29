const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generic sender
async function sendEmail({ to, subject, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Failed to send email");
  }
}

// Registration OTP
async function sendOTP(email, otp) {
  return sendEmail({
    to: email,
    subject: "IdeaNestle Email Verification",
    text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
  });
}

// Password Reset OTP
async function sendResetOTP(email, otp) {
  return sendEmail({
    to: email,
    subject: "IdeaNestle Password Reset",
    text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
  });
}

module.exports = {
  sendOTP,
  sendResetOTP,
};