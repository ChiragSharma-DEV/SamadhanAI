# Requirements: RAKSHAK.AI

**Defined:** 2026-05-11
**Core Value:** The MVP demonstrates the full end-to-end loop: Citizen distress → AI triage → Authority alert → Live verification → Legal record — all within 60 seconds of the first WhatsApp message.

## v1 Requirements

### Core Interactions

- [ ] **CORE-01**: Zero-UI SOS Trigger: Citizen sends "HELP" or a voice note to a WhatsApp number; system acknowledges within 5 seconds
- [ ] **CORE-02**: Live Evidence Streaming: System auto-generates and sends a Twilio WebRTC room link back to the citizen within 10 seconds; stream is viewable on the admin dashboard

### AI Intelligence

- [ ] **AI-01**: AI Emergency Dispatcher: GPT-4o classifies emergency type (Medical / Fire / Crime / Other), extracts location context, and assigns severity (P1/P2/P3) with ≥90% accuracy on test cases

### Dashboard UI

- [ ] **UI-01**: 3D Digital Twin Dashboard: Admin dashboard renders a Mapbox 3D map that auto-flies to the incident GPS coordinates upon new alert; incidents are shown as pulsing markers

### Documentation

- [ ] **DOC-01**: Auto-Legal Engine: On admin action "Generate Report", system produces a pre-filled FIR/Incident Report PDF (via ReportLab) with incident metadata, AI transcript, and timestamp

## v2 Requirements

### Multilingual Support

- **LANG-01**: Multi-language NLP beyond Hindi/English

## Out of Scope

| Feature | Reason |
|---------|--------|
| Actual API Integration | Mocked for demo; external APIs are slow/complex for hackathon |
| Mobile Native App | Too much friction for users; WhatsApp is better |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 2 | Pending |
| CORE-02 | Phase 2 | Pending |
| AI-01 | Phase 2 | Pending |
| UI-01 | Phase 3 | Pending |
| DOC-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-11*
*Last updated: 2026-05-11 after initial definition*
