# Frontend-to-Backend Component & API Mapping Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Executive Summary

This document provides an exhaustive mapping between every Next.js 15 page component, interactive form, modal, and state handler in the **AI Agency Operating System** frontend and its corresponding Spring Boot REST backend endpoints, payloads, authorization checks, retry logic, loading states, and caching policies.

---

## 2. Page & Component Mapping Directory

### 1️⃣ Landing Page (`/`)
- **Screen Name**: Public Marketing & Value Overview
- **UI Components**: `HeaderNav`, `HeroSection`, `FeatureGrid`, `PricingMatrix`, `TestimonialsSection`, `Footer`.
- **API Endpoints Used**: `GET /api/v1/public/pricing-plans`, `GET /api/v1/public/testimonials`
- **HTTP Methods**: `GET`
- **Authentication Required**: No
- **Authorization Rules**: Anonymous
- **Request Payload**: N/A
- **Response Payload**: `PricingPlanListDTO`, `TestimonialListDTO`
- **Error Handling**: Render static fallback cards if API is unreachable.
- **Loading Strategy**: Static Site Generation (SSG) with Edge ISR (revalidate: 3600s).
- **Retry Strategy**: 2 retries with exponential backoff.
- **Caching Strategy**: CDN Edge Cache `s-maxage=86400`.
- **Offline Behavior**: Serve cached static HTML bundle.

---

### 2️⃣ Authentication Routes (`/auth/login`, `/auth/register`, `/auth/forgot-password`)
- **Screen Name**: User Login & Tenant Registration
- **UI Components**: `LoginForm`, `RegisterForm`, `SocialOAuthButtons` (Google, GitHub), `ForgotPasswordForm`.
- **API Endpoints Used**:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/reset-password`
- **HTTP Methods**: `POST`
- **Authentication Required**: No (for login/register), Yes (`Bearer JWT` for token refresh)
- **Authorization Rules**: Anonymous / Authenticated
- **Request Payload**:
  ```json
  { "email": "user@agency.io", "password": "Password123!" }
  ```
- **Response Payload**:
  ```json
  { "accessToken": "eyJhbG...", "refreshToken": "eyJhbG...", "expiresIn": 900 }
  ```
- **Error Handling**: Display inline red alert banner `Invalid credentials. Please try again.`
- **Loading Strategy**: Button loading spinner.
- **Retry Strategy**: No auto-retry on 401 Unauthorized.
- **Caching Strategy**: No caching (`Cache-Control: no-store`).

---

### 3️⃣ Executive Dashboard (`/dashboard`)
- **Screen Name**: Executive Agency Operating System Dashboard
- **UI Components**: `Header`, `Sidebar`, `KPICardsGrid`, `ActiveProjectsList`, `ActivityLogFeed`.
- **API Endpoints Used**:
  - `GET /api/v1/dashboard/metrics`
  - `GET /api/v1/dashboard/active-projects`
  - `GET /api/v1/dashboard/activity-logs`
- **HTTP Methods**: `GET`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Request Payload**: N/A
- **Response Payload**: `DashboardMetricsDTO`, `ProjectListDTO`, `ActivityLogListDTO`
- **Error Handling**: Display red error toast banner with retry CTA button.
- **Loading Strategy**: Skeleton pulse loaders across metric cards and project rows.
- **Retry Strategy**: 3 retries via TanStack Query (`staleTime: 60000ms`).
- **Caching Strategy**: Redis L2 Cache key `dashboard:org:{org_id}`, TTL 60 seconds.

---

### 4️⃣ Client CRM Management (`/clients`)
- **Screen Name**: 360° Client CRM Directory
- **UI Components**: `SearchToolbar`, `ClientCardsGrid`, `ClientDetailModal`, `EmptySearchBanner`.
- **API Endpoints Used**:
  - `GET /api/v1/clients?search={query}&status={filter}&page=1&size=10`
  - `POST /api/v1/clients`
  - `GET /api/v1/clients/{id}/detail`
  - `PUT /api/v1/clients/{id}`
  - `DELETE /api/v1/clients/{id}`
- **HTTP Methods**: `GET`, `POST`, `PUT`, `DELETE`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Request Payload**:
  ```json
  { "companyName": "Nexus Health Inc.", "contactName": "Dr. Aris Thorne", "contactEmail": "athorne@nexushealth.com", "status": "ACTIVE_CONTRACT" }
  ```
- **Response Payload**: `PageResponse<ClientDTO>`
- **Error Handling**: Toast notification `Failed to load clients. Please check connection.`
- **Loading Strategy**: Skeleton grid loader.
- **Retry Strategy**: 2 retries.
- **Caching Strategy**: Redis TTL 300 seconds.

---

### 5️⃣ Project Management (`/projects`)
- **Screen Name**: Agile Project Tracker
- **UI Components**: `FilterToolbar`, `ProjectGrid`, `MilestoneProgressCard`.
- **API Endpoints Used**: `GET /api/v1/projects`, `POST /api/v1/projects`, `PUT /api/v1/projects/{id}`
- **HTTP Methods**: `GET`, `POST`, `PUT`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Error Handling**: Toast notification.
- **Retry Strategy**: 2 retries.
- **Caching Strategy**: Redis TTL 120 seconds.

---

### 6️⃣ AI Proposal Generator (`/proposals`)
- **Screen Name**: AI Proposal Synthesis Engine
- **UI Components**: `ProposalForm`, `GenerateButton`, `ValidationErrorBanner`, `LivePreviewPanel`, `ExportActions`.
- **API Endpoints Used**:
  - `POST /api/v1/proposals/generate`
  - `GET /api/v1/proposals/{id}`
  - `PUT /api/v1/proposals/{id}`
- **HTTP Methods**: `POST`, `GET`, `PUT`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Request Payload**:
  ```json
  { "clientName": "Nexus Health Inc.", "projectTitle": "Patient Portal", "budget": 65000, "timelineWeeks": 12, "scopeObjectives": "Build portal" }
  ```
- **Response Payload**: `ProposalDTO`
- **Error Handling**: Validation error banner (`Validation Error: Client Name is required.`)
- **Loading Strategy**: Animated progress pulse indicator.
- **Retry Strategy**: 1 retry on 504 Gateway Timeout.
- **Caching Strategy**: Draft cached in Redis for 15 minutes.

---

### 7️⃣ SOW & Legal Contract Builder (`/contracts`)
- **Screen Name**: Legal Contract & SOW Builder
- **UI Components**: `ContractForm`, `ValidationErrorBanner`, `SignatureLinkSection`, `ContractDocumentViewer`.
- **API Endpoints Used**: `POST /api/v1/contracts/generate`, `POST /api/v1/contracts/{id}/signature-link`
- **HTTP Methods**: `POST`, `GET`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`
- **Error Handling**: Red validation alert banner (`Validation Error: Client Name is required for contract generation.`)

---

### 8️⃣ Invoice & Billing Builder (`/invoices`)
- **Screen Name**: AI Invoice & Stripe Billing Builder
- **UI Components**: `InvoiceHeader`, `LineItemsTable`, `TotalsSummaryCard`, `SendInvoiceButton`, `SentConfirmationAlert`.
- **API Endpoints Used**: `POST /api/v1/invoices`, `POST /api/v1/invoices/{id}/send`
- **HTTP Methods**: `POST`, `GET`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`
- **Error Handling**: Red validation alert banner (`Validation Error: Item quantities and unit prices must be greater than zero.`)
- **Success Handling**: Green confirmation banner (`Invoice INV-2026-0042 created and sent to client successfully! Status updated to Sent.`)

---

### 9️⃣ Jira Story Generator (`/jira`)
- **Screen Name**: Jira Sprint Sync & Story Generator
- **UI Components**: `SprintMetricsCard`, `EpicProgressBars`, `SyncButton`.
- **API Endpoints Used**: `GET /api/v1/jira/sprint-metrics`, `POST /api/v1/jira/sync-sprint`
- **HTTP Methods**: `GET`, `POST`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_MEMBER`
- **Success Handling**: Sync alert banner (`Sprint status updates synchronized with Atlassian Cloud!`)

---

### 🔟 Workspace Settings & BYOK AI Keys (`/settings`)
- **Screen Name**: Workspace Settings & AI Configuration
- **UI Components**: `TabNavigation`, `BrandingForm`, `NotificationPreferences`, `AIKeysForm`, `TeamMembersTable`.
- **API Endpoints Used**: `GET /api/v1/settings`, `PUT /api/v1/settings/branding`, `PUT /api/v1/settings/ai-keys`, `PUT /api/v1/settings/team-members/{id}/role`
- **HTTP Methods**: `GET`, `PUT`
- **Authentication Required**: Yes (`Bearer JWT`)
- **Authorization Rules**: `ROLE_ADMIN`
