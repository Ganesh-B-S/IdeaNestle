import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" />
          <h1>IdeaNestle</h1>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
