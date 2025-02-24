import { useEffect, useState } from "react";
import { fetchResumeData } from "../api.js";
import DeployedPortfolio from "./DeployedPortfolio.jsx";

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

  return (
    <div>
      <h1>The Webiste will be deployed:</h1>
      <DeployedPortfolio templateId={templateId} data={data} />
    </div>
  );
};

export default Portfolio;
