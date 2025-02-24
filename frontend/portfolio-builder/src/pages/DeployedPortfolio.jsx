import React, { useEffect, useState } from "react";

const DeployedPortfolio = ({ templateId = 1, data }) => {
  const [template, setTemplate] = useState({ html: "", css: "" });
  const [deployUrl, setDeployUrl] = useState("");

  const githubRepo = "your-github-username/your-repo-name";
  const baseUrl = `https://raw.githubusercontent.com/${githubRepo}/main/src/temp${templateId}/`;

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

  const replaceTemplateVariables = (html) => {
    let processedHtml = html;
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedHtml = processedHtml.replace(new RegExp(placeholder, "g"), value);
    });
    return processedHtml;
  };

  const createMarkup = () => {
    return { __html: replaceTemplateVariables(template.html) };
  };

  const deployTemplate = () => {
    const deployedUrl = `https://${githubRepo.split("/")[0]}.github.io/${templateId}`;
    setDeployUrl(deployedUrl);
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={createMarkup()} />
      <button onClick={deployTemplate}>Deploy Template</button>
      {deployUrl && (
        <p>
          Deployed successfully! Visit:{" "}
          <a href={deployUrl} target="_blank" rel="noopener noreferrer">
            {deployUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default DeployedPortfolio;

