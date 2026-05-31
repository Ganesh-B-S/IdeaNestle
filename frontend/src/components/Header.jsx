import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/logout");
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" />
          <h1>IdeaNestle</h1>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>

          {!token && (
            <>
              <Link to="/about">About</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">
                Create Account
              </Link>
            </>
          )}

          {token && (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <span className="user-name">
                👋 {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;