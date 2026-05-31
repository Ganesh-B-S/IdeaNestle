import { Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
  <>
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

    <Sidebar
      isOpen={isOpen}
      closeSidebar={() =>
        setIsOpen(false)
      }
    />
  </>
);
}

export default Header;