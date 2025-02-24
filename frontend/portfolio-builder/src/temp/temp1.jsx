import React from "react";

const Temp1 = ({ name, tagline, about, skills, projects, email, socialLinks }) => {
  return (
    <div className="portfolio-container">
      {/* Header Section */}
      <header className="portfolio-header">
        <h1>{name}</h1>
        <p className="tagline">{tagline}</p>
      </header>

      {/* About Section */}
      <section className="about-section">
        <h2>About Me</h2>
        <p>{about}</p>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <h2>Skills</h2>
        <ul className="skills-list">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="portfolio-footer">
        <p>Contact me at: <a href={`mailto:${email}`}>{email}</a></p>
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Temp1;
