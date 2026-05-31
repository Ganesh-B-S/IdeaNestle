import { Link } from "react-router-dom";

export default function Logout() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>👋 See You Soon</h1>

      <p>
        Thank you for spending time
        with us today.
      </p>

      <p>
        We hope to see you back soon.
      </p>

      <br />

      <Link to="/login">
        Login Again
      </Link>
    </div>
  );
}