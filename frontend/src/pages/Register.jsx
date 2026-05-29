import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { isValidEmail } from "../utils/validation";
import "./Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

    if (password.length < 6) {
      return "Password must be at least 6 characters";
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="auth-link">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}


