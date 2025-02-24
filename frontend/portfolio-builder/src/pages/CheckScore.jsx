import React, { useState } from 'react';
import '../styling/CheckScore.css';

const CheckScore = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ job_description: jobDescription })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSkillsList = (skills = []) => {
    if (!Array.isArray(skills)) return null;
    return (
      <ul className="list-disc pl-4">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="border rounded-md shadow-md">
        <div className="bg-gray-200 p-4">
          <h2 className="text-xl font-bold">Resume Match Checker</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Enter job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="5"
            />
            
            <button 
              className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
              onClick={handleSubmit} 
              disabled={loading || !jobDescription.trim()}
            >
              {loading ? 'Processing...' : 'Check Match'}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
                <p>{error}</p>
              </div>
            )}

            {result?.match_results && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-xl font-bold">
                    Overall Match Score: {result.match_results.overall_score}%
                  </h3>
                  <div className="mt-2">
                    <p>Skills Match: {result.match_results.score_breakdown?.skills_match?.score ?? 0}% (Weight: {result.match_results.score_breakdown?.skills_match?.weight ?? 0})</p>
                    <p>Achievement Match: {result.match_results.score_breakdown?.achievement_match?.score ?? 0}% (Weight: {result.match_results.score_breakdown?.achievement_match?.weight ?? 0})</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">Skills Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <h5 className="font-semibold text-green-600">Matching Skills</h5>
                      {renderSkillsList(result.match_results.skills_analysis?.matching_skills)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-600">Missing Skills</h5>
                      {renderSkillsList(result.match_results.skills_analysis?.missing_skills)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">Achievement Analysis</h4>
                  <p className="mt-2">{result.match_results.achievement_analysis?.summary}</p>
                  <div className="mt-2">
                    <h5 className="font-semibold text-green-600">Key Matches</h5>
                    {renderSkillsList(result.match_results.achievement_analysis?.key_matches)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckScore;