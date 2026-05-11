from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import PlainTextResponse
from backend.services.ai_dispatcher import transcribe_audio, extract_incident_details
from backend.services.twilio_service import send_whatsapp_message, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
from backend.database import supabase_client
import os

router = APIRouter(prefix="/api/webhook", tags=["Webhook"])

def process_incident(sender_number: str, text: str):
    try:
        # Extract
        extracted = extract_incident_details(text)
        
        # Store in Supabase
        if supabase_client:
            response = supabase_client.table("incidents").insert({
                "sender_number": sender_number,
                "intent": extracted.intent,
                "severity": extracted.severity.value,
                "location": extracted.location,
                "raw_text": text,
                "status": "Active"
            }).execute()
            incident_id = response.data[0]["id"]
        else:
            incident_id = "mock-id-123"
            print(f"Mock Insert: {extracted.dict()}")
            
        # Send confirmation
        tracking_link = f"https://rakshak.ai/stream/{incident_id}"
        message_body = f"RAKSHAK.AI: Emergency registered. Help is on the way.\nIntent: {extracted.intent}\nSeverity: {extracted.severity.value}\nLocation: {extracted.location}\nTrack status: {tracking_link}"
        send_whatsapp_message(to=sender_number, body=message_body)
    except Exception as e:
        print(f"Error processing incident: {e}")

@router.post("/twilio")
async def twilio_webhook(request: Request, background_tasks: BackgroundTasks):
    form_data = await request.form()
    
    sender_number = form_data.get("From")
    body = form_data.get("Body", "")
    media_url = form_data.get("MediaUrl0")
    
    if media_url:
        try:
            text = transcribe_audio(media_url, TWILIO_ACCOUNT_SID or "", TWILIO_AUTH_TOKEN or "")
        except Exception as e:
            print(f"Audio transcription error: {e}")
            text = body
    else:
        text = body
        
    if sender_number and text:
        background_tasks.add_task(process_incident, sender_number, text)
    
    # Twilio expects a valid TwiML response or an empty 200 OK
    return PlainTextResponse(content="OK", status_code=200)
