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
        setData(resumeData); // Set the data if API call is successful
      } catch (err) {
        console.error("Error in Portfolio component:", err);
        setError(err.message); // Set the error message if API call fails
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchData(); // Fetch data only once when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <DeployedPortfolio templateId={templateId} data={data} />
      <p>The website will be deployed:</p>
    </div>
  );
};

export default Portfolio;

