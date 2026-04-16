import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Welcome to your Dashboard</h2>

      <button onClick={() => navigate("/about")}>
        About Me
      </button>

      <br /><br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}