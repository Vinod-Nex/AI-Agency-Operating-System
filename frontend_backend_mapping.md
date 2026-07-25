# Frontend-to-Backend Component & API Mapping Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Overview

This document maps every user interface screen, component, and user flow in the **AI Agency Operating System** Next.js 15 frontend directly to its corresponding Spring Boot backend REST endpoints, validation rules, state management, retry logic, and caching strategies.

---

## 2. Comprehensive Screen-by-Screen Mapping Matrix

### 1️⃣ Landing Marketing Page (`/`)

- **Screen Name**: Public Landing Page
- **Frontend Components**:
  - `HeaderNav`: Logo, anchor links (`#features`, `#workflow`, `#pricing`, `#testimonials`), `ThemeToggle`, `Sign In` button, `Open AI OS` primary CTA button.
  - `HeroSection`: Value proposition headline, sub-headline, primary CTA `Launch Agency Workspace`, secondary CTA `View Interactive Demo`.
  - `FeatureGrid`: 6 glassmorphic feature cards (AI Proposal Generator, Legal Contract Builder, Invoice Builder, Jira Story Generator, 360° Client CRM, Agile Project Hub).
  - `PricingMatrix`: 3 pricing tier cards (Starter $29/mo, Professional $79/mo, Enterprise $199/mo).
  - `TestimonialsSection`: Client case study quotes, rating stars, avatar avatars.
  - `Footer`: Organization links, privacy policy, status indicator.
- **Backend Module**: Public Content & Subscription Service (`/api/v1/public`)
- **REST Endpoint Mapping**:
  - `GET /api/v1/public/pricing-plans` (Fetches active subscription pricing tiers)
  - `GET /api/v1/public/testimonials` (Fetches public customer case studies)
- **Request Payload**: None (`GET`)
- **Response Payload**:
  ```json
  {
    "plans": [
      {
        "id": "plan_starter",
        "name": "Starter",
        "priceMonthly": 29,
        "features": ["Up to 10 AI Proposals/mo", "AI SOW Generator", "5 Client Organizations"]
      },
      {
        "id": "plan_pro",
        "name": "Professional",
        "priceMonthly": 79,
        "features": ["Unlimited AI Proposals", "BYOK AI Keys", "25 Client Organizations"]
      }
    ]
  }
  ```
- **Authentication Required**: No (Public Route)
- **Authorization Rules**: Anonymous access permitted
- **Validation Rules**: N/A
- **Loading State**: Static Server Generation (SSG) / Edge Cached
- **Error State**: Render fallback hardcoded pricing cards if API is unreachable
- **Retry Strategy**: 2 retries with exponential backoff ($1000\text{ms}$ delay)
- **Caching Strategy**: `Cache-Control: public, max-age=3600, s-maxage=86400`

---

### 2️⃣ Executive AI Dashboard (`/dashboard`)

- **Screen Name**: Executive Agency Dashboard
- **Frontend Components**:
  - `Header`: Workspace breadcrumb, Search launcher (`Cmd+K`), `Generate Document` CTA, `ThemeToggle`, `NotificationsDropdown`, User Avatar.
  - `Sidebar`: Workspace selector, 8 navigation links (`Dashboard`, `Proposals`, `Contracts`, `Invoices`, `Jira`, `Clients`, `Projects`, `Settings`), AI Token usage progress bar.
  - `KPICardsGrid`: 4 metric cards:
    - Monthly Recurring Revenue (`$48,250`, `+18.4%`)
    - Active Client Accounts (`14 Accounts`, `3 onboarding`)
    - Proposals Delivered (`28 Generated`, `85% Win Rate`)
    - Hours Saved by AI (`142 Hours`, `~$11,300 labor value`)
  - `ActiveProjectsList`: 4 project cards with milestone progress bars (`role="progressbar"`), client badge, budget spent, deadline date.
  - `ActivityLogFeed`: Real-time AI system event entries.
- **Backend Module**: Executive Dashboard & Analytics Service (`/api/v1/dashboard`)
- **REST Endpoint Mapping**:
  - `GET /api/v1/dashboard/metrics` (Fetches executive KPI summary)
  - `GET /api/v1/dashboard/active-projects` (Fetches top active projects)
  - `GET /api/v1/dashboard/activity-logs?limit=10` (Fetches real-time AI logs)
