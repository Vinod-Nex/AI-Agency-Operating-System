# Enterprise Software Architecture Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Executive Architecture

The **AI Agency Operating System (AgencyOS)** is designed as an enterprise-grade, multi-tenant SaaS application that automates >80% of an agency's operational lifecycle—from lead inquiry and AI proposal generation to Statement of Work (SOW) drafting, legal contracts, invoicing, meeting synthesis, Jira story breakdown, and project tracking.

### Non-Functional Architectural Targets:
- **Availability**: 99.99% multi-region uptime.
- **Latency**: API p95 response < 100ms; AI TTFT (Time to First Token) < 500ms.
- **Scalability**: Support 50,000+ active agency tenants and 1,000,000+ generated client documents/month.
- **Security**: SOC2 Type II, HIPAA compliant data pipeline, TLS 1.3, AES-256 encryption at rest, and strict multi-tenant isolation.

---

## 2. High Level Architecture

```
                                    +-----------------------------------+
                                    |     Client Web / Mobile Apps      |
                                    |    (Next.js 15 App Router / PWA)  |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |    API Gateway & Security Layer   |
                                    | (Cloudflare Enterprise / Kong GW) |
                                    +-----------------+-----------------+
                                                      |
                                      +---------------+---------------+
                                      |                               |
                                      v                               v
                        +---------------------------+   +---------------------------+
                        |  Core Modular Monolith /  |   |    AI Orchestration &     |
                        |   App Microservices Node  |   |   Prompt Engine Worker    |
                        +-------------+-------------+   +-------------+-------------+
                                      |                               |
                   +------------------+------------------+            |
                   |                  |                  |            v
                   v                  v                  v   +------------------+
            +--------------+   +--------------+   +--------+ | External AI LLMs |
            |  PostgreSQL  |   | Redis Cluster|   | AWS S3 | | (Claude, OpenAI, |
            | (Multi-Tenant|   | (Caching &   |   | / R2   | |  Gemini Flash)   |
            |   Database)  |   |  BullMQ)     |   | Storage| +------------------+
            +--------------+   +--------------+   +--------+
```

---

## 3. Clean Architecture Layering

The codebase strictly follows **Clean Architecture / Hexagonal Architecture**:

1. **Domain Layer (`src/core/domain`)**: Enterprise Business Rules. Contains Aggregates, Entities, Value Objects, Domain Events, and Repository Interfaces. Zero external dependencies.
2. **Application Layer (`src/core/application`)**: Application Business Rules. Contains Use Cases, Command/Query Handlers (CQRS), DTOs, and Port Definitions.
3. **Interface Adapters (`src/presentation` & `src/adapters`)**: Converts data between domain formats and HTTP/GraphQL/gRPC. Contains Controllers, Presenters, Serializers, and Middleware.
4. **Infrastructure Layer (`src/infrastructure`)**: Frameworks, Drivers, and External Systems. Contains Database Repositories (Prisma/Drizzle), LLM SDK connectors, Redis Cache adapters, S3 Storage adapters, and Event Bus publishers.

---

## 4. Microservice & Domain Module Architecture

AgencyOS uses a **Modular Monolith** pattern deployable as decoupled microservices:

1. **Identity & Tenant Service**: Handles Multi-tenant Auth, Organization Onboarding, RBAC, and OAuth SSO.
2. **AI Document Synthesis Engine**: Manages prompt chaining, streaming LLM inference, document formatting, and PDF rendering.
3. **Client CRM & Project Management Service**: Manages Client Entities, Deliverable Timelines, Sprint Kanban, and Risk Logs.
4. **Billing & Invoicing Service**: Manages Stripe Subscription Webhooks, Line-Item Tax Calculations, and ACH/Credit Card Settlements.
5. **Jira & Integrations Sync Engine**: Handles bi-directional synchronization with Atlassian Jira, Slack, Google Workspace, and Resend.
6. **Analytics & Audit Service**: Collects telemetry, revenue aggregation, token usage metrics, and SOC2 audit logs.

---

## 5. Domain-Driven Design (DDD) Bounded Contexts

```
[Identity & Tenant Context] --------> [Client CRM Context]
           |                                  |
           v                                  v
[AI Document Synthesis Context] <---> [Billing & Financial Context]
           |
           v
[Agile Engineering & Jira Context]
```

- **Aggregates**: `OrganizationAggregate`, `ProposalAggregate`, `SOWContractAggregate`, `InvoiceAggregate`, `ProjectSprintAggregate`.
- **Value Objects**: `Money`, `Currency`, `DocumentStatus`, `TenantId`, `PromptContext`, `GherkinScenario`.

---

## 6. Enterprise Folder Structure

```
ai-agency-operating-system/
├── app/                        # Next.js 15 App Router Routes & Pages
│   ├── (auth)/                 # Authentication Pages (Login, Signup, SSO)
│   ├── (dashboard)/            # Authenticated Agency Dashboard Layout & Pages
│   │   ├── dashboard/          # Executive Metrics
│   │   ├── proposals/          # AI Proposal Generator & History
│   │   ├── contracts/          # SOW & MSA Contract Builder
│   │   ├── invoices/           # Invoice & Stripe Billing
│   │   ├── jira/               # AI Jira Backlog Generator
│   │   ├── clients/            # Client CRM
│   │   ├── projects/           # Project Management & Kanban
│   │   └── settings/           # BYOK API Keys & Organization Settings
│   ├── api/                    # REST / Route Handlers
│   ├── globals.css             # Design Tokens & Glassmorphic Utilities
│   └── layout.tsx              # Root Layout
├── src/                        # Core Application Business Logic
│   ├── core/                   # Domain Driven Architecture
│   │   ├── domain/             # Entities, Aggregates, Value Objects
│   │   └── application/        # Use Cases & Command Handlers
│   ├── infrastructure/         # DB Repositories, Redis, S3, LLM Adapters
│   ├── presentation/           # Shared UI Components & Design System
│   │   ├── components/         # Atomic UI Components
│   │   ├── hooks/              # Custom React Hooks
│   │   └── providers/          # Context & Theme Providers
├── public/                     # Static Assets & Icons
├── DESIGN.md                   # Google Stitch Design System Specification
├── ARCHITECTURE.md             # Complete 30-Section Software Architecture Spec
├── package.json                # Project Dependencies
├── tailwind.config.js          # Tailwind CSS Design Tokens
└── tsconfig.json               # TypeScript Configuration
```

---

## 7. Module Breakdown Matrix

| Module | Primary Responsibility | Data Entities | AI Engine Model Routing | External API |
| :--- | :--- | :--- | :--- | :--- |
| **Landing** | Lead conversion & pricing | `Lead`, `Plan` | N/A | Stripe |
| **Auth** | Tenant auth & session | `User`, `Tenant`, `Session` | N/A | Google OAuth, GitHub |
| **Dashboard** | Metrics & telemetry | `Metric`, `ActivityLog` | AI Summarizer | PostHog |
| **Proposals** | RFP & Proposal generation | `Proposal`, `Template` | Claude 3.5 Sonnet | Resend, S3 |
| **SOW & Contracts** | Legal contract drafting | `Contract`, `Clause` | Claude 3.5 / GPT-4o | E-Sign API |
| **Invoices** | Milestone billing | `Invoice`, `LineItem` | N/A | Stripe API |
| **Jira Generator** | Story & criteria drafting | `JiraStory`, `Scenario` | Claude Haiku / Gemini | Jira Cloud API |
| **Clients** | 360° Client CRM | `Client`, `Contact` | N/A | Resend |
| **Projects** | Sprint tracking | `Project`, `Sprint`, `Task` | Risk Evaluator | GitHub API |
| **AI Settings** | BYOK Keys & Guardrails | `ApiKey`, `PromptConfig` | N/A | AWS KMS |

---

## 8. Reusable Component Strategy

Atomic Design Component System:
1. **Atoms / Tokens**: Buttons, Input Fields, Status Badges, Typography, Color Swatches.
2. **Molecules**: Form Input Groups, Metric Stat Cards, Filter Bars, User Profile Badges.
3. **Organisms**: Sidebar Navigation, Top Header, AI Generator Config Panel, Document Markdown Reader, Line-Item Invoice Table.
4. **Templates**: Dashboard Split-View Grid, Full-bleed Document Workspace, Settings Modal.

---

## 9. Frontend Architecture

- **Framework**: Next.js 15 (App Router + React Server Components + Client Components).
- **State Management**:
  - Global UI State: `Zustand` (Sidebar collapse, Active Workspace, Modal triggers).
  - Server Data Cache: `TanStack Query (React Query v5)` + Next.js Server Actions.
  - Form Handling: `React Hook Form` + `Zod` schema validation.
