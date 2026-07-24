# Enterprise Production-Ready API Architecture & OpenAPI 3.1 Specification
## AI Agency Operating System (AgencyOS)

---

# PART 1: API Architecture Strategy & Engineering Conventions

### 1.1 API Strategy & Principles
- **Style**: RESTful JSON APIs + Server-Sent Events (SSE) for real-time LLM streaming outputs.
- **Specification**: OpenAPI 3.1.0 compliant.
- **Protocol**: HTTPS / TLS 1.3 + HTTP/2 & HTTP/3.
- **Versioning Strategy**: URI path versioning (`/api/v1/resource`) for major breaking changes; Header versioning (`Accept-Version: 2026-07-01`) for non-breaking API evolution.
- **URI Naming Convention**: Lowercase, plural nouns for collections (`/api/v1/proposals`), kebab-case for multi-word sub-resources (`/api/v1/prompt-templates`).

### 1.2 Pagination, Filtering & Sorting Conventions
- **Cursor Pagination (Default for Large Datasets)**:
  `GET /api/v1/proposals?starting_after=uuid_cursor&limit=25`
- **Offset Pagination (For Standard Tables)**:
  `GET /api/v1/clients?page=1&size=20`
- **Filtering Query Parameters**:
  `GET /api/v1/invoices?status=PENDING&client_id=uuid&created_after=2026-01-01`
- **Sorting Query Parameter**:
  `GET /api/v1/projects?sort=-created_at,name` (`-` denotes DESC, comma separates fields).

### 1.3 Idempotency & Rate Limiting Strategy
- **Idempotency Header**: Required on POST/PUT mutations `Idempotency-Key: uuid-v4` cached in Redis for 24 hours.
- **Rate Limiting Tiers (Token Bucket in Redis)**:
  - `Starter Plan`: 60 requests/minute per tenant.
  - `Professional Plan`: 300 requests/minute per tenant.
  - `Agency Scale Plan`: 1,200 requests/minute per tenant.
  - `AI Endpoint Sub-limit`: 30 streaming requests/minute.

### 1.4 Standardized Response Envelope & Error Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "size": 20,
    "total_elements": 142,
    "total_pages": 8
  },
  "timestamp": "2026-07-24T00:40:00Z",
  "correlation_id": "c7a8e910-1234-4567-89ab-cdef01234567"
}
```

---

# PARTS 2 - 20: Core System API Specifications

---

## PART 2: Authentication APIs

### 2.1 User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Purpose**: Authenticate user and issue HttpOnly refresh cookie + access JWT token.
- **Auth**: None (Public).
- **Rate Limit**: 5 attempts / 15 mins per IP.
- **Request Body**:
```json
{
  "email": "owner@apexdigital.com",
  "password": "SuperSecretPassword123!",
  "mfa_code": "482910"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "expires_in": 900,
    "user": {
      "id": "u-9912",
      "email": "owner@apexdigital.com",
      "role": "AGENCY_OWNER",
      "organization_id": "org-101"
    }
  }
}
```

### 2.2 Token Refresh
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Purpose**: Issues new short-lived access JWT using valid HttpOnly refresh cookie.
- **Auth**: Refresh Cookie (`refresh_token`).
- **Response `200 OK`**: `{ "access_token": "...", "expires_in": 900 }`

---

## PART 3: Organization & Workspace APIs

### 3.1 Get Organization Profile
- **Endpoint**: `GET /api/v1/organization`
- **Auth**: Bearer JWT (`AGENCY_OWNER`, `AGENCY_ADMIN`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "org-101",
    "name": "Apex Digital Studio",
    "slug": "apex-digital",
    "plan_tier": "PROFESSIONAL",
    "custom_domain": "proposals.apexdigital.com"
  }
}
```

---

## PART 4: Client CRM APIs

### 4.1 Create Client Profile
- **Endpoint**: `POST /api/v1/clients`
- **Auth**: Bearer JWT (`AGENCY_OWNER`, `AGENCY_ADMIN`, `PROJECT_MANAGER`).
- **Request Body**:
```json
{
  "company_name": "Nexus Health Inc.",
  "primary_contact_name": "Dr. Aris Vance",
  "primary_email": "vance@nexushealth.org",
  "phone": "+1 (415) 890-2341",
  "currency": "USD"
}
```
- **Response `201 Created`**: Returns created Client Entity DTO.

---

## PART 5: Project & Agile Task APIs

### 5.1 List Active Projects
- **Endpoint**: `GET /api/v1/projects?workspace_id=ws-1&status=IN_PROGRESS`
- **Auth**: Bearer JWT.
- **Response `200 OK`**: Returns paginated array of project status cards.

---

## PART 6: Proposal APIs (AI Engine)

### 6.1 Generate AI Proposal (Streaming)
- **Endpoint**: `POST /api/v1/proposals/generate`
- **HTTP Method**: `POST`
- **Headers**: `Accept: text/event-stream`, `Idempotency-Key: uuid`
- **Auth**: Bearer JWT (`AGENCY_OWNER`, `AGENCY_ADMIN`, `PROJECT_MANAGER`).
- **Request Body**:
```json
{
  "client_id": "c-4821",
  "client_name": "Acme Global Systems",
  "target_budget": "$45,000",
  "timeline_weeks": "8 Weeks",
  "industry": "Fintech",
  "tech_stack": "Next.js 15, PostgreSQL, Stripe",
  "requirements_text": "Client requires enterprise portal with HIPAA compliance and patient tracking."
}
```
- **Response `200 OK` (text/event-stream)**:
```
data: {"chunk": "# EXECUTIVE PROPOSAL\n\n"}
data: {"chunk": "## 1. Executive Summary\n"}
data: {"chunk": "Apex Digital Studio proposes an end-to-end..."}
data: {"event": "DONE", "proposal_id": "prop-8821"}
```

---

## PART 7: Statement of Work (SOW) APIs

### 7.1 Generate Statement of Work
- **Endpoint**: `POST /api/v1/sows/generate`
- **Auth**: Bearer JWT (`AGENCY_OWNER`, `AGENCY_ADMIN`).
- **Request Body**:
```json
{
  "proposal_id": "prop-8821",
  "client_id": "c-4821",
  "commencement_date": "2026-08-01",
  "milestones": [
    { "phase": "Phase 1: Discovery & Architecture", "amount": 13500 },
    { "phase": "Phase 2: Core Engineering", "amount": 18000 },
    { "phase": "Phase 3: Acceptance & Deployment", "amount": 13500 }
  ]
}
```

---

## PART 8: Contract & E-Sign APIs

### 8.1 Generate Contract & E-Sign Link
- **Endpoint**: `POST /api/v1/contracts/generate`
- **Request Body**:
```json
{
  "sow_id": "sow-101",
  "client_id": "c-4821",
  "ip_terms": "Client Ownership upon Full Payment",
  "governing_law": "State of California, USA"
}
```
- **Response `200 OK`**: `{ "contract_id": "cnt-402", "esign_url": "https://agencyos.io/portal/contracts/sign?token=hmac_token" }`

---

## PART 9: Invoice & Stripe Billing APIs

### 9.1 Create Branded Invoice
- **Endpoint**: `POST /api/v1/invoices`
- **Request Body**:
```json
{
  "client_id": "c-4821",
  "sow_id": "sow-101",
  "due_date": "2026-08-15",
  "line_items": [
    { "description": "Phase 1: System Architecture Setup", "quantity": 1, "unit_rate": 13500 }
  ],
  "tax_rate": 8.0
}
```
- **Response `201 Created`**: Returns Invoice Entity + Stripe Checkout URL.

---

## PART 10: Meeting Minutes APIs

### 10.1 Synthesize Meeting Transcript
- **Endpoint**: `POST /api/v1/meetings/synthesize`
- **Request Body**: `{ "meeting_title": "Sprint 3 Kickoff", "raw_transcript": "..." }`
- **Response `200 OK`**: Returns action item matrix & markdown summary.

---

## PART 11: Email APIs

### 11.1 Draft & Dispatch Follow-up Email
- **Endpoint**: `POST /api/v1/emails/send`
- **Request Body**: `{ "recipient_email": "vance@nexushealth.org", "tone": "PERSUASIVE", "key_points": "Proposal follow-up" }`

---

## PART 12: Jira Integration APIs

### 12.1 Generate Jira Backlog Stories
- **Endpoint**: `POST /api/v1/jira/generate-stories`
- **Response `200 OK`**: Returns JSON array of Gherkin user stories.

### 12.2 Push Backlog to Jira Cloud
- **Endpoint**: `POST /api/v1/jira/push`
- **Request Body**: `{ "project_key": "AGENCY", "stories": [ ... ] }`

---

## PART 13: Analytics APIs

### 13.1 Get Revenue & Token Telemetry
- **Endpoint**: `GET /api/v1/analytics?range=30d`
- **Response `200 OK`**: Returns MRR trends, proposal conversion rates, and AI token costs.

---

## PART 14: Billing & Subscription APIs

### 14.1 Create Stripe Checkout Session
- **Endpoint**: `POST /api/v1/billing/create-checkout-session`
- **Request Body**: `{ "target_plan": "PROFESSIONAL" }`

---

## PART 15: Team Management APIs

### 15.1 Invite Team Member
- **Endpoint**: `POST /api/v1/team/invite`
- **Request Body**: `{ "email": "dev@apexdigital.com", "role": "PROJECT_MANAGER" }`

---

## PART 16: AI Engine APIs

### 16.1 Save BYOK API Key
- **Endpoint**: `POST /api/v1/ai/keys`
- **Request Body**: `{ "provider": "ANTHROPIC", "api_key": "sk-ant-••••••••" }`

---

## PART 17: Notification APIs

### 17.1 List User Notifications
- **Endpoint**: `GET /api/v1/notifications?is_read=false`

---

## PART 18: File Storage APIs

### 18.1 Get Direct S3/R2 Pre-signed Upload URL
- **Endpoint**: `POST /api/v1/files/upload-url`
- **Request Body**: `{ "filename": "proposal.pdf", "mime_type": "application/pdf", "size_bytes": 2048500 }`
- **Response `200 OK`**: `{ "upload_url": "https://s3.amazonaws.com/...", "storage_key": "keys/prop-1.pdf" }`

---

## PART 19: Search APIs

### 19.1 Global Command Palette Search (Cmd+K)
- **Endpoint**: `GET /api/v1/search?q=Nexus`
- **Response `200 OK`**: Returns grouped search results across Clients, Proposals, Projects, Contracts.

---

## PART 20: Admin APIs

### 20.1 List Multi-Tenant Organizations
- **Endpoint**: `GET /api/v1/admin/organizations`
- **Auth**: Bearer JWT (`SUPER_ADMIN`).

---

# PART 21: External Integrations Specification

| Provider | Purpose | API Version | Auth Type | Rate Limit |
| :--- | :--- | :--- | :--- | :--- |
| **Anthropic Claude** | Proposal & Contract LLM | `2023-06-01` | API Key (`x-api-key`) | 5,000 RPM |
| **OpenAI API** | GPT-4o multimodal LLM | `v1` | Bearer Token | 10,000 RPM |
| **Google Gemini API** | 2M Token Transcript Parsing | `v1beta` | API Key | 1,000 RPM |
| **Stripe API** | Subscriptions & Invoicing | `2024-06-20` | Bearer Token | 100 req/sec |
| **Resend API** | Transactional Emails | `v1` | Bearer Token | 100 emails/sec |
| **Atlassian Jira Cloud**| Backlog & Story Push | `v3` | OAuth 2.0 3LO | 1,000 req/min |
| **Slack Webhook API** | Event Notifications | `v1` | Webhook URL | 1 req/sec |
| **AWS S3 / R2 API** | Binary Storage | `2006-03-01` | AWS Signature v4 | 5,500 GET/sec |

---

# PART 22: Webhook Specifications

### 22.1 Webhook Delivery Architecture
- **Signing**: Webhooks dispatched with HMAC SHA-256 header `X-AgencyOS-Signature`.
- **Retries**: 5 retries with exponential backoff (15s, 1m, 5m, 15m, 1h).

### 22.2 Sample Webhook Payload: `contract.signed`
```json
{
  "event_id": "evt-9912",
  "event_type": "contract.signed",
  "timestamp": "2026-07-24T00:40:32Z",
  "organization_id": "org-101",
  "data": {
    "contract_id": "cnt-402",
    "client_id": "c-4821",
    "signed_by": "Dr. Aris Vance",
    "signed_at": "2026-07-24T00:40:00Z"
  }
}
```

---

# PART 23: Security & Rate Limit Configuration

- **OWASP Mitigation**: Strict input sanitization via Zod schemas, CORS restricted to organization domains, CSRF protection via SameSite cookies.
- **JWT Security**: RSA-256 asymmetric signing keys, 15-minute access token lifespan.
- **BYOK Encryption**: Secrets encrypted at rest with AES-256-GCM via AWS KMS.

---

# PART 24: OpenAPI 3.1 JSON Schema Components

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "AI Agency Operating System API",
    "version": "1.0.0",
    "description": "Enterprise multi-tenant API for AI Agency Operating System"
  },
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": false },
          "error": {
            "type": "object",
            "properties": {
              "code": { "type": "string", "example": "INVALID_INPUT" },
              "message": { "type": "string", "example": "Requirements text is required." }
            }
          }
        }
      }
    }
  }
}
```
