import { useEffect, useState } from "react";

const quotes = [
  "Consistency beats motivation.",
  "Small progress is still progress.",
  "Dreams demand action.",
  "Success is built daily.",
];

function Quote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random =
      quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(random);
  }, []);

  return (
    <blockquote
      style={{
        fontStyle: "italic",
        margin: "20px 0",
      }}
    >
      {quote}
    </blockquote>
  );
}

export default Quote;