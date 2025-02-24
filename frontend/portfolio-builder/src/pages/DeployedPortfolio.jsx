import React, { useEffect, useState } from "react";

const DeployedPortfolio = ({ templateId = 1, data }) => {
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [deployUrl, setDeployUrl] = useState("");
  const [error, setError] = useState(null);

  console.log(data);

  const githubRepo = "varshacharappalli/Hackathon";

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setError(null);
        console.log("Starting template load...");

        // Dynamically import the template component
        const module = await import(`./temp/temp${templateId}.jsx`);
        setTemplateComponent(() => module.default);
      } catch (error) {
        console.error(`Error loading template:`, error);
        setError("Template not found");
      }
    };

    loadTemplate();
  }, [templateId]);

  const deployTemplate = () => {
    const deployedUrl = `https://${githubRepo.split("/")[0]}.github.io/Hackathon/frontend/portfolio-builder/src/temp/temp${templateId}.html`;
    setDeployUrl(deployedUrl);
  };

  const viewSourceCode = () => {
    const repoUrl = `https://github.com/${githubRepo}/tree/main/frontend/portfolio-builder/src/temp`;
    window.open(repoUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {error ? (
        <div className="text-red-600 font-medium p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      ) : TemplateComponent ? (
        <>
          <TemplateComponent {...data} />
          <div className="flex space-x-4">
            <button
              onClick={deployTemplate}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Deploy Template
            </button>
            <button
              onClick={viewSourceCode}
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-300"
            >
              View Source Code
            </button>
          </div>
          {deployUrl && (
            <p className="mt-4 text-green-600 font-medium">
              Deployed successfully! Visit:{" "}
              <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {deployUrl}
              </a>
            </p>
          )}
        </>
      ) : (
        <p>Loading template...</p>
      )}
    </div>
  );
};

export default DeployedPortfolio;

