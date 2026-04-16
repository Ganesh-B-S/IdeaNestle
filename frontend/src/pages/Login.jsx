import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { isValidEmail } from "../utils/validation";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    if (!email || !password) {
      return "Email and password are required";
    }

    if (!isValidEmail(email)) {
      return "Enter a valid email address";
    }

    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Unable to login. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-box fade-in" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link">
          <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
