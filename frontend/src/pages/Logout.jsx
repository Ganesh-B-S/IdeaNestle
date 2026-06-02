import { Link } from "react-router-dom";

export default function Logout() {
  const reason =
    sessionStorage.getItem(
      "logoutReason"
    );

  sessionStorage.removeItem(
    "logoutReason"
  );

  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      {reason === "inactive" ? (
        <>
          <h1>
            ⏰ Logged Out Due To Inactivity
          </h1>

          <p>
            For your security, you were
            automatically logged out after
            5 minutes of inactivity.
          </p>

          <p>
            We look forward to seeing you
            again soon.
          </p>
        </>
      ) : (
        <>
          <h1>
            👋 See You Soon
          </h1>

          <p>
            Thank you for spending time
            with us today.
          </p>

          <p>
            We hope to see you back soon.
          </p>
        </>
      )}

      <br />

      <Link to="/login">
        Login Again
      </Link>
    </div>
  );
}