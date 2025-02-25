from json import loads, dumps
import webbrowser
from flask import Flask, request, render_template_string, jsonify
import asyncio
from functools import wraps
import json
from together import Together
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

api_key = os.getenv("TOGETHER_API_KEY")  # Use environment variable


# Import resume extraction function from server.py
from server import extract_resume

client = Together(api_key=api_key)

# Flask App
app = Flask(__name__)
CORS(app)

CORS(app, resources={r"/match": {"origins": "http://localhost:5173"}})

def async_route(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapped

HTML_FORM = """
    <h2>Enter Job Description</h2>
    <form action="/match" method="post">
        <label>Job Description:</label><br>
        <textarea name="job_description" rows="10" cols="50" required></textarea><br>
        <input type="submit" value="Match with Resume">
    </form>
"""

@app.route("/")
def home():
    return render_template_string(HTML_FORM)

async def analyze_achievements(achievements, job_description):
    """Analyze how well the candidate's achievements match the job requirements"""
    prompt = f"""
Analyze how well the candidate's achievements match the job requirements. Consider:
1. Relevance of achievements to job responsibilities
2. Demonstrated expertise level
3. Impact and scale of achievements
4. Technical complexity alignment

Achievements:
{achievements}

Job Description:
{job_description}

Return only a JSON object with this exact structure, no other text:
{{
    "achievement_score": float,  # Score from 0-100
    "analysis": string,  # Brief analysis of match
    "key_matches": [string],  # List of strongest matching points
    "growth_areas": [string]  # Areas where candidate could improve
}}
"""

    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return loads(response.choices[0].message.content)
    except (AttributeError, IndexError, json.JSONDecodeError):
        print("❌ Error: Failed to parse achievement analysis response.")
        return {
            "achievement_score": 0,
            "analysis": "Failed to analyze achievements",
            "key_matches": [],
            "growth_areas": []
        }

async def analyze_job_description(job_description):
    """Analyze job description and infer skills if not explicitly mentioned"""
    initial_prompt = f"""
Extract key information from the following job description:
- List required technical and soft skills
- List main responsibilities for the role
- List preferred qualifications (if mentioned)

Return the result as **valid JSON** without any extra text.

Job Description:
{job_description}

Example Output:
{{
  "skills": ["Python", "Machine Learning"],
  "responsibilities": ["Develop AI models", "Optimize performance"],
  "qualifications": ["Bachelor's degree in CS"]
}}
"""

    # First attempt to extract explicit information
    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
        messages=[{"role": "user", "content": initial_prompt}]
    )

    try:
        initial_analysis = loads(response.choices[0].message.content)
        
        # If no skills found, infer them from responsibilities
        if not initial_analysis.get("skills") or len(initial_analysis["skills"]) == 0:
            inference_prompt = f"""
Based on these job responsibilities and qualifications, determine the technical and soft skills that would be required.
Be comprehensive but realistic. Consider both technical skills and soft skills.

Responsibilities:
{dumps(initial_analysis.get("responsibilities", []), indent=2)}

Qualifications:
{dumps(initial_analysis.get("qualifications", []), indent=2)}

Return ONLY a JSON array of inferred required skills, no other text. Example:
["Project Management", "Communication", "Python", "Data Analysis"]
"""
            
            inference_response = client.chat.completions.create(
                model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
                messages=[{"role": "user", "content": inference_prompt}]
            )
            
            try:
                inferred_skills = loads(inference_response.choices[0].message.content)
                initial_analysis["skills"] = inferred_skills
                initial_analysis["skills_note"] = "Skills were inferred from job responsibilities and qualifications"
            except (json.JSONDecodeError, AttributeError, IndexError) as e:
                print(f"❌ Error inferring skills: {str(e)}")
                initial_analysis["skills"] = []
                initial_analysis["skills_note"] = "Failed to infer skills"

        return initial_analysis
    except (AttributeError, IndexError, json.JSONDecodeError) as e:
        print(f"❌ Error in job analysis: {str(e)}")
        return {
            "skills": [],
            "responsibilities": [],
            "qualifications": [],
            "skills_note": "Failed to analyze job description"
        }

def compare_skills(resume_skills, job_skills):
    matched = set(resume_skills).intersection(set(job_skills))
    missing = set(job_skills) - matched
    return matched, missing

def calculate_overall_match(skills_score, achievement_score):
    # Weighted average: 40% skills, 60% achievements
    return (skills_score * 0.4) + (achievement_score * 0.6)

@app.route("/match", methods=["POST"])
@async_route
async def match_resume():
    data = request.get_json()  # Extract JSON data
    job_description = data.get("job_description")  # Get job description from JSON
    
    if not job_description:
        return jsonify({"status": "error", "message": "Job description is required"}), 400

    # Get resume data asynchronously
    resume_data = await extract_resume()
    resume_dict = loads(dumps(resume_data))

    # Analyze job requirements and skills match
    job_data = await analyze_job_description(job_description)
    job_skills = job_data.get("skills", [])
    matched_skills, missing_skills = compare_skills(resume_dict.get("skills", []), job_skills)
    skills_score = (len(matched_skills) / len(job_skills) * 100) if job_skills else 0

    # Analyze achievements match
    achievement_analysis = await analyze_achievements(resume_dict.get("achievements", []), job_description)
    achievement_score = achievement_analysis.get("achievement_score", 0)

    # Calculate overall match score
    overall_match = calculate_overall_match(skills_score, achievement_score)

    # Create JSON response structure
    response_data = {
        "status": "success",
        "match_results": {
            "overall_score": round(overall_match, 1),
            "score_breakdown": {
                "skills_match": {
                    "score": round(skills_score, 1),
                    "weight": "40%"
                },
                "achievement_match": {
                    "score": round(achievement_score, 1),
                    "weight": "60%"
                }
            },
            "skills_analysis": {
                "matching_skills": list(matched_skills),
                "missing_skills": list(missing_skills)
            },
            "achievement_analysis": {
                "summary": achievement_analysis.get('analysis', ''),
                "key_matches": achievement_analysis.get('key_matches', []),
                "growth_areas": achievement_analysis.get('growth_areas', [])
            },
            "job_requirements": job_data
        }
    }

    return jsonify(response_data)

if __name__ == "__main__":
    webbrowser.open("http://localhost:5000")
    app.run(port=5000, debug=True)
