import { Link } from "react-router-dom";

export default function Logout() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "100px auto",
        textAlign: "center",
        padding: "30px",
      }}
    >
      <h1>👋 See You Soon</h1>

      <p>
        Thank you for spending time with us today.
      </p>

      <p>
        We hope your ideas continue to grow and
        inspire others.
      </p>

      <p>
        Whenever you're ready, IdeaNestle will
        be here waiting for you.
      </p>

      <br />

      <Link to="/login">
        Login Again
      </Link>

      {" | "}

      <Link to="/">
        Home
      </Link>
    </div>
  );
}