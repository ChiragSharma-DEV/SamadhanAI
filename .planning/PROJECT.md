# RAKSHAK.AI

## What This Is

RAKSHAK.AI is a zero-friction emergency response platform that lets any citizen trigger a verified, AI-dispatched emergency alert via WhatsApp — with no app download, no registration, and no UI learning curve. Authorities receive a live 3D situational dashboard with auto-generated legal documentation.

## Core Value

The MVP demonstrates the full end-to-end loop: Citizen distress → AI triage → Authority alert → Live verification → Legal record — all within 60 seconds of the first WhatsApp message.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Zero-UI SOS Trigger: Citizen sends "HELP" or a voice note to a WhatsApp number; system acknowledges within 5 seconds.
- [ ] AI Emergency Dispatcher: GPT-4o classifies emergency type, extracts location context, and assigns severity.
- [ ] Live Evidence Streaming: System auto-generates and sends a Twilio WebRTC room link back to the citizen within 10 seconds.
- [ ] 3D Digital Twin Dashboard: Admin dashboard renders a Mapbox 3D map that auto-flies to the incident GPS coordinates.
- [ ] Auto-Legal Engine: System produces a pre-filled FIR/Incident Report PDF with incident metadata, AI transcript, and timestamp.

### Out of Scope

- Multi-language NLP beyond Hindi/English — MVP focus
- Integration with actual police/hospital APIs — Mocked for demo
- Mobile native app — Web app / WhatsApp is sufficient for MVP

## Context

- BGI Hackathon Bhopal | Viksit Bharat 2047 project
- Theme: "Cyber-Sentinel" (Dark Mode)
- Full-stack: Next.js 14, Tailwind, Mapbox GL JS, FastAPI, Python, Supabase, Twilio, OpenAI

## Constraints

- **Timeline**: 24-hour implementation plan
- **Tech stack**: Must strictly use specified versions (Next.js 14.2.x, FastAPI 0.111.x, etc.)
- **Infrastructure**: Free tier deployment targets (Vercel, Railway, Supabase)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use WhatsApp for Citizen interface | Zero app-install friction, ubiquitous in target market | — Pending |
| Supabase for backend DB + Realtime | Fast setup for relational data, PostGIS for location, built-in realtime broadcasts | — Pending |
| FastAPI + Python for backend | Better ecosystem for AI integration (OpenAI) and PDF generation (ReportLab) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-11 after initialization*
