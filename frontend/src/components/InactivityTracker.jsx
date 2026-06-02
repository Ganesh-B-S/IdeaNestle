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

        window.dispatchEvent(
          new Event("authChanged")
        );

        sessionStorage.setItem(
          "logoutReason",
          "inactive"
        );

        navigate("/logout");
      }, 5 * 60 * 1000); // 5 minutes
    };

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart",
      "touchmove",
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