- **Streaming UI**: SSE (Server-Sent Events) via `ReadableStream` for live AI generation rendering.

---

## 10. Backend Architecture

- **Runtime**: Node.js 22 LTS / TypeScript.
- **API Style**: RESTful JSON APIs + Server-Sent Events (SSE) for streaming endpoints.
- **Pattern**: Repository Pattern + Dependency Injection (TSyringe/InversifyJS).
- **ORM / Query Engine**: `Prisma ORM` / `Drizzle ORM` with strict type generation.

---

## 11. API Gateway Architecture

- **Gateway Engine**: Cloudflare Enterprise / Kong API Gateway.
- **Capabilities**:
  - TLS 1.3 Termination & HTTP/3 support.
  - Rate Limiting: Token Bucket Algorithm per tenant (Starter: 60 req/min, Agency: 600 req/min).
  - CORS, CSP header injection, and Request Payload Sanitization (`DOMPurify` + Zod).
  - JWT Access Token Verification at the Edge.

---

## 12. Authentication Flow

```
User -> [Login Request] -> API Gateway -> [Auth Service]
                                             |
                                  +----------+----------+
                                  |                     |
                                  v                     v
                           [Verify Password]     [Check MFA / SSO]
                                  |                     |
                                  +----------+----------+
                                             |
                                             v
                                  [Generate JWT Tokens]
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
      [HttpOnly Secure Cookie]                              [JSON Access Token]
     (Refresh Token - 7 Days)                              (Short lived - 15 Mins)
```

---

## 13. Authorization & Tenant Isolation Strategy

- **Tenant Isolation**: Row-Level Security (RLS) in PostgreSQL enforced by injection of `tenant_id` on every query context.
- **Attribute-Based Access Control (ABAC)**: Request evaluated against User Role + Tenant ID + Resource Tenant ID + Organization Subscription Plan limits.

---

## 14. Role-Based Access Control (RBAC) Hierarchy

```
SUPER_ADMIN (Platform Level)
  └── AGENCY_OWNER (Tenant Level)
        ├── AGENCY_ADMIN
        ├── PROJECT_MANAGER
        │     ├── DEVELOPER
        │     └── QA_ENGINEER
        ├── FINANCE_MANAGER
        └── CLIENT_USER (Read-Only Client Portal)
```

---

## 15. Permission Matrix

| Resource / Action | AGENCY_OWNER | AGENCY_ADMIN | PROJECT_MANAGER | DEVELOPER | FINANCE_MANAGER | CLIENT_USER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage BYOK Keys** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Generate Proposals** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Approve SOW & Contracts**| ✅ | ✅ | ❌ | ❌ | ❌ | 👁️ (Read/Sign)|
| **Manage Invoices** | ✅ | ✅ | ❌ | ❌ | ✅ | 👁️ (Pay Only) |
| **Generate Jira Stories** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **View Financial Reports**| ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Manage Team Seats** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 16. Database Architecture & Multi-Tenant Schema

PostgreSQL Relational ERD Schema Highlights:

