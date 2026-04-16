import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 40px",
      background: "#222",
      color: "#fff"
    }}>
      <div>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>Home</Link>

        {token && (
          <>
            <Link to="/dashboard" style={{ color: "white", marginRight: "20px" }}>
              Dashboard
            </Link>

            <Link to="/about" style={{ color: "white", marginRight: "20px" }}>
              About
            </Link>
          </>
        )}
      </div>

      <div>
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}