- **Request Payload**: None (`GET` with Bearer JWT)
- **Response Payload**:
  ```json
  {
    "mrr": 48250.00,
    "mrrGrowthPercent": 18.4,
    "activeClients": 14,
    "onboardingClients": 3,
    "proposalsDelivered": 28,
    "winRatePercent": 85.0,
    "aiHoursSaved": 142,
    "laborValueSaved": 11300.00
  }
  ```
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Validation Rules**: `organization_id` must match tenant context in JWT
- **Loading State**: Skeleton loader pulse animations across KPI cards and project rows
- **Error State**: Red toast error banner: `Unable to load dashboard metrics. Retrying...`
- **Retry Strategy**: 3 automatic retries via TanStack Query (`staleTime: 60000ms`)
- **Caching Strategy**: Redis L2 Cache key `dashboard:org:{org_id}:metrics`, TTL 60 seconds

---

### 3️⃣ AI Proposal Generator (`/proposals`)

- **Screen Name**: AI Proposal Generator & Live Synthesis
- **Frontend Components**:
  - `ProposalForm`: Input fields (`Client Name`, `Project Title`, `Budget ($)`, `Timeline (Weeks)`, `Industry`, `Tech Stack`, `Scope & Objectives`).
  - `GenerateButton`: Primary action button triggers AI synthesis loading spinner.
  - `ValidationErrorBanner`: Red alert banner displayed when required inputs are cleared (`Validation Error: Client Name is required`).
  - `LivePreviewPanel`: Markdown text viewer displaying real-time generated proposal sections (Executive Summary, Proposed Architecture, Timeline & Milestones, Commercial Investment).
  - `ExportActions`: `Copy Content`, `Download PDF`, `Convert to SOW Contract`.
- **Backend Module**: AI Synthesis Engine (`/api/v1/proposals`)
- **REST Endpoint Mapping**:
  - `POST /api/v1/proposals/generate` (Triggers AI synthesis pipeline)
  - `GET /api/v1/proposals/{proposalId}` (Retrieves saved proposal draft)
  - `PUT /api/v1/proposals/{proposalId}` (Updates custom proposal content)
- **Request Payload**:
  ```json
  {
    "clientName": "Nexus Health Inc.",
    "projectTitle": "HIPAA-Compliant Patient Portal",
    "budget": 65000,
    "timelineWeeks": 12,
    "industry": "Healthcare",
    "techStack": ["Next.js", "Spring Boot", "PostgreSQL", "AWS S3"],
    "scopeObjectives": "Build secure patient portal with appointment scheduling and EHR integration."
  }
  ```
- **Response Payload**:
  ```json
  {
    "id": "prop_8923f01a",
    "clientName": "Nexus Health Inc.",
    "status": "GENERATED",
    "generatedContentMarkdown": "# Executive Proposal\n\n## 1. Executive Summary...",
    "estimatedTokensUsed": 3420,
    "createdAt": "2026-07-24T14:32:00Z"
  }
  ```
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Validation Rules**:
  - `clientName`: non-empty, string length $2..150$
  - `budget`: positive number $> 0$
  - `timelineWeeks`: positive integer $1..104$
- **Loading State**: Animated progress pulse with status indicator (`Synthesizing architectural proposal with Claude 3.5...`)
- **Error State**: Displays inline validation banner or toast `AI Synthesis Timeout. Please retry.`
- **Retry Strategy**: 1 automatic retry on HTTP 504 Gateway Timeout; no retry on HTTP 400 Bad Request
- **Caching Strategy**: Request result cached in Redis `proposal:draft:{id}` for 15 minutes

---

### 4️⃣ Legal Contract & SOW Builder (`/contracts`)

- **Screen Name**: Legal Contract & Statement of Work Builder
- **Frontend Components**:
  - `ContractForm`: Inputs (`Client Name`, `Agreement Type` [MSA / SOW / NDA], `Effective Date`, `IP Ownership Terms`, `Governing Law State`).
  - `ValidationErrorBanner`: Red alert banner displayed on missing client name (`Validation Error: Client Name is required for contract generation.`).
  - `SignatureLinkSection`: E-signature URL generator with copy link button and status badge (`Draft`, `Sent for Signature`, `Executed`).
  - `ContractDocumentViewer`: Rendered legal agreement text container.
- **Backend Module**: Legal Contracts Service (`/api/v1/contracts`)
- **REST Endpoint Mapping**:
  - `POST /api/v1/contracts/generate` (Creates new contract document)
  - `POST /api/v1/contracts/{contractId}/signature-link` (Generates e-signature URL)
  - `GET /api/v1/contracts/{contractId}` (Fetches contract status)
