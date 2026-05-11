# RAKSHAK.AI — Real-time Autonomous Emergency & Safety Network
### BGI Hackathon Bhopal | Viksit Bharat 2047

---

## 1. Product Requirement Document (PRD)

### Vision
RAKSHAK.AI is a zero-friction emergency response platform that lets any citizen trigger a verified, AI-dispatched emergency alert via WhatsApp — with no app download, no registration, and no UI learning curve. Authorities receive a live 3D situational dashboard with auto-generated legal documentation.

### Winning MVP Scope
The MVP demonstrates the full end-to-end loop: **Citizen distress → AI triage → Authority alert → Live verification → Legal record** — all within 60 seconds of the first WhatsApp message.

### Top 5 Functional Requirements

| # | Requirement | Acceptance Criteria |
|---|-------------|---------------------|
| FR-1 | **Zero-UI SOS Trigger** | Citizen sends "HELP" or a voice note to a WhatsApp number; system acknowledges within 5 seconds |
| FR-2 | **AI Emergency Dispatcher** | GPT-4o classifies emergency type (Medical / Fire / Crime / Other), extracts location context, and assigns severity (P1/P2/P3) with ≥90% accuracy on test cases |
| FR-3 | **Live Evidence Streaming** | System auto-generates and sends a Twilio WebRTC room link back to the citizen within 10 seconds; stream is viewable on the admin dashboard |
| FR-4 | **3D Digital Twin Dashboard** | Admin dashboard renders a Mapbox 3D map that auto-flies to the incident GPS coordinates upon new alert; incidents are shown as pulsing markers |
| FR-5 | **Auto-Legal Engine** | On admin action "Generate Report", system produces a pre-filled FIR/Incident Report PDF (via ReportLab) with incident metadata, AI transcript, and timestamp |

### Out of Scope (MVP)
- Multi-language NLP beyond Hindi/English
- Integration with actual police/hospital APIs (mocked for demo)
- Mobile native app

---

## 2. Web App Flow & User Paths

### 2A. Citizen Path (WhatsApp Interaction Flow)

```
Citizen WhatsApp
      │
      ▼
[1] Sends "HELP" or Voice Note
      │
      ▼
[2] Twilio Webhook → POST /webhook (FastAPI)
      │
      ├─ If Voice Note → Whisper-1 transcription
      ├─ If Text → pass directly to GPT-4o
      │
      ▼
[3] GPT-4o Intent Detection
      │  Extracts: { type, severity, location_hint, summary }
      │
      ▼
[4] Supabase INSERT → incidents table
      │  Triggers Supabase Realtime broadcast → Admin Dashboard
      │
      ▼
[5] Twilio sends WhatsApp reply to Citizen:
      "🚨 RAKSHAK.AI: Help is on the way.
       Please tap this link to share live video:
       https://stream.rakshak.ai/room/<incident_id>"
      │
      ▼
[6] Citizen taps link → WebRTC room opens in browser
      │  Stream is embedded in Admin Dashboard incident card
      │
      ▼
[7] Follow-up WhatsApp message sent when incident is resolved:
      "✅ Your case #<id> has been resolved. Stay safe."
```

### 2B. Admin Path (Dashboard Interaction Flow)

```
Admin Browser
      │
      ▼
[1] /login
      │  Supabase Auth (email + password)
      │  On success → redirect to /dashboard
      │
      ▼
[2] /dashboard (default view)
      │  Layout: Sidebar (incident list) | Full-screen Mapbox 3D Map
      │  Supabase Realtime subscription active on `incidents` channel
      │
      ▼
[3] New Incident Alert arrives via Realtime
      │  Sidebar: new card appears at top with pulsing red dot
      │  Toast notification: "🚨 P1 Medical Emergency — Sector 7, Bhopal"
      │
      ▼
[4] Admin clicks incident card
      │
      ├─ Map: map.flyTo({ center: [lng, lat], zoom: 17, pitch: 60, bearing: -20 })
      │        3D buildings render; incident marker pulses at location
      │
      ├─ Right Panel opens (Modal/Drawer):
      │    - AI Transcript
      │    - Severity badge
      │    - Live WebRTC stream embed (if citizen connected)
      │    - Assigned responder dropdown
      │    - Status selector: [ Pending | Dispatched | Resolved ]
      │
      ▼
[5] Admin clicks "Generate FIR Report"
      │  POST /generate-report { incident_id }
      │  Backend: ReportLab generates PDF → returns signed Supabase Storage URL
      │  Frontend: PDF opens in new tab / download prompt
      │
      ▼
[6] Admin sets Status → "Resolved"
      │  PATCH /incidents/<id> { status: "resolved" }
      │  Supabase Realtime broadcasts update → marker turns green on map
      │  WhatsApp resolution message sent to citizen (via Twilio)
```

