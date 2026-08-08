# Enterprise AI REST API Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides the REST API specification for AgencyOS AI generation services. All endpoints require HTTPS, Bearer JWT authentication, tenant scoping, and support optional Server-Sent Events (SSE) streaming (`Accept: text/event-stream`).

---

## 2. API Catalog & Endpoint Definitions

### 1. Interactive AI Agent Chat
- **Endpoint**: `POST /api/v1/ai/chat`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Headers**: `Accept: text/event-stream` (Optional for streaming)
- **Request Payload**:
```json
{
  "conversation_id": "conv_99182371-2391-4a11",
  "project_id": "proj_77112233",
  "message": "Summarize the key deliverables for the mobile app project.",
  "stream": true,
  "model_override": "OPENAI_GPT4O"
}
```
- **Response Payload (Non-stream 200 OK)**:
```json
{
  "conversation_id": "conv_99182371-2391-4a11",
  "message_id": "msg_00112233",
  "content": "The key deliverables for the mobile app project include...",
  "provider_used": "OpenAI",
  "model_used": "gpt-4o",
  "tokens_used": { "prompt": 450, "completion": 180, "total": 630 },
  "cost_usd": 0.00395
}
```

---

### 2. Proposal Generator Endpoint
- **Endpoint**: `POST /api/v1/ai/proposal`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_PROJECT_MANAGER`, `ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "client_name": "Acme Corp",
  "project_name": "Cloud Migration & AI Integration",
  "budget_usd": 75000,
  "requirements": "Migrate on-prem PostgreSQL to AWS RDS and implement AI chat agent.",
  "stream": false
}
```
- **Response Payload (200 OK)**:
```json
{
  "proposal_id": "prop_88776655",
  "content_markdown": "# Proposal for Acme Corp\n\n## Executive Summary...",
  "tokens_used": 2450,
  "cost_usd": 0.01520
}
```

---

### 3. Statement of Work (SOW) Generator
- **Endpoint**: `POST /api/v1/ai/sow`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_PROJECT_MANAGER`, `ROLE_ORG_ADMIN`)

---

### 4. Contract Generator Endpoint
- **Endpoint**: `POST /api/v1/ai/contract`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)

---

### 5. Meeting Minutes Processor
- **Endpoint**: `POST /api/v1/ai/meeting`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "transcript_text": "Speaker 1: We decided to launch on August 1st...",
  "extract_action_items": true
}
```

---

### 6. Structured JSON Extraction Endpoint
- **Endpoint**: `POST /api/v1/ai/json`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "raw_text": "Invoice #1042 for $5,000 sent to Globex Inc on 2026-07-01.",
  "target_json_schema": {
    "type": "object",
    "properties": {
      "invoice_number": { "type": "string" },
      "amount_usd": { "type": "number" },
      "client_name": { "type": "string" }
    }
  }
}
```
- **Response Payload (200 OK)**:
```json
{
  "result": {
    "invoice_number": "1042",
    "amount_usd": 5000.00,
    "client_name": "Globex Inc"
  }
}
```
