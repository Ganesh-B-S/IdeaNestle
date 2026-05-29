export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>

      <button onClick={() => navigate("/about")}>
        About Me
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}