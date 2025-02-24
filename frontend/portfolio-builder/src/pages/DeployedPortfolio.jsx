import React, { useState } from "react";
import { Mail, Code, Briefcase, Star } from "lucide-react"; // Importing icons for Work Experience and Achievements
import { PortfolioTemplate } from "../temp/PortfolioTemplate";


const DeployedPortfolio = ({ templateId = 1, data }) => {
  const [deployUrl, setDeployUrl] = useState("");

  const deployTemplate = () => {
    const githubRepo = "varshacharappalli/Hackathon";
    const deployedUrl = `https://${githubRepo.split("/")[0]}.github.io/Hackathon/frontend/portfolio-builder/src/temp/PortfolioTemplate.jsx`;
    setDeployUrl(deployedUrl);
  };

  return (
    <div className="p-6 space-y-6">
      <PortfolioTemplate data={data} />
      <div className="flex justify-center">
        <button
          onClick={deployTemplate}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Click to view Source Code
        </button>
      </div>
      {deployUrl && (
        <p className="mt-4 text-green-600 font-medium text-center">
          View the source code:{" "}
          <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {deployUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default DeployedPortfolio;