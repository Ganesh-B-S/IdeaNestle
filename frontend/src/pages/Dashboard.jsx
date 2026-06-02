import InactivityTracker from "../components/InactivityTracker";

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <>
      <InactivityTracker />

      <div
        style={{
          maxWidth: "1000px",
          margin: "50px auto",
          textAlign: "center",
        }}
      >
        <h1>
          Welcome back, {user.name} 👋
        </h1>

        <p>
          Ready to turn your ideas into reality today?
        </p>
      </div>
    </>
  );
}