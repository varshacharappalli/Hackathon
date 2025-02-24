from fastapi import FastAPI, HTTPException
from pdfminer.high_level import extract_text
from together import Together
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, Any
import logging

# Set up logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Parser API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Together(api_key="910a0ba863a724cfee505f6c9e622309ac8b09b51f340e6c8ab64d2789edac32")

def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        text = extract_text(pdf_path)
        logger.info(f"Successfully extracted {len(text)} characters from PDF")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

def extract_details_with_llm(text: str) -> Dict[str, Any]:
    prompt = f"""
    You are a resume parser. Your task is to extract information from the resume text below and format it as a JSON object.
    
    Rules:
    1. Return ONLY a valid JSON object
    2. Do not include any explanatory text or markdown formatting
    3. Ensure all fields are properly formatted
    4. Use empty strings or arrays for missing information
    
    Required JSON structure:
    {{
        "name": "string",
        "phone": "string",
        "email": "string",
        "skills": ["skill1", "skill2", ...],
        "achievements": ["achievement1", "achievement2", ...],
        "work_experience": [
            {{
                "company": "string",
                "role": "string",
                "duration": "string"
            }}
        ]
    }}

    Resume Text:
    {text}
    """

    try:
        logger.info("Sending request to LLM")
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a resume parser that only outputs valid JSON. Never include explanatory text or markdown formatting."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        response_text = response.choices[0].message.content
        logger.info("Received response from LLM")
        
        # Clean the response text
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        logger.info(f"Cleaned response text: {response_text[:100]}...")  # Log first 100 chars
            
        try:
            parsed_data = json.loads(response_text)
            logger.info("Successfully parsed JSON response")
            return parsed_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {response_text}")
            logger.error(f"JSON parse error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="Failed to parse resume data. Invalid JSON format received from LLM."
            )
            
    except Exception as e:
        logger.error(f"Error in LLM processing: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process resume with LLM: {str(e)}"
        )

@app.get("/")
async def root():
    """Root endpoint that provides API information"""
    return {
        "message": "Resume Parser API",
        "endpoints": {
            "/": "This information",
            "/extract": "Extract information from resume"
        },
        "status": "running"
    }

@app.get("/extract")
async def extract_resume():
    try:
        resume_path = r"C:\Users\cvars\Downloads\TejashreeVResume_draft_1.pdf"
        logger.info(f"Processing resume from: {resume_path}")
        
        # Extract text from PDF
        text = extract_text_from_pdf(resume_path)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Extracted text is empty")
        
        logger.info(f"Extracted text length: {len(text)}")
        
        # Process with LLM
        extracted_data = extract_details_with_llm(text)
        logger.info("Successfully extracted resume data")
        return extracted_data
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
