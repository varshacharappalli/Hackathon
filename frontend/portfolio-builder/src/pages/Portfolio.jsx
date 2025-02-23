import { useEffect, useState } from "react";
import { fetchResumeData } from "../api.js";

const Portfolio = ({ templateId = 1 }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeData = await fetchResumeData();
        if (!resumeData) {
          throw new Error("No data received from API");
        }
        setData(resumeData);
      } catch (err) {
        console.error("Error in Portfolio component:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  // Template styles
  const templateStyles = {
    1: {
      // Modern Minimal
      container: "max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm",
      header: "text-3xl font-light text-gray-800 border-b pb-4",
      subheader: "text-lg text-gray-600",
      section: "mt-8",
      sectionTitle: "text-xl font-medium text-gray-700 mb-4",
      list: "space-y-2",
      listItem: "text-gray-600",
    },
    2: {
      // Creative Professional
      container: "max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg",
      header: "text-4xl font-bold text-blue-600 mb-2",
      subheader: "text-xl text-purple-600",
      section: "mt-10",
      sectionTitle: "text-2xl font-semibold text-blue-800 mb-4",
      list: "grid grid-cols-2 gap-4",
      listItem: "text-purple-700",
    },
    3: {
      // Developer Portfolio
      container: "max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-xl",
      header: "text-3xl font-mono font-bold text-green-400",
      subheader: "font-mono text-gray-400",
      section: "mt-8 border-t border-gray-700 pt-6",
      sectionTitle: "text-xl font-mono text-green-400 mb-4",
      list: "space-y-3",
      listItem: "text-gray-300 font-mono",
    },
  };

  const styles = templateStyles[templateId];

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{data.Name || "N/A"}</h1>
      <p className={styles.subheader}>
        {data.Email || "N/A"} | {data.Phone || "N/A"}
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <ul className={styles.list}>
          {data.Skills?.length ? (
            data.Skills.map((skill, index) => (
              <li key={index} className={styles.listItem}>
                {skill}
              </li>
            ))
          ) : (
            <p>No skills listed.</p>
          )}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Achievements</h2>
        <p className={styles.listItem}>{data.Achievements || "No achievements listed."}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        <ul className={styles.list}>
          {data.WorkExperience?.length ? (
            data.WorkExperience.map((exp, index) => (
              <li key={index} className={styles.listItem}>
                <strong>{exp["Company Name"] || "Unknown Company"}</strong> - {exp["Job Role"] || "Unknown Role"} (
                {exp["Duration"] || "Unknown Duration"})
              </li>
            ))
          ) : (
            <p>No work experience listed.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Portfolio;
