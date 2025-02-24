from fastapi import FastAPI
from pdfminer.high_level import extract_text
from together import Together
import spacy
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load SpaCy model & Together API
nlp = spacy.load("en_core_web_sm")
client = Together(api_key="1ad7ef03cfb27a21c12f21566b97620a46f199cfc5b5a5e356d05d399d0a9606")

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

def extract_details_with_llm(text):
    prompt = f"""
    Extract the following details from the given resume text and return them in JSON:

    - Name
    - Phone
    - Email
    - Skills
    - Achievements
    - Work Experience (Company Name, Job Role, Duration)

    Resume Text:
    {text}
    """
    # Use a pipeline as a high-level helper


    '''messages = [
        {"role": "user", "content": "Who are you?"},
    ]
    pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-R1", trust_remote_code=True)
    pipe(messages)'''

    response = client.chat.completions.create(
        model="deepseek-ai/DeepSeek-R1",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content

@app.get("/extract")
def extract_resume():
    resume_path = r"C:\Users\cvars\Downloads\TejashreeVResume_draft_1.pdf"
    text = extract_text_from_pdf(resume_path)
    extracted_data = extract_details_with_llm(text)
    return extracted_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