```sql
-- Organizations / Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'STARTER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'DEVELOPER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    budget VARCHAR(100),
    timeline VARCHAR(100),
    content_markdown TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

- **Connection Pooling**: PgBouncer pooling cluster with maximum 500 active pool connections.
- **Indexing Strategy**: B-Tree composite indices on `(tenant_id, created_at)` for all tenant queries.

---

## 17. Caching Strategy

- **L1 In-Memory Cache**: Node.js LRU cache for immutable static configurations (5 min TTL).
- **L2 Distributed Cache**: Redis Cluster (AWS ElastiCache / Upstash).
- **Cache Key Pattern**: `agencyos:{tenant_id}:{entity_name}:{entity_id}`.
- **Cache Invalidation**: Cache tags invalidated via domain event listeners (`ProposalUpdatedEvent`, `ContractSignedEvent`).

---

## 18. Storage Strategy

- **Object Store**: AWS S3 / Cloudflare R2 for assets (PDF proposals, contracts, client attachments, logos).
- **Security**: AES-256 server-side encryption (`SSE-S3`), private buckets with pre-signed URLs expiring in 15 minutes.
- **Lifecycle Policy**: Transition PDF exports older than 90 days to AWS Glacier Instant Retrieval.

---

## 19. Queue & Background Worker Architecture

- **Engine**: BullMQ over Redis.
- **Queue Queues**:
  1. `ai-generation-queue`: Processes heavy LLM prompt chains asynchronously.
  2. `pdf-rendering-queue`: Converts HTML/Markdown proposals into styled PDF binaries.
  3. `notification-queue`: Sends automated emails via Resend API and Slack webhooks.
  4. `jira-sync-queue`: Executes Jira Cloud API REST synchronization with exponential backoff retries.

---

## 20. Notification Architecture

- **Delivery Pipeline**: Multi-channel router (In-App SSE events, Email via Resend, Webhook to Slack/Teams).
- **Template Engine**: React Email components rendered to HTML strings.
- **Preference Matrix**: Per-user event subscriptions (e.g., "Notify me when client signs SOW").

---

## 21. Logging System

- **Logger**: `Pino` JSON logger.
- **Correlation ID**: `x-correlation-id` injected at API gateway and propagated across microservices, DB queries, and LLM calls.
- **Audit Logging**: Immutable `audit_logs` database table capturing User ID, IP address, Timestamp, Resource, and Action performed for SOC2 compliance.

---

## 22. Monitoring & Alerting

- **Metrics Engine**: Prometheus metrics endpoint (`/api/metrics`).
- **Key Metrics Tracked**:
  - `http_requests_total{status, endpoint}`
  - `ai_token_consumption_total{tenant_id, model}`
  - `document_generation_duration_seconds`
  - `db_connection_pool_active`
- **Alerting Thresholds**: Alert Slack channel if API error rate > 1% over 5 minutes or TTFT > 3 seconds.

---

## 23. Observability Architecture

- **Tracing**: OpenTelemetry distributed context propagation.
- **APM & Error Tracking**: Sentry SDK integrated into Next.js frontend and backend APIs.
- **Dashboard**: Grafana unified dashboard displaying API throughput, memory footprint, Redis hit ratios, and LLM costs.

---

## 24. CI/CD Pipeline Workflow

```
[Git Push] -> GitHub Actions
                 |
                 v
        +----------------+
        |  Lint & Format | (ESLint, Prettier)
        +-------+--------+
                |
                v
        +----------------+
        | TypeScript Check| (tsc --noEmit)
        +-------+--------+
                |
                v
        +----------------+
        | Unit & E2E Test| (Jest, Playwright)
        +-------+--------+
                |
                v
        +----------------+
        | Build Container| (Docker Image + Trivy Security Scan)
        +-------+--------+
                |
                v
        +----------------+
        | Blue/Green Dep | (Deploy to Kubernetes / Vercel Production)
        +----------------+
```

---

## 25. Deployment Strategy

- **Production Target**: Vercel Enterprise (Frontend & Edge Functions) + AWS EKS Kubernetes (Background BullMQ Workers & API Microservices).
- **Deployment Pattern**: Blue/Green Deployment with 10% canary traffic rollout over 15 minutes.

---

## 26. Infrastructure & IaC Setup

- **Tool**: Terraform / AWS CDK.
- **Resources Provisioned**: VPC, Dual Subnets, EKS Cluster, RDS PostgreSQL Multi-AZ instance, ElastiCache Redis, S3 Buckets, Cloudflare CDN distribution.

---

## 27. Security Architecture

- **OWASP Mitigation**: Strict input sanitization, CSP headers, rate limiting, CORS origin check.
- **Database Security**: Enforced SSL (`sslmode=require`), parameterized queries to eliminate SQL injection.
- **Secrets Management**: AWS Secrets Manager / HashiCorp Vault for BYOK API keys and encryption secrets.

---

## 28. Scalability Strategy

- **Stateless API Scaling**: Horizontal Pod Autoscaling (HPA) scaling API instances based on CPU > 70% or Request Count.
- **Database Scaling**: Read-Replicas for heavy analytical queries; PgBouncer for high-frequency short-lived API connections.

---

## 29. Performance Targets & SLA

- **Page Load Time**: LCP < 1.2s, CLS < 0.05, FID < 50ms.
- **API Performance**: p95 response < 100ms.
- **AI Streaming TTFT**: < 500ms first token.

---

## 30. Cost Optimization Strategy

- **Prompt Caching**: Cache common prompt prefixes to reduce Anthropic / OpenAI input token charges by up to 50%.
- **Smart Model Routing**: Route simple Jira story summaries to lighter models (`Claude 3.5 Haiku` / `Gemini Flash`) and reserve `Claude 3.5 Sonnet` / `GPT-4o` for complex legal contracts.
