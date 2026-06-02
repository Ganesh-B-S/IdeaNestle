import "./Settings.css";

export default function Settings() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="settings-page">
      <div className="settings-card">

        <h1>Settings</h1>

        <div className="settings-section">
          <h2>Account Information</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>
        </div>

        <div className="settings-section">
          <h2>Password</h2>

          <button className="settings-btn">
            Change Password
          </button>

          <button className="settings-btn secondary">
            Forgot Password
          </button>
        </div>

        <div className="settings-section">
          <h2>Security</h2>

          <p>
            For your safety, IdeaNestle
            automatically logs users out
            after prolonged inactivity.
          </p>
        </div>

        <div className="settings-section">
          <h2>Coming Soon</h2>

          <ul>
            <li>
              Two Factor Authentication
            </li>

            <li>
              Login Activity History
            </li>

            <li>
              Account Deletion
            </li>

            <li>
              Email Notification Controls
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}