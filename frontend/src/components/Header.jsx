import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user") || "{}"
    )
  );

  useEffect(() => {
    const refreshAuth = () => {
      setToken(
        localStorage.getItem("token")
      );

      setUser(
        JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      );
    };

    // Initial load
    refreshAuth();

    // Login / Logout updates
    window.addEventListener(
      "authChanged",
      refreshAuth
    );

    // Tab focus updates
    window.addEventListener(
      "focus",
      refreshAuth
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        refreshAuth
      );

      window.removeEventListener(
        "focus",
        refreshAuth
      );
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">

          <div className="logo-section">
            <img
              src="/logo.png"
              alt="IdeaNestle Logo"
            />
            <h1>IdeaNestle</h1>
          </div>

          <nav className="nav">
            <Link to="/">Home</Link>

            {!token ? (
              <>
                <Link to="/about">
                  About
                </Link>

                <Link to="/login">
                  Login
                </Link>

                <Link to="/register">
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  Dashboard
                </Link>

                <span className="user-name">
                  👋 {user?.name || "User"}
                </span>

                <button
                  className="menu-btn"
                  onClick={() =>
                    setIsOpen(true)
                  }
                >
                  ☰
                </button>
              </>
            )}
          </nav>

        </div>
      </header>

      {token && (
        <Sidebar
          isOpen={isOpen}
          closeSidebar={() =>
            setIsOpen(false)
          }
        />
      )}
    </>
  );
}

export default Header;