- **Request Payload**:
  ```json
  {
    "clientName": "Acme Global Solutions",
    "agreementType": "STATEMENT_OF_WORK",
    "ipOwnership": "CLIENT_EXCLUSIVE",
    "governingLaw": "Delaware, USA",
    "effectiveDate": "2026-08-01"
  }
  ```
- **Response Payload**:
  ```json
  {
    "contractId": "ctr_9921ab4c",
    "signatureUrl": "https://agencyos.io/esign/ctr_9921ab4c?token=eyJhbGci...",
    "status": "SENT_FOR_SIGNATURE",
    "documentPdfUrl": "https://s3.amazonaws.com/agencyos-contracts/ctr_9921ab4c.pdf"
  }
  ```
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`
- **Validation Rules**: `clientName` required, `agreementType` must match enum `[MSA, SOW, NDA]`
- **Loading State**: Button spinner (`Generating Contract PDF & E-Sign Link...`)
- **Error State**: Inline error alert banner
- **Retry Strategy**: 2 retries on S3 upload timeout
- **Caching Strategy**: No caching on signature link generation for security

---

### 5️⃣ AI Invoice & Billing Builder (`/invoices`)

- **Screen Name**: AI Invoice & Billing Builder
- **Frontend Components**:
  - `InvoiceHeader`: Invoice Number (`INV-2026-0042`), Status Badge (`Pending` / `Sent` / `Paid`), Client Selector.
  - `LineItemsTable`: Dynamic rows with `Item Description`, `Quantity`, `Unit Rate ($)`, `Line Total ($)`, and `+ Add Item` row button.
  - `TotalsSummaryCard`: Subtotal, Tax Rate (8%), Total Due (`$24,840`).
  - `SendInvoiceButton`: Triggers invoice dispatch and status update to `Sent`.
  - `SentConfirmationAlert`: Persistent green alert banner displayed upon send (`Invoice INV-2026-0042 created and sent to client successfully! Status updated to Sent.`).
  - `ValidationErrorBanner`: Red alert banner displayed on invalid quantities/rates $\le 0$ (`Validation Error: Item quantities and unit prices must be greater than zero.`).
- **Backend Module**: Billing & Invoicing Service (`/api/v1/invoices`)
- **REST Endpoint Mapping**:
  - `POST /api/v1/invoices` (Creates invoice)
  - `POST /api/v1/invoices/{invoiceId}/send` (Dispatches invoice to client & Stripe)
- **Request Payload**:
  ```json
  {
    "clientName": "Nexus Health Inc.",
    "clientEmail": "billing@nexushealth.com",
    "dueDate": "2026-08-15",
    "items": [
      { "description": "Phase 1 Frontend Development", "quantity": 1, "rate": 12500.00 },
      { "description": "Spring Boot API Integration", "quantity": 1, "rate": 6000.00 },
      { "description": "Cloud Deployment & QA", "quantity": 1, "rate": 4500.00 }
    ],
    "taxRatePercent": 8.00
  }
  ```
- **Response Payload**:
  ```json
  {
    "invoiceId": "inv_0042891a",
    "invoiceNumber": "INV-2026-0042",
    "subtotal": 23000.00,
    "tax": 1840.00,
    "total": 24840.00,
    "status": "SENT",
    "stripeCheckoutUrl": "https://checkout.stripe.com/c/pay/cs_live_a1b2c3..."
  }
  ```
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`
- **Validation Rules**: Quantity $> 0$, Rate $> 0$, Tax Rate $\ge 0$
- **Loading State**: Button spinner (`Sending Invoice via Stripe...`)
- **Error State**: Red validation banner
- **Retry Strategy**: No auto-retry on payment link creation to prevent duplicate checkout sessions
- **Caching Strategy**: Evict tenant invoice list cache on send

---

### 6️⃣ 360° Client CRM Directory (`/clients`)

- **Screen Name**: Client CRM Directory & Profile Manager
- **Frontend Components**:
  - `SearchToolbar`: Search input (`Search by name, contact, email`), Status filter dropdown (`All`, `Active Contract`, `Onboarding`).
  - `ClientCardsGrid`: Client organization cards displaying total revenue, active contracts, account lead, and `Profile` CTA button.
  - `ClientDetailModal`: Interactive modal displaying linked projects, billing history, and contact list.
  - `EmptySearchBanner`: Rendered when zero clients match search query (`No client records match your search`).
- **Backend Module**: Client CRM Service (`/api/v1/clients`)
- **REST Endpoint Mapping**:
  - `GET /api/v1/clients?search={query}&status={filter}&page=1&size=10`
  - `GET /api/v1/clients/{clientId}/detail`
- **Request Payload**: None (`GET`)
- **Response Payload**:
  ```json
  {
    "content": [
      {
        "id": "cli_9912a",
        "name": "Nexus Health Inc.",
        "contactName": "Dr. Aris Thorne",
        "contactEmail": "athorne@nexushealth.com",
        "status": "ACTIVE_CONTRACT",
        "totalRevenue": 142000.00,
        "activeProjectsCount": 2
      }
    ],
    "totalElements": 14,
    "totalPages": 2
  }
  ```
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Validation Rules**: `search` string trimmed and sanitized
- **Loading State**: Skeleton grid loader cards
- **Error State**: Inline retry banner
- **Retry Strategy**: 2 automatic retries
- **Caching Strategy**: Redis cache `clients:org:{orgId}:page:{page}`, TTL 300 seconds

---

### 7️⃣ Agile Project Tracker (`/projects`)

- **Screen Name**: Agile Project Tracker & Milestone Hub
- **Frontend Components**:
  - `FilterToolbar`: Filter dropdown (`All`, `In Progress`, `In Review`, `Completed`, `Planning`).
  - `ProjectGrid`: Milestone progress cards displaying budget consumption, team avatars, deadline dates, and status tags.
- **Backend Module**: Project Management Service (`/api/v1/projects`)
- **REST Endpoint Mapping**: `GET /api/v1/projects?status={status}`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Validation Rules**: Valid status filter enum
- **Loading State**: Pulse animation grid
- **Retry Strategy**: 2 retries
- **Caching Strategy**: Redis TTL 120s

---

### 8️⃣ Jira Story Generator & Integration (`/jira`)

- **Screen Name**: Jira Story Generator & Sprint Sync
- **Frontend Components**:
  - `SprintMetricsCard`: Active Sprint Points (`42 Pts`), Ticket Breakdown (`To Do: 3`, `In Progress: 5`, `Done: 14`).
  - `EpicProgressBars`: Progress indicators for high-level epics (`Enterprise Auth & Profile: 75%`).
  - `SyncButton`: Triggers Atlassian Cloud API sync with persistent confirmation message (`Sprint status updates synchronized with Atlassian Cloud!`).
- **Backend Module**: Jira Integration Service (`/api/v1/jira`)
- **REST Endpoint Mapping**:
  - `GET /api/v1/jira/sprint-metrics`
  - `POST /api/v1/jira/sync-sprint`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Retry Strategy**: Exponential backoff on Atlassian Cloud 429 rate limit
- **Caching Strategy**: Redis TTL 60s

---

### 9️⃣ Workspace Settings & BYOK AI Configuration (`/settings`)

- **Screen Name**: Workspace Settings, AI API Keys & Team Access
- **Frontend Components**:
  - `TabNavigation`: Tabs (`Workspace & Branding`, `AI Models & API Keys`, `Team Members & Roles`, `Billing & Plan`).
  - `BrandingForm`: Agency Name, Primary Email, Default Currency.
  - `NotificationPreferences`: Checkboxes for `Email Digest`, `Slack/Jira Webhooks`, `Weekly Summary`.
  - `AIKeysForm`: Password inputs for Anthropic Claude, OpenAI, Google Gemini keys.
  - `TeamMembersTable`: Team member rows with role selector dropdown (`<select aria-label="Role for Member">` options: `Owner / Admin`, `Lead Architect`, `Senior Engineer`, `UX Designer`, `Viewer`).
- **Backend Module**: Settings & Team Security Service (`/api/v1/settings`)
- **REST Endpoint Mapping**:
  - `GET /api/v1/settings`
  - `PUT /api/v1/settings/branding`
  - `PUT /api/v1/settings/ai-keys`
  - `PUT /api/v1/settings/team-members/{memberId}/role`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN` (Required for AI Keys & Role Management)
- **Validation Rules**: Valid API key format checks, valid email format
- **Loading State**: Button spinner & toast alert (`Settings Saved!`)
- **Retry Strategy**: 1 retry
- **Caching Strategy**: Evict tenant settings cache on save
