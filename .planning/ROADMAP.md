# Roadmap: RAKSHAK.AI

## Overview

A 24-hour hackathon execution plan for building the end-to-end RAKSHAK.AI platform, proceeding from backend infra to AI pipeline, frontend dashboard, and final polish.

## Phases

- [ ] **Phase 1: Infrastructure Setup** - All services connected, skeleton running end-to-end.
- [ ] **Phase 2: AI Pipeline** - Full AI dispatch loop working — voice/text in, structured incident out.
- [ ] **Phase 3: Admin Dashboard & 3D Map** - Full admin UI with live map, incident management, and PDF generation.
- [ ] **Phase 4: Testing, Polish & Pitch Prep** - Demo-ready, zero crashes, compelling pitch narrative.

## Phase Details

### Phase 1: Infrastructure Setup
**Goal**: All services connected, skeleton running end-to-end.
**Depends on**: Nothing (first phase)
**Success Criteria** (what must be TRUE):
  1. Supabase database is initialized with tables for users, locations, and incidents.
  2. Twilio WhatsApp webhook is correctly pointed to the FastAPI backend.
  3. Next.js and FastAPI skeletons are scaffolded and running locally.
**Plans**: 1 plan

Plans:
- [ ] 01-01: Set up Supabase, FastAPI, Next.js, and Twilio webhooks

### Phase 2: AI Pipeline
**Goal**: Full AI dispatch loop working — voice/text in, structured incident out.
**Depends on**: Phase 1
**Requirements**: [CORE-01, CORE-02, AI-01]
**Success Criteria** (what must be TRUE):
  1. Voice notes via WhatsApp are accurately transcribed using Whisper.
  2. GPT-4o accurately extracts intent, severity, and location from messages.
  3. Inbound messages create correctly structured incidents in Supabase and trigger a WhatsApp reply with a stream URL.
**Plans**: 1 plan

Plans:
- [ ] 02-01: Implement Twilio webhooks, Whisper, GPT-4o and DB insertion logic

### Phase 3: Admin Dashboard & 3D Map
**Goal**: Full admin UI with live map, incident management, and PDF generation.
**Depends on**: Phase 2
**Requirements**: [UI-01, DOC-01]
**Success Criteria** (what must be TRUE):
  1. Next.js dashboard displays a Mapbox 3D map with live markers updating via Supabase Realtime.
  2. Clicking an incident marker opens a detailed view with a WebRTC stream embed.
  3. Clicking "Generate FIR Report" outputs a structured ReportLab PDF.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Build core layout, Mapbox integration, and Supabase Realtime incident list
- [ ] 03-02: Implement incident detail drawer, WebRTC UI, and ReportLab PDF endpoint

### Phase 4: Testing, Polish & Pitch Prep
**Goal**: Demo-ready, zero crashes, compelling pitch narrative.
**Depends on**: Phase 3
**Success Criteria** (what must be TRUE):
  1. System seamlessly processes end-to-end test cases (Medical, Fire, Crime) without errors.
  2. Dashboard UI is polished, responsive, and matches the "Cyber-Sentinel" dark mode theme.
  3. Demo database seeded with realistic incidents for the pitch.
**Plans**: 1 plan

Plans:
- [ ] 04-01: End-to-end testing, UI polish, demo data seeding

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure Setup | 0/1 | Not started | - |
| 2. AI Pipeline | 0/1 | Not started | - |
| 3. Admin Dashboard & 3D Map | 0/2 | Not started | - |
| 4. Testing, Polish & Pitch Prep | 0/1 | Not started | - |
