const axios = require("axios");

async function sendEmail({
  to,
  subject,
  text,
  html,
}) {
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
        htmlContent: html,
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

    subject:
      "IdeaNestle Email Verification",

    text:
      `Your verification OTP is ${otp}`,

    html: `
    <div
      style="
      max-width:600px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      ">

      <h2 style="color:#2c3e50">
        IdeaNestle Email Verification
      </h2>

      <p>
        Welcome to IdeaNestle.
      </p>

      <p>
        Use the OTP below to verify
        your email address.
      </p>

      <div
        style="
        background:#f4f4f4;
        padding:20px;
        text-align:center;
        border-radius:10px;
        margin:20px 0;
        ">
        <span
          style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:5px;
          ">
          ${otp}
        </span>
      </div>

      <p>
        This OTP will expire in
        <strong>5 minutes</strong>.
      </p>

      <hr>

      <p
        style="
        color:#777;
        font-size:12px;
        ">
        Team IdeaNestle
      </p>

    </div>
    `,
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

// Welcome Email
async function sendWelcomeEmail(
  email,
  name
) {
  return sendEmail({
    to: email,

    subject:
      "Welcome to IdeaNestle 🎉",

    text:
      `Welcome ${name}. Your account has been created successfully.`,

    html: `
    <div
      style="
      max-width:600px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      ">

      <h1>
        Welcome to IdeaNestle 🎉
      </h1>

      <p>
        Hi <strong>${name}</strong>,
      </p>

      <p>
        Your account has been
        successfully created.
      </p>

      <p>
        You can now login and start
        exploring IdeaNestle.
      </p>

      <br>

      <p>
        Thank you for joining us.
      </p>

      <hr>

      <small>
        Team IdeaNestle
      </small>

    </div>
    `,
  });
}


module.exports = {
  sendOTP,
  sendResetOTP,
  sendWelcomeEmail,
};

