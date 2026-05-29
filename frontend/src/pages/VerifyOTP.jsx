import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!email) {
      setMessage("Registration session expired. Please register again.");
      return;
    }

    if (!otp.trim()) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("OTP verified successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Verify OTP</h2>

        {email && (
          <p style={{ marginBottom: "15px" }}>
            OTP sent to <strong>{email}</strong>
          </p>
        )}

        {message && (
          <p
            style={{
              color: message.toLowerCase().includes("verified")
                ? "green"
                : "red",
            }}
          >
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}