import React, { useState } from 'react';
import { Home, Users, Mail, Image, RefreshCw, Layout, Palette, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.css';

const CreatePort = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const navigate = useNavigate();
  
  const templates = [
    { 
      id: 1, 
      name: 'Modern Minimal',
      icon: <Layout size={48} className="mb-3 text-gray-600" />,
      description: 'Clean and minimalist design focused on content',
      features: [
        'Sleek typography with perfect spacing',
        'Subtle animations and transitions',
        'White space focused layout',
        'Optimized for readability'
      ],
      bestFor: 'Perfect for professionals who want to highlight their work without distractions',
      colorScheme: 'Monochromatic grayscale with minimal accent colors'
    },
    { 
      id: 2, 
      name: 'Creative Professional',
      icon: <Palette size={48} className="mb-3 text-blue-600" />,
      description: 'Bold and dynamic design for creative professionals',
      features: [
        'Gradient color backgrounds',
        'Modern card-based layout',
        'Interactive elements',
        'Visual hierarchy emphasis'
      ],
      bestFor: 'Ideal for designers, artists, and creative professionals',
      colorScheme: 'Rich color palette with gradient effects'
    },
    { 
      id: 3, 
      name: 'Developer Portfolio',
      icon: <Code size={48} className="mb-3 text-green-600" />,
      description: 'Tech-focused design with a modern edge',
      features: [
        'Terminal-inspired elements',
        'Code syntax highlighting',
        'Dark mode optimized',
        'Technical skill showcase'
      ],
      bestFor: 'Perfect for developers and tech professionals',
      colorScheme: 'Dark theme with neon accents'
    }
  ];

  const handleGeneratePortfolio = () => {
    navigate('/createdportfolio', { state: { templateId: selectedTemplate } });
  };

  const selectedTemplateDetails = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar" role="navigation" aria-label="main navigation">
        {/* ... existing navigation code ... */}
      </nav>

      {/* Main Content */}
      <div className="section">
        <h1 className="title">Choose a Portfolio Template</h1>
        
        {/* Template Grid */}
        <div className="columns is-multiline mt-4">
          {templates.map(template => (
            <div key={template.id} className="column is-one-third">
              <div 
                className={`box cursor-pointer ${selectedTemplate === template.id ? 'has-background-primary-light' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="has-text-centered">
                  {template.icon}
                  <p className="is-size-5">{template.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Details */}
        <div className="box mt-6">
          <h2 className="title is-4">Template Details</h2>
          <div className="content">
            <div className="columns">
              <div className="column is-3 has-text-centered">
                {selectedTemplateDetails.icon}
                <h3 className="subtitle is-5 mt-2">{selectedTemplateDetails.name}</h3>
              </div>
              <div className="column">
                <p className="is-size-5 mb-4">{selectedTemplateDetails.description}</p>
                
                <h4 className="title is-6">Key Features:</h4>
                <ul>
                  {selectedTemplateDetails.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <div className="columns mt-4">
                  <div className="column">
                    <h4 className="title is-6">Best For:</h4>
                    <p>{selectedTemplateDetails.bestFor}</p>
                  </div>
                  <div className="column">
                    <h4 className="title is-6">Color Scheme:</h4>
                    <p>{selectedTemplateDetails.colorScheme}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="buttons is-right mt-6">
          <button className="button is-primary" onClick={handleGeneratePortfolio}>
            <RefreshCw size={18} className="mr-2" />
            Generate Portfolio
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="content has-text-centered">
          <div className="columns">
            <div className="column">
              <a href="/privacy" className="has-text-grey">Privacy Policy</a>
            </div>
            <div className="column">
              <a href="/terms" className="has-text-grey">Terms of Service</a>
            </div>
            <div className="column">
              <a href="/contact" className="has-text-grey">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatePort;


