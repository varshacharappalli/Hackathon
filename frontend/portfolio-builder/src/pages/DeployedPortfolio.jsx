import React, { useEffect, useState } from "react";
import Handlebars from "handlebars";

const DeployedPortfolio = ({ templateId = 1, data }) => {
  const [template, setTemplate] = useState({ html: "", css: "" });
  const [deployUrl, setDeployUrl] = useState("");

  const githubRepo = "varshacharappalli/Hackathon";
  const baseUrl = `https://raw.githubusercontent.com/${githubRepo}/main/frontend/portfolio-builder/src/temp${templateId}/`;

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const htmlResponse = await fetch(`${baseUrl}temp${templateId}.html`);
        const htmlText = await htmlResponse.text();

        const cssResponse = await fetch(`${baseUrl}temp${templateId}.css`);
        const cssText = await cssResponse.text();

        setTemplate({
          html: htmlText,
          css: cssText,
        });
      } catch (error) {
        console.error("Error loading template:", error);
      }
    };

    loadTemplate();
  }, [templateId]);

  useEffect(() => {
    if (template.css) {
      const styleElement = document.createElement("style");
      styleElement.textContent = template.css;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [template.css]);

  const createMarkup = () => {
    const templateScript = Handlebars.compile(template.html);
    const renderedHtml = templateScript(data);
    return { __html: renderedHtml };
  };

  const deployTemplate = () => {
    const deployedUrl = `https://${githubRepo.split("/")[0]}.github.io/Hackathon/frontend/portfolio-builder/src/temp${templateId}/temp${templateId}.html`;
    setDeployUrl(deployedUrl);
  };

  const viewSourceCode = () => {
    const htmlUrl = `${baseUrl}temp${templateId}.html`;
    const cssUrl = `${baseUrl}temp${templateId}.css`;

    window.open(htmlUrl, "_blank");
    window.open(cssUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div dangerouslySetInnerHTML={createMarkup()} className="w-full max-w-3xl" />
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
    </div>
  );
};

export default DeployedPortfolio;
