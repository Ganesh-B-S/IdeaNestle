import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InactivityTracker() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.setItem(
          "logoutReason",
          "inactive"
        );

        navigate("/logout");
      }, 30 * 1000); // 5 min
    };

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart",
    ];

    events.forEach((event) =>
      window.addEventListener(
        event,
        resetTimer
      )
    );

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) =>
        window.removeEventListener(
          event,
          resetTimer
        )
      );
    };
  }, [navigate]);

  return null;
}