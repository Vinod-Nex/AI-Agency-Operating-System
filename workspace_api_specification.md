# Enterprise Google Workspace REST API Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides the REST API specification for the AgencyOS Google Workspace Microservice. All endpoints require HTTPS, Bearer JWT authentication, and tenant organization scoping.

---

## 2. API Catalog & Endpoint Definitions

### 1. Send Client Email via Gmail
- **Endpoint**: `POST /api/v1/integrations/google/gmail/send`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`, `ROLE_PROJECT_MANAGER`)
- **Request Payload**:
```json
{
  "recipient_email": "client@acme.com",
  "subject": "Proposal for Cloud Migration - AgencyOS",
  "body_text": "Hi Team,\n\nPlease find attached our formal AI proposal.",
  "thread_id": "thr_12345"
}
```
- **Response Payload (200 OK)**:
```json
{
  "message_id": "msg_99887766",
  "thread_id": "thr_12345",
  "sent_at": "2026-07-25T21:13:00Z"
}
```

---

### 2. Schedule Calendar Event with Google Meet
- **Endpoint**: `POST /api/v1/integrations/google/calendar/events`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "summary": "Acme Corp Kickoff Meeting",
  "description": "Initial project kickoff and requirement review.",
  "start_time": "2026-07-28T14:00:00Z",
  "end_time": "2026-07-28T15:00:00Z",
  "attendees": ["client@acme.com", "pm@agencyos.ai"],
  "create_meet_link": true
}
```
- **Response Payload (201 Created)**:
```json
{
  "event_id": "evt_445566",
  "meet_link": "https://meet.google.com/abc-defg-hij",
  "status": "confirmed"
}
```

---

### 3. Generate Proposal Google Doc
- **Endpoint**: `POST /api/v1/integrations/google/docs/generate-proposal`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_PROJECT_MANAGER`, `ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "proposal_id": "prop_88776655",
  "template_doc_id": "doc_master_template_01",
  "destination_folder_id": "fld_proposals_2026"
}
```
- **Response Payload (200 OK)**:
```json
{
  "document_id": "doc_99182371",
  "web_view_link": "https://docs.google.com/document/d/doc_99182371/edit",
  "status": "CREATED"
}
```

---

### 4. Export Billing Invoices to Google Sheets
- **Endpoint**: `POST /api/v1/integrations/google/sheets/export-invoices`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`, `ROLE_BILLING_MANAGER`)
- **Request Payload**:
```json
{
  "billing_period": "2026-07",
  "spreadsheet_title": "AgencyOS Invoices July 2026"
}
```
- **Response Payload (200 OK)**:
```json
{
  "spreadsheet_id": "sheet_55443322",
  "web_view_link": "https://docs.google.com/spreadsheets/d/sheet_55443322/edit",
  "rows_exported": 42
}
```

---

### 5. Send Google Chat Interactive Alert
- **Endpoint**: `POST /api/v1/integrations/google/chat/alerts`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "space_name": "spaces/AAAA12345",
  "alert_title": "Invoice Paid",
  "alert_message": "Acme Corp paid Invoice #INV-2026-042 ($15,000 USD)."
}
```
- **Response Payload (200 OK)**:
```json
{
  "status": "SENT",
  "chat_message_id": "spaces/AAAA12345/messages/msg_001"
}
```
