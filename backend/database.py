import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

def get_db() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise ValueError("Missing Supabase credentials in .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# We can initialize a singleton client for simple usage
supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_KEY else None
