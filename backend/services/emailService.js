const nodemailer = require("nodemailer");
console.log("SMTP_HOST =", process.env.SMTP_HOST);
console.log("SMTP_PORT =", process.env.SMTP_PORT);
console.log("SMTP_USER =", process.env.SMTP_USER);
console.log("SMTP_PASS exists =", !!process.env.SMTP_PASS);
console.log("Using Brevo SMTP");
// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//  Transporter Verification
transporter.verify((error) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

// Generic sender
async function sendEmail({ to, subject, text }) {
  try {
    const info = await transporter.sendMail({
      from: '"IdeaNestle" <ideanestle.support@gmail.com>',
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