### Navigation Logic (Key Interactions)

```typescript
// Triggered when admin clicks an incident card
function handleIncidentSelect(incident: Incident) {
  // 1. Fly the map to incident coordinates
  mapRef.current?.flyTo({
    center: [incident.longitude, incident.latitude],
    zoom: 17,
    pitch: 60,
    bearing: -20,
    duration: 2000, // ms
    essential: true,
  });

  // 2. Open the incident detail drawer
  setSelectedIncident(incident);
  setDrawerOpen(true);

  // 3. Mark incident as "viewed" in Supabase
  supabase
    .from("incidents")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", incident.id);
}
```

---

## 3. Tech Stack (Exact Versions)

### Frontend
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | `14.2.x` |
| Styling | Tailwind CSS | `3.4.x` |
| Icons | Lucide React | `0.378.x` |
| Map | Mapbox GL JS | `3.0.x` |
| Map React Wrapper | react-map-gl | `7.1.x` |
| Realtime Client | Supabase JS | `2.43.x` |
| PDF Viewer | react-pdf | `7.7.x` |
| State Management | Zustand | `4.5.x` |
| HTTP Client | Axios | `1.7.x` |

### Backend
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Python | `3.11.x` |
| Framework | FastAPI | `0.111.x` |
| ASGI Server | Uvicorn | `0.29.x` |
| AI SDK | openai | `1.30.x` |
| WhatsApp/SMS | twilio | `9.1.x` |
| PDF Generation | reportlab | `4.2.x` |
| ORM | SQLAlchemy + asyncpg | `2.0.x` |
| Env Management | python-dotenv | `1.0.x` |
| Validation | pydantic | `2.7.x` |

### Infrastructure
| Service | Purpose | Plan |
|---------|---------|------|
| Supabase | PostgreSQL + PostGIS + Auth + Realtime + Storage | Free tier |
| Twilio | WhatsApp Business API + WebRTC | Trial |
| Vercel | Next.js hosting | Free tier |
| Railway / Render | FastAPI hosting | Free tier |
| OpenAI API | GPT-4o + Whisper-1 | Pay-per-use |

---

## 4. Frontend Guidelines

### Theme: "Cyber-Sentinel" (Dark Mode)

#### Color Palette
```css
:root {
  /* Backgrounds */
  --bg-primary:    #050505;   /* Main app background */
  --bg-surface:    #0D0D0D;   /* Cards, sidebar */
  --bg-elevated:   #1A1A1A;   /* Modals, dropdowns */
  --bg-border:     #2A2A2A;   /* Dividers, borders */

  /* Brand */
  --color-emergency: #FF3B30; /* Primary — Emergency Red */
  --color-trust:     #007AFF; /* Accent — Trust Blue */
  --color-resolved:  #30D158; /* Success — Safe Green */
  --color-warning:   #FF9F0A; /* Warning — Amber */

  /* Text */
  --text-primary:   #F5F5F7;
  --text-secondary: #8E8E93;
  --text-muted:     #48484A;
}
```

#### Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emergency: '#FF3B30',
        trust:     '#007AFF',
        resolved:  '#30D158',
        surface:   '#0D0D0D',
        elevated:  '#1A1A1A',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-emergency': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fly-in': 'slideInRight 0.3s ease-out',
      },
    },
  },
};
```

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: RAKSHAK.AI logo | Live counter | Admin avatar  │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   SIDEBAR    │         MAPBOX 3D MAP (full center)      │
│  (320px)     │                                          │
│              │   [Incident markers pulse on map]        │
│  Incident    │                                          │
│  List Cards  │                                          │
│              │                                          │
│  [P1] 🔴     │                                          │
│  [P2] 🟠     │                                          │
│  [P3] 🟡     │                                          │
│              │                                          │
├──────────────┴──────────────────────────────────────────┤
│  STATUS BAR: Active incidents | Avg response time       │
└─────────────────────────────────────────────────────────┘

[When incident selected → RIGHT DRAWER slides in over map]
┌──────────────────────────────┐
│  Incident #ID  [P1 MEDICAL]  │
│  ─────────────────────────── │
│  📍 Sector 7, Bhopal         │
│  🕐 2 min ago                │
│  ─────────────────────────── │
│  AI Transcript:              │
│  "There's been an accident..." │
│  ─────────────────────────── │
│  [Live Stream Embed]         │
│  ─────────────────────────── │
│  Assign: [ Responder ▼ ]     │
│  Status: [ Dispatched ▼ ]    │
│  ─────────────────────────── │
│  [ 📄 Generate FIR Report ]  │
└──────────────────────────────┘
```

#### Component Conventions
- All incident severity badges use `font-mono` with uppercase text
- Pulsing red ring on P1 markers: `ring-2 ring-emergency animate-pulse`
- Map container must be `position: relative; width: 100%; height: 100vh`
- All modals use `backdrop-blur-sm bg-black/60` overlay
- Timestamps always displayed in IST (`Asia/Kolkata` timezone)

---

## 5. Backend & Database Schema

### SQL Schema (Supabase / PostgreSQL + PostGIS)

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─────────────────────────────────────────
-- USERS (Admin accounts)
-- ─────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'dispatcher'
                  CHECK (role IN ('admin', 'dispatcher', 'viewer')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────
-- LOCATIONS (Spatial data for incidents)
-- ─────────────────────────────────────────
CREATE TABLE locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_address     TEXT,                          -- Human-readable hint from AI
  coordinates     GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS geography type
  accuracy_meters FLOAT,
  source          TEXT CHECK (source IN ('gps', 'cell_tower', 'ai_extracted', 'manual')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for fast proximity queries
CREATE INDEX idx_locations_coordinates
  ON locations USING GIST (coordinates);

-- ─────────────────────────────────────────
-- INCIDENTS (Core emergency records)
-- ─────────────────────────────────────────
CREATE TABLE incidents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Citizen info
  citizen_phone     TEXT NOT NULL,               -- WhatsApp number (E.164 format)
  citizen_name      TEXT,                        -- Extracted by AI if mentioned

  -- AI-processed content
  raw_message       TEXT,                        -- Original WhatsApp text/transcript
  audio_url         TEXT,                        -- Supabase Storage URL for voice note
  ai_transcript     TEXT,                        -- Whisper output (if voice)
  ai_summary        TEXT NOT NULL,               -- GPT-4o generated summary
  emergency_type    TEXT NOT NULL
                      CHECK (emergency_type IN ('medical', 'fire', 'crime', 'disaster', 'other')),
  severity          TEXT NOT NULL DEFAULT 'P2'
                      CHECK (severity IN ('P1', 'P2', 'P3')),

  -- Location
  location_id       UUID REFERENCES locations(id),

  -- Status & assignment
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'dispatched', 'resolved', 'false_alarm')),
  assigned_to       UUID REFERENCES users(id),
  viewed_at         TIMESTAMPTZ,
  dispatched_at     TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,

  -- Evidence
  stream_room_id    TEXT,                        -- Twilio WebRTC room ID
  stream_url        TEXT,                        -- Public stream URL sent to citizen
  fir_pdf_url       TEXT,                        -- Supabase Storage URL for generated PDF

  -- Metadata
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for dashboard queries
CREATE INDEX idx_incidents_status    ON incidents (status);
CREATE INDEX idx_incidents_severity  ON incidents (severity);
CREATE INDEX idx_incidents_created   ON incidents (created_at DESC);
CREATE INDEX idx_incidents_phone     ON incidents (citizen_phone);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────
-- Enable Supabase Realtime on incidents
-- ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
```

### Helper Query: Incidents Near a Point (PostGIS)
```sql
-- Find all active incidents within 5km of a coordinate
SELECT i.*, ST_Distance(l.coordinates, ST_MakePoint(77.4126, 23.2599)::geography) AS distance_m
FROM incidents i
JOIN locations l ON i.location_id = l.id
WHERE i.status != 'resolved'
  AND ST_DWithin(l.coordinates, ST_MakePoint(77.4126, 23.2599)::geography, 5000)
ORDER BY distance_m ASC;
```

---

### Core API Endpoints

#### `POST /webhook` — Twilio WhatsApp Inbound
```python
# Receives all inbound WhatsApp messages from Twilio
# Route: POST /webhook

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    1. Parse Twilio form data (From, Body, MediaUrl0)
    2. If MediaUrl0 exists → download audio → Whisper transcription
    3. Send text/transcript to GPT-4o for intent + location extraction
    4. INSERT into locations + incidents tables
    5. Create Twilio WebRTC room → store stream_url
    6. Reply to citizen via Twilio WhatsApp API
    7. Supabase Realtime auto-broadcasts to admin dashboard
    """

# Request (Twilio form-encoded):
# From=whatsapp:+919876543210
# Body=HELP there is a fire at my house sector 7
# MediaUrl0=https://api.twilio.com/voice-note.ogg  (optional)

# GPT-4o Prompt Template:
DISPATCH_PROMPT = """
You are an emergency dispatcher AI. Analyze the following message and extract:
1. emergency_type: one of [medical, fire, crime, disaster, other]
2. severity: P1 (life-threatening), P2 (urgent), P3 (non-urgent)
3. location_hint: any address, landmark, or area mentioned
4. summary: one sentence describing the emergency
5. citizen_name: if mentioned, else null

