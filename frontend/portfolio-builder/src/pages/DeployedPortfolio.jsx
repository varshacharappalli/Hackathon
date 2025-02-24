import React, { useEffect, useState } from "react";
import Handlebars from "handlebars";

const DeployedPortfolio = ({ templateId, data }) => {
  const [template, setTemplate] = useState({ html: "", css: "" });
  const [deployUrl, setDeployUrl] = useState("");
  const [error, setError] = useState(null);

  const githubRepo = "varshacharappalli/Hackathon";
  const baseUrl = `https://raw.githubusercontent.com/${githubRepo}/main/frontend/portfolio-builder/src/temp${templateId}/`;

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setError(null); // Reset error state
        
        // Log the URLs being fetched for debugging
        console.log('Fetching HTML from:', `${baseUrl}temp${templateId}.html`);
        console.log('Fetching CSS from:', `${baseUrl}temp${templateId}.css`);

        const [htmlResponse, cssResponse] = await Promise.all([
          fetch(`${baseUrl}temp${templateId}.html`),
          fetch(`${baseUrl}temp${templateId}.css`)
        ]);

        // Check if responses are ok
        if (!htmlResponse.ok) {
          throw new Error(`HTML template ${templateId} not found (${htmlResponse.status})`);
        }
        if (!cssResponse.ok) {
          throw new Error(`CSS template ${templateId} not found (${cssResponse.status})`);
        }

        const [htmlText, cssText] = await Promise.all([
          htmlResponse.text(),
          cssResponse.text()
        ]);

        setTemplate({
          html: htmlText,
          css: cssText,
        });
      } catch (error) {
        console.error(`Error loading template ${templateId}:`, error);
        setError(`Failed to load template ${templateId}: ${error.message}`);
        setTemplate({ html: "", css: "" });
      }
    };

    loadTemplate();
  }, [templateId, baseUrl]); 

  useEffect(() => {
    if (template.css) {
      const styleElement = document.createElement("style");
      styleElement.textContent = template.css;
      // Add a unique identifier to the style element
      styleElement.setAttribute('data-template-id', `template-${templateId}`);
      document.head.appendChild(styleElement);

      return () => {
        // Remove only this template's style element
        const existingStyle = document.querySelector(`style[data-template-id="template-${templateId}"]`);
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [template.css, templateId]);

  const createMarkup = () => {
    try {
      if (!template.html) {
        return { __html: '' };
      }
      const templateScript = Handlebars.compile(template.html);
      const renderedHtml = templateScript(data);
      return { __html: renderedHtml };
    } catch (error) {
      console.error('Error rendering template:', error);
      return { __html: `<div class="error">Error rendering template: ${error.message}</div>` };
    }
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
      {error ? (
        <div className="text-red-600 font-medium p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default DeployedPortfolio;
