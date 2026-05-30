const axios = require("axios");

async function sendEmail({ to, subject, text }) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "IdeaNestle",
          email: "ideanestle.support@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        textContent: text,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log(
      "✅ Email sent:",
      response.data.messageId
    );
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.data || error.message
    );

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