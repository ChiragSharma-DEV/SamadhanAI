import os
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN else None

def send_whatsapp_message(to: str, body: str):
    if not twilio_client:
        print(f"Mock Twilio Send: To: {to}, Body: {body}")
        return None
    
    message = twilio_client.messages.create(
        from_=TWILIO_WHATSAPP_FROM,
        body=body,
        to=to
    )
    return message.sid
