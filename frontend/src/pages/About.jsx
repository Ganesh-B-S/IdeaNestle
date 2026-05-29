import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";
export default function About() {
  return (
    <div className="about-container">
      <h1>About Me</h1>

      <p>
        Hi, I’m Ganesh B S, an Industrial Data and Platform Engineer with over 3 years of experience working with the AVEVA OSIsoft PI System. I specialize in building and supporting real-time industrial data platforms that help organizations monitor, analyze, and make better decisions using operational data.
      </p>
      <p>
        I have hands-on experience with PI Data Archive, PI Asset Framework (AF), PI Vision, and PI Integrator, focusing on data modeling, visualization, and system administration. My work involves ensuring reliable data flow, maintaining PI environments, and supporting enterprise data integration.
      </p>
      <p>
        Along with industrial data platforms, I also have experience working with VMware vSphere virtualization and IT service management tools like ServiceNow and Jira. I am also a Microsoft Azure AZ-104 Certified Administrator, with knowledge of cloud infrastructure, virtual machines, networking, and identity management.
      </p>
      <p>
        I’m passionate about technology and continuously learning new tools in cloud, data platforms, and software development. Currently, I’m also expanding my skills in full-stack development using HTML, CSS, JavaScript, Node.js, and MySQL to build modern web applications and data-driven solutions.                       
      </p>
      <p>
        I enjoy solving technical problems, improving systems, and creating solutions that connect industrial data with modern cloud and software technologies.                                                                                                                                                                     
      </p>
      <br />

    </div>
  );
}