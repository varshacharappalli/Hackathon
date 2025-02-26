import './PortfolioTemplate2.css';
import { Mail, Code, Briefcase, Star } from "lucide-react";

export const PortfolioTemplate2 = ({ data }) => {
  const {
    name = "Name Not Provided",
    skills = [],
    projects = [],
    email = "Email not provided",
    socialLinks = [],
    work_experience = [],
    achievements = [],
  } = data;

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-700 p-10 rounded-xl shadow-2xl text-white space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold text-blue-400">{name}</h1>
      </header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold flex items-center gap-2 text-blue-300">
            <Code className="w-6 h-6 text-blue-400" /> Skills
          </h2>
          <div className="flex flex-col space-y-2"> {/* Vertical Layout */}
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {work_experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold flex items-center gap-2 text-blue-300">
            <Briefcase className="w-6 h-6 text-blue-400" /> Work Experience
          </h2>
          <div className="space-y-3">
            {work_experience.map((job, index) => (
              <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-blue-300">{job.position}</h3>
                <p className="text-gray-400">{job.company}</p>
                <p className="text-gray-500">{job.duration}</p>
                <p className="text-gray-300">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold flex items-center gap-2 text-blue-300">
            <Star className="w-6 h-6 text-blue-400" /> Achievements
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {achievements.map((achievement, index) => (
              <li key={index} className="text-white">{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-blue-300">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg p-6 bg-gray-800 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-300 mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-300 font-medium"
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <footer className="border-t border-gray-700 pt-8 text-center space-y-4">
        <p className="flex items-center justify-center gap-2 text-gray-300">
          <Mail className="w-5 h-5 text-blue-400" />
          <a href={`mailto:${email}`} className="text-blue-500 hover:text-blue-300">
            {email}
          </a>
        </p>
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};
