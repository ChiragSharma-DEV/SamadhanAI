from backend.database import supabase_client
import uuid
from datetime import datetime, timedelta

def seed_db():
    if not supabase_client:
        print("No Supabase client configured. Ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set.")
        return

    incidents = [
        {
            "id": str(uuid.uuid4()),
            "sender_number": "+919876543210",
            "intent": "Massive fire reported at commercial building",
            "severity": "Critical",
            "location": "Connaught Place, New Delhi",
            "raw_text": "There's a massive fire at Connaught Place, Block C. People are trapped inside!",
            "status": "Active",
            "created_at": (datetime.utcnow() - timedelta(minutes=5)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "sender_number": "+919876543211",
            "intent": "Cardiac arrest, patient unconscious",
            "severity": "High",
            "location": "South Extension Part 2, Market",
            "raw_text": "Need an ambulance immediately. My father collapsed and is unconscious. We are in South Ex part 2.",
            "status": "Active",
            "created_at": (datetime.utcnow() - timedelta(minutes=15)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "sender_number": "+919876543212",
            "intent": "Armed robbery at jewelry store",
            "severity": "Medium",
            "location": "Sector 10, Dwarka",
            "raw_text": "Robbery in progress at Sector 10 Dwarka. Two men with guns just entered the jewelry shop.",
            "status": "Active",
            "created_at": (datetime.utcnow() - timedelta(minutes=2)).isoformat()
        }
    ]

    for inc in incidents:
        supabase_client.table("incidents").insert(inc).execute()

    print("Successfully seeded 3 demo incidents.")

if __name__ == "__main__":
    seed_db()
