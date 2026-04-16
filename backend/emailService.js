const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password",
  },
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: "your_email@gmail.com",
    to: email,
    subject: "Your OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
}

module.exports = sendOTP;