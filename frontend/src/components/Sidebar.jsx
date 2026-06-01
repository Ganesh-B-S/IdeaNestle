import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({
  isOpen,
  closeSidebar,
}) {
  const navigate = useNavigate();

  function handleLogout() {
  closeSidebar();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/logout";
}

  return (
    <>
      <div
        className={`sidebar-overlay ${
          isOpen ? "show" : ""
        }`}
        onClick={closeSidebar}
      />

      <div
        className={`sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <h2>IdeaNestle</h2>

        <Link
          to="/Profile"
          onClick={closeSidebar}
        >
          👤 Profile
        </Link>

        <Link
          to="/Ideas"
          onClick={closeSidebar}
        >
          💡 Ideas
        </Link>

        <Link
          to="/Messages"
          onClick={closeSidebar}
        >
          💬 Messages
        </Link>

        <Link
          to="/Settings"
          onClick={closeSidebar}
        >
          ⚙ Settings
        </Link>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}