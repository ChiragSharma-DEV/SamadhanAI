import os
import requests
import tempfile
from openai import OpenAI
from backend.models.schemas import ExtractedIncident

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

def transcribe_audio(audio_url: str, twilio_account_sid: str, twilio_auth_token: str) -> str:
    response = requests.get(audio_url, auth=(twilio_account_sid, twilio_auth_token))
    if response.status_code != 200:
        raise Exception(f"Failed to download audio: {response.status_code}")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".ogg") as temp_audio:
        temp_audio.write(response.content)
        temp_audio_path = temp_audio.name
        
    try:
        with open(temp_audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
        return transcript.text
    finally:
        os.remove(temp_audio_path)

def extract_incident_details(text: str) -> ExtractedIncident:
    response = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an emergency dispatcher AI. Extract intent (what happened), severity (Critical, High, Medium, Low), and location from the distress message."},
            {"role": "user", "content": text}
        ],
        response_format=ExtractedIncident
    )
    return response.choices[0].message.parsed
