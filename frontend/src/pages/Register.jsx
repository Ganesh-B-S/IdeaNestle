import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { isValidEmail } from "../utils/validation";
import "./Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  function validateForm() {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    if (name.length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!isValidEmail(email)) {
      return "Enter a valid email address";
    }

    if (!passwordRegex.test(password)) {
      return (
        "Password must contain at least 8 characters, " +
        "one uppercase letter, one lowercase letter and one number"
      );
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  }

  async function handleRegister(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await registerUser({ name, email, password });
      
      if (res.success) {
        navigate("/verify-otp", {
          state: { email: email.trim() },
        });
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (error) {
        console.error(error);
        setError("Something went wrong. Please try again.");
      } finally {
      setLoading(false);
      } 
  }

  return (
    <div className="auth-container">
      <form className="auth-box fade-in" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
  Password must contain:
  <ul>
    <li>Minimum 8 characters</li>
    <li>1 uppercase letter</li>
    <li>1 lowercase letter</li>
    <li>1 number</li>
  </ul>
</div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="auth-link">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}


