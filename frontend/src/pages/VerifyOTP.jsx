import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
  if (seconds <= 0) return;

  const timer = setInterval(() => {
    setSeconds((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [seconds]);

useEffect(() => {
  if (cooldown <= 0) return;

  const timer = setInterval(() => {
    setCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [cooldown]);

async function handleResendOTP() {
  try {
    const res = await fetch(
      `${API}/api/resend-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setMessage("New OTP sent");

      setSeconds(300);
      setCooldown(60);
    } else {
      setMessage(
        data.message ||
        "Unable to resend OTP"
      );
    }
  } catch (error) {
    setMessage(
      "Unable to resend OTP"
    );
  }
}
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
      const res = await fetch(`${API}/api/verify-otp`, {
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
        setMessage("Account created successfully");

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


  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Verify OTP</h2>
        <p
          style={{
            color: seconds < 60 ? "red" : "#666",
            marginBottom: "15px",
          }}
        >
          OTP expires in{" "}
          {String(minutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}
        </p>
        {email && (
          <p style={{ marginBottom: "15px" }}>
            OTP sent to <strong>{email}</strong>
          </p>
        )}

        {message && (
          <p
            style={{
              color:
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("created")
                  ? "green"
                  : "red"
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

        <div
          style={{
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          <p>Didn't receive OTP?</p>

          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResendOTP}
          >
            {cooldown > 0
              ? `Resend OTP (${cooldown}s)`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}