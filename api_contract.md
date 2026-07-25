# Enterprise OpenAPI 3.1 API Contract Specification
## AI Agency Operating System (AgencyOS)

---

## 1. OpenAPI 3.1 Header & Information

```yaml
openapi: 3.1.0
info:
  title: AI Agency Operating System (AgencyOS) API
  description: Enterprise REST API contract powering AI proposals, legal contracts, billing, CRM, and Jira sprint synchronization.
  version: 1.0.0
  contact:
    name: AgencyOS Engineering Architecture Team
    email: api-support@agencyos.io
    url: https://agencyos.io
servers:
  - url: https://api.agencyos.io/api/v1
    description: Production API Gateway
  - url: https://staging-api.agencyos.io/api/v1
    description: Staging Environment
  - url: http://localhost:8080/api/v1
    description: Local Spring Boot Sandbox
```

---

## 2. Comprehensive Endpoint Contracts

### 🔐 Authentication Module

#### `POST /auth/login`
- **Purpose**: Authenticate user and issue JWT token pair.
- **Request Body**:
  ```json
  {
    "email": "user@agency.io",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`: `AuthResponseDTO`
  - `401 Unauthorized`: Invalid credentials
  - `429 Too Many Requests`: Rate limit exceeded (10 req/min)

---

### 📊 Dashboard & Metrics Module

#### `GET /dashboard/metrics`
- **Purpose**: Fetch executive KPI summary for the active organization.
- **Security**: `BearerAuth` (JWT)
- **Responses**:
  - `200 OK`:
    ```json
    {
      "mrr": 48250.00,
      "mrrGrowthPercent": 18.4,
      "activeClients": 14,
      "onboardingClients": 3,
      "proposalsDelivered": 28,
      "winRatePercent": 85.0,
      "aiHoursSaved": 142
    }
    ```
  - `401 Unauthorized`: Missing or invalid token

---

### 📝 AI Proposal Module

#### `POST /proposals/generate`
- **Purpose**: Trigger AI synthesis engine to generate a proposal draft.
- **Security**: `BearerAuth` (JWT)
- **Request Body**:
  ```json
  {
    "clientName": "Nexus Health Inc.",
    "projectTitle": "HIPAA-Compliant Patient Portal",
    "budget": 65000.00,
    "timelineWeeks": 12,
    "industry": "Healthcare",
    "scopeObjectives": "Build secure patient portal."
  }
  ```
- **Responses**:
  - `201 Created`: `ProposalDTO`
  - `400 Bad Request`: Validation failure (e.g. empty client name)
  - `504 Gateway Timeout`: AI LLM provider timeout

---

### 🧾 Invoice & Billing Module

#### `POST /invoices`
- **Purpose**: Create an itemized client invoice.
- **Security**: `BearerAuth` (JWT)
- **Request Body**:
  ```json
  {
    "clientName": "Nexus Health Inc.",
    "clientEmail": "billing@nexushealth.com",
    "dueDate": "2026-08-15",
    "items": [
      { "description": "Phase 1 Frontend Development", "quantity": 1, "rate": 12500.00 },
      { "description": "Spring Boot API Integration", "quantity": 1, "rate": 6000.00 }
    ],
    "taxRatePercent": 8.00
  }
  ```
- **Responses**:
  - `201 Created`: `InvoiceDTO`
  - `400 Bad Request`: Item quantities or rates $\le 0$
