import { useEffect, useState } from "react";
import { fetchResumeData } from "../api";

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting data fetch...");
        const resumeData = await fetchResumeData();
        console.log("Resume data received:", resumeData);
        
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

  // Debug log
  console.log("Rendering with data:", data);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-600">{data.Name || "N/A"}</h1>
      <p className="text-lg text-gray-700">{data.Email || "N/A"} | {data.Phone || "N/A"}</p>

      <h2 className="mt-6 text-xl font-semibold">Skills</h2>
      <ul className="list-disc pl-6">
        {data.Skills?.length ? (
          data.Skills.map((skill, index) => <li key={index}>{skill}</li>)
        ) : (
          <p>No skills listed.</p>
        )}
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Achievements</h2>
      <p>{data.Achievements || "No achievements listed."}</p>

      <h2 className="mt-6 text-xl font-semibold">Work Experience</h2>
      <ul>
        {data.WorkExperience?.length ? (
          data.WorkExperience.map((exp, index) => (
            <li key={index}>
              <strong>{exp["Company Name"] || "Unknown Company"}</strong> - {exp["Job Role"] || "Unknown Role"} ({exp["Duration"] || "Unknown Duration"})
            </li>
          ))
        ) : (
          <p>No work experience listed.</p>
        )}
      </ul>
    </div>
  );
};

export default Portfolio;