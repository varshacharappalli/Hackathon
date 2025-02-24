import { useEffect, useState } from "react";
import { fetchResumeData } from "../api.js";
import DeployedPortfolio from "./DeployedPortfolio.jsx";

const Portfolio = ({ templateId = 1 }) => {
  const [resumeData, setResumeData] = useState({
    name: "",
    phone: "",
    email: "",
    skills: [],
    achievements: [],
    work_experience: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchResumeData();
        
        if (!response) {
          throw new Error("Failed to fetch resume data");
        }

        // Validate the received data
        const requiredFields = ['name', 'phone', 'email', 'skills', 'achievements', 'work_experience'];
        const missingFields = requiredFields.filter(field => !(field in response));

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Update state with the fetched data
        setResumeData({
          name: response.name || "",
          phone: response.phone || "",
          email: response.email || "",
          skills: response.skills || [],
          achievements: response.achievements || [],
          work_experience: response.work_experience || []
        });

        console.log("Resume data successfully loaded:", response);
      } catch (err) {
        console.error("Error loading resume data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Loading resume data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if we have the minimum required data
  if (!resumeData.name || !resumeData.email) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600">Resume data is incomplete</p>
      </div>
    );
  }

  // Render the portfolio with the data
  return (
    <div className="container mx-auto p-4">
      <DeployedPortfolio 
        templateId={templateId} 
        data={resumeData}
      />
      
      {/* Debug section - remove in production */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Resume Data Preview:</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(resumeData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Portfolio;