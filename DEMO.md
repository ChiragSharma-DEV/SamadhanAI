# RAKSHAK.AI - Live Demo Playbook

This document serves as the exact sequence to execute the live pitch demonstration at the BGI Hackathon.

## Step 1: Pre-pitch Setup

1. **Environment Variables**: Ensure all APIs are configured in `.env` (Backend) and `.env.local` (Frontend).
    - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
    - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
    - `OPENAI_API_KEY`
    - `NEXT_PUBLIC_MAPBOX_TOKEN`
2. **Start Backend**: 
   ```bash
   uvicorn backend.main:app --reload
   ```
3. **Start Frontend**: 
   ```bash
   cd rakshak-dashboard
   npm run dev
   ```
4. **Seed Database**:
   ```bash
   python -m backend.seed
   ```
5. **Open Dashboard**: Navigate to `http://localhost:3000` on the presentation screen. Keep it open; you will see the 3 seeded incidents.

## Step 2: The Live Demonstration

1. **Dashboard Overview**: Briefly explain the command center. "This is the RAKSHAK.AI dashboard. Live incidents plot here in real-time."
2. **Live Action**: Pull out a phone.
3. **WhatsApp Signal**: Send a live voice note to the Twilio sandbox number: 
   *"There is a huge accident on the highway near Cyber City, two cars collided, we need an ambulance immediately!"*
4. **The Magic**:
   - The audience watches the dashboard. Within seconds, a new pulsing marker appears on the map.
   - The phone buzzes with a WhatsApp reply: "RAKSHAK.AI: Emergency registered. Help is on the way." with a tracking link.
5. **Deep Dive**: Click the new incident in the sidebar. 
   - The drawer slides out showing extracted intent ("Car accident"), severity ("High"), and location ("Cyber City").
   - Point out the simulated secure WebRTC live feed.
6. **Legal Integration**: Click the **Download FIR Report** button. Open the generated PDF to show the structured legal documentation.

## Step 3: Conclusion

"From voice panic to legal document and dispatched authority—under 10 seconds. That is RAKSHAK.AI."
