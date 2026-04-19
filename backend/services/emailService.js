const nodemailer = require("nodemailer");

// Create transporter using env variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Generic email sender (reusable)
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

// 🔹 OTP sender (uses generic function)
async function sendOTP(email, otp) {
  return sendEmail({
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  });
}

module.exports = sendOTP;