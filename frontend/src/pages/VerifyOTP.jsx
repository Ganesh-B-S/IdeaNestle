import { useState } from "react";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");

  async function handleVerify() {
    const res = await fetch("http://localhost:5000/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        otp,
      }),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h2>Enter OTP</h2>
      <input onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}