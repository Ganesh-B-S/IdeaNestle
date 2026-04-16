import { useEffect, useState } from "react";

function Quote() {
  const [quote, setQuote] = useState("Loading quote...");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("https://api.quotable.io/random");

        if (!res.ok) {
          throw new Error("API error");
        }

        const data = await res.json();
        setQuote(data.content);
      } catch (err) {
        console.error("Quote fetch failed:", err);
        setError(true);
        setQuote("“Consistency beats motivation.”");
      }
    }

    fetchQuote();
  }, []);

  return (
    <blockquote
      style={{
        fontStyle: "italic",
        margin: "20px 0",
        opacity: error ? 0.7 : 1,
      }}
    >
      {quote}
    </blockquote>
  );
}

export default Quote;