Respond ONLY with valid JSON.

Message: {message}
"""
```

#### `GET /incidents` — List Incidents for Dashboard
```python
# Route: GET /incidents
# Auth: Supabase JWT (Bearer token required)

@router.get("/incidents", response_model=List[IncidentResponse])
async def list_incidents(
    status: Optional[str] = None,       # filter: pending|dispatched|resolved
    severity: Optional[str] = None,     # filter: P1|P2|P3
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    """
    Returns paginated incident list with joined location data.
    Ordered by created_at DESC.
    Includes: id, emergency_type, severity, status, ai_summary,
              citizen_phone, latitude, longitude, stream_url,
              created_at, assigned_to
    """

# Response shape:
# {
#   "incidents": [...],
#   "total": 142,
#   "has_more": true
# }
```

#### `POST /generate-report` — Auto-Legal FIR PDF
```python
# Route: POST /generate-report
# Auth: Supabase JWT (dispatcher or admin role required)

@router.post("/generate-report")
async def generate_report(
    payload: GenerateReportRequest,  # { incident_id: UUID }
    current_user: User = Depends(require_role(["admin", "dispatcher"]))
):
    """
    1. Fetch full incident + location data from Supabase
    2. Use ReportLab to generate structured PDF with:
       - RAKSHAK.AI header + case number
       - Incident metadata (type, severity, timestamp, location)
       - AI transcript / summary
       - Citizen contact (redacted for privacy)
       - Responding officer field (pre-filled if assigned)
       - Digital signature placeholder
       - QR code linking to incident record
    3. Upload PDF to Supabase Storage (bucket: fir-reports)
    4. UPDATE incidents SET fir_pdf_url = <signed_url>
    5. Return { pdf_url: "https://..." }
    """

# Response:
# { "pdf_url": "https://supabase.co/storage/v1/object/sign/fir-reports/INC-2024-001.pdf?token=..." }
```

---

## 6. 24-Hour Implementation Plan

### Sprint Overview

```
Hour  0 ──────── 4 ──────── 8 ──────── 16 ──────── 24
       [INFRA]   [AI PIPE]  [DASHBOARD]  [TEST+PITCH]
```

---

### 🔧 Hours 1–4: Infrastructure Setup

**Goal:** All services connected, skeleton running end-to-end.

- [ ] Create Supabase project → run SQL schema (users, locations, incidents)
- [ ] Enable PostGIS extension + Realtime publication
- [ ] Create Supabase Storage buckets: `voice-notes`, `fir-reports`
- [ ] Set up Twilio account → get WhatsApp Sandbox number → configure webhook URL
- [ ] Scaffold FastAPI project:
  ```
  backend/
  ├── main.py
  ├── routers/
  │   ├── webhook.py
  │   ├── incidents.py
  │   └── reports.py
  ├── services/
  │   ├── ai_dispatcher.py
  │   ├── twilio_service.py
  │   └── pdf_generator.py
  ├── models/
  │   └── schemas.py
  └── database.py
  ```
- [ ] Scaffold Next.js 14 project with App Router + Tailwind + Lucide
- [ ] Configure `.env` files for both frontend and backend
- [ ] Deploy FastAPI to Railway (get public URL for Twilio webhook)
- [ ] Test: Send "HELLO" to WhatsApp number → confirm webhook fires

**Deliverable:** Twilio → FastAPI webhook confirmed working. Supabase tables created.

---

### 🤖 Hours 5–8: AI Pipeline

**Goal:** Full AI dispatch loop working — voice/text in, structured incident out.

- [ ] Implement `ai_dispatcher.py`:
  - Whisper-1 transcription for audio messages
  - GPT-4o intent extraction with structured JSON output
  - Severity scoring logic
- [ ] Implement `twilio_service.py`:
  - Parse inbound Twilio webhook payload
  - Download voice note from Twilio MediaUrl → save to Supabase Storage
  - Send WhatsApp reply with stream link
- [ ] Implement Twilio WebRTC room creation (or mock URL for demo)
- [ ] Wire `POST /webhook` end-to-end:
  - Receive → Transcribe → Classify → Store → Reply
- [ ] Test with 5 scenarios:
  - Text: "HELP fire in my kitchen"
  - Text: "Someone is attacking me"
  - Voice note: recorded medical emergency
  - Text: "HELP" (minimal input)
  - Non-emergency: "What is this number?" (graceful fallback)

**Deliverable:** WhatsApp message → Supabase incident row created with AI fields populated.

---

### 🗺️ Hours 9–16: Admin Dashboard & 3D Map

**Goal:** Full admin UI with live map, incident management, and PDF generation.

**Hours 9–12: Core Dashboard**
- [ ] Implement Supabase Auth (login page at `/login`)
- [ ] Build layout: Sidebar + Mapbox 3D Map + Header
- [ ] Configure Mapbox GL JS v3 with 3D buildings layer:
  ```javascript
  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    type: 'fill-extrusion',
    paint: {
      'fill-extrusion-color': '#1A1A2E',
      'fill-extrusion-height': ['get', 'height'],
    }
  });
  ```
- [ ] Add pulsing incident markers (custom HTML markers with CSS animation)
- [ ] Implement `handleIncidentSelect` with `map.flyTo()`
- [ ] Build incident list sidebar with severity color coding

**Hours 13–16: Realtime + Incident Drawer + PDF**
- [ ] Wire Supabase Realtime subscription:
  ```typescript
  supabase
    .channel('incidents')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' },
      (payload) => addIncidentToState(payload.new))
    .subscribe();
  ```
- [ ] Build incident detail drawer (transcript, stream embed, assign, status)
- [ ] Implement `POST /generate-report` backend + ReportLab PDF template
- [ ] Wire "Generate FIR" button → PDF download
- [ ] Implement status update flow (Pending → Dispatched → Resolved)
- [ ] Test: New WhatsApp message → dashboard alert appears in <3 seconds

**Deliverable:** Full admin dashboard live with realtime updates and PDF generation.

---

### 🧪 Hours 17–24: Testing, Polish & Pitch Prep

**Goal:** Demo-ready, zero crashes, compelling pitch narrative.

**Hours 17–20: Testing & Bug Fixes**
- [ ] End-to-end test: Full citizen → admin → resolution loop (×5 runs)
- [ ] Test all 3 emergency types (Medical, Fire, Crime)
- [ ] Test voice note flow with actual recording
- [ ] Verify PDF generates correctly with all fields
- [ ] Fix any Realtime latency issues
- [ ] Add loading states and error boundaries to frontend
- [ ] Ensure map works on demo laptop (test offline tile caching)

**Hours 21–22: Demo Data & Polish**
- [ ] Seed 10 realistic demo incidents in Supabase (Bhopal locations)
- [ ] Add demo mode: pre-recorded WhatsApp interaction playback
- [ ] Polish UI: animations, transitions, responsive sidebar
- [ ] Add live incident counter in header ("🔴 3 Active Emergencies")
- [ ] Ensure dark mode is consistent across all components

**Hours 23–24: Pitch Preparation**
- [ ] Prepare 60-second live demo script:
  1. Show empty dashboard
  2. Send WhatsApp "HELP fire at DB Mall Bhopal"
  3. Watch dashboard alert appear in real-time
  4. Click → map flies to DB Mall in 3D
  5. Click "Generate FIR" → PDF downloads
- [ ] Prepare fallback: screen recording of full demo (in case of network issues)
- [ ] Document API with FastAPI's auto-generated `/docs` (Swagger UI)
- [ ] Final commit + tag: `git tag v1.0.0-hackathon`

**Deliverable:** Bulletproof demo. Winning pitch.

---

## Appendix: Environment Variables

### Backend `.env`
```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# App
APP_ENV=development
BACKEND_URL=https://your-railway-app.up.railway.app
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

---

## Appendix: Key Dependencies Install Commands

```bash
# Backend
pip install fastapi==0.111.0 uvicorn==0.29.0 openai==1.30.0 \
  twilio==9.1.0 reportlab==4.2.0 supabase==2.4.0 \
  sqlalchemy==2.0.0 asyncpg==0.29.0 python-dotenv==1.0.0 \
  pydantic==2.7.0 python-multipart==0.0.9

# Frontend
npx create-next-app@14 rakshak-dashboard --typescript --tailwind --app
cd rakshak-dashboard
npm install mapbox-gl@3.0.0 react-map-gl@7.1.0 \
  @supabase/supabase-js@2.43.0 lucide-react@0.378.0 \
  zustand@4.5.0 axios@1.7.0 react-pdf@7.7.0
```

---

*RAKSHAK.AI — Protecting every citizen. Empowering every responder.*
*Built for BGI Hackathon Bhopal | Viksit Bharat 2047*
