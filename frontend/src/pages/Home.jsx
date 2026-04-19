import Header from "../components/Header";
import Quote from "../components/Quote";
import "./Home.css";

export default function Home() {
  return (
    <>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="overlay">
          <div className="hero-content fade-in">
            <h1>Hello, I’m Ganesh</h1>
            <p>Full Stack Developer | React | Node.js</p>
            <Quote />
          </div>
        </div>
      </section>

      {/* REST OF CONTENT */}
      <main className="container">
        <section id="contact" className="fade-in" style={{ marginTop: "40px" }}>
          <h3>Contact</h3>
          <p>Email: srishant.ganesh@gmail.com</p>
          <p>Mobile: 9482658630/9380356792    </p>
          <p>LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/ganesh-b-s-126085148" target="_blank" rel="noopener noreferrer">Ganesh B S</a>
          </p>
          <p>Naukri:{" "}
            <a href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer">Ganesh B S</a>
          </p>
        </section>
      </main>
    </>
  );
}
