# 🚀 AI Agency Operating System (AgencyOS)

An enterprise-grade, full-stack **AI Operating System** designed for modern digital web, design, and software engineering agencies. Synthesize client proposals, generate compliant Statements of Work (SOWs) and contracts with e-signature links, manage itemized client billing with Stripe, track agile project milestones, sync Jira sprints, and manage client CRM directories—all in one unified, high-performance platform.

---

## 📚 Complete Enterprise Documentation Index

This project contains comprehensive enterprise-level architectural, product, design, database, API, DevOps, and QA testing specifications:

### ☁️ Production Deployment & DevOps Architecture
- **[deployment_vercel_railway.md](deployment_vercel_railway.md)** — Option A Production Deployment: Vercel + Railway (Backend/PostgreSQL/Redis) + AWS S3.
- **[deployment_vercel_aws.md](deployment_vercel_aws.md)** — Option B Enterprise AWS Deployment: Vercel + AWS ECS Fargate + RDS PostgreSQL + ElastiCache + CloudFront + Route 53.
- **[environment_variables.md](environment_variables.md)** — Complete inventory of all environment variables for Dev, QA, Staging, and Production across all layers.
- **[infrastructure_architecture.md](infrastructure_architecture.md)** — C4 Deployment diagrams, multi-environment strategy (Dev/QA/Staging/Prod URLs, DB, Redis, Secrets).
- **[github_actions_ci_cd.md](github_actions_ci_cd.md)** — Production GitHub Actions YAML workflows (`deploy-production.yml`) covering linting, unit/integration tests, Playwright E2E, vulnerability scanning, Docker ECR builds, and deployments.
- **[database_deployment.md](database_deployment.md)** — PostgreSQL RDS deployment, HikariCP connection pooling, Flyway migrations, seed data, backups, read replicas, HA.
- **[redis_deployment.md](redis_deployment.md)** — Redis deployment architecture, L2 response caching, session storage, rate-limit buckets, queue backends, TTL.
- **[storage_deployment.md](storage_deployment.md)** — AWS S3 / Cloudflare R2 bucket structure, IAM policies, pre-signed URLs, multipart upload strategy, backups.
- **[monitoring_strategy.md](monitoring_strategy.md)** — Prometheus, Grafana, OpenTelemetry, Sentry, CloudWatch metrics, SLA targets, and PagerDuty alerting.
- **[logging_strategy.md](logging_strategy.md)** — Structured JSON logging (Loki/ELK), correlation IDs, audit logs, authentication logs, retention policies.
- **[security_deployment.md](security_deployment.md)** — HTTPS everywhere, TLS 1.3, WAF, CORS, CSP, CSRF, JWT security, IAM roles, rate limiting, OWASP controls.
- **[backup_restore_strategy.md](backup_restore_strategy.md)** — Automated snapshot backups, WAL archiving, point-in-time recovery (PITR), RTO $< 15\text{m}$, RPO $< 15\text{m}$.
- **[scaling_strategy.md](scaling_strategy.md)** — Auto-scaling rules (ECS Fargate / Railway), PostgreSQL read replicas, Redis cluster scaling, AI provider failover.
- **[rollback_strategy.md](rollback_strategy.md)** — Zero-downtime rollback procedures for Vercel, ECS Fargate, Railway, and Flyway database migrations.
- **[production_go_live_checklist.md](production_go_live_checklist.md)** — Pre-go-live and post-go-live verification checklist across infrastructure, security, database, monitoring, and DR.

### 🔌 API Architecture & Integration Suite
- **[complete_api_integration_guide.md](complete_api_integration_guide.md)** — Master API integration guide bridging Next.js 15 frontend and Spring Boot backend.
- **[frontend_backend_mapping.md](frontend_backend_mapping.md)** — Comprehensive screen-by-screen mapping for 28+ UI modules to REST endpoints, HTTP methods, payloads, validation rules, loading/error states.
- **[api_contract.md](api_contract.md)** — OpenAPI 3.1 contract, parameter schemas, request/response models, and HTTP status codes.
- **[openapi_structure.md](openapi_structure.md)** — OpenAPI 3.1 component schemas, reusable DTO definitions, security schemes, tags, and Swagger UI configurations.
- **[api_security_guide.md](api_security_guide.md)** — OAuth2, OIDC, JWT refresh token flow, RBAC matrix, CORS, CSP, CSRF, rate limiting, and prompt injection protection.
- **[frontend_api_client.md](frontend_api_client.md)** — Axios instance setup, TanStack Query key factories, custom hooks, API interceptors, token refresh, and optimistic updates.
- **[backend_service_mapping.md](backend_service_mapping.md)** — Controller-to-Service-to-Repository layer flow, DTO mappers, JPA entity mappings, transactions, and event listeners.
- **[webhook_integration.md](webhook_integration.md)** — Inbound/outbound webhook specifications (Proposal Approved, Invoice Paid, Contract Signed, Stripe/Slack/GitHub events).
- **[third_party_integrations.md](third_party_integrations.md)** — Integrations for Anthropic Claude, OpenAI, Google Gemini, Stripe, Resend, Slack, Jira, GitHub, AWS S3, Google Calendar, Zoom.
- **[api_testing_guide.md](api_testing_guide.md)** — REST Assured backend unit/integration tests, Postman collection specifications, Playwright contract tests, and MSW mock APIs.
- **[api_deployment_configuration.md](api_deployment_configuration.md)** — Environment variables, API base URLs, secrets management, feature flags, and production CORS policies.
- **[api_versioning_strategy.md](api_versioning_strategy.md)** — URI versioning (`/api/v1`), header versioning, `Sunset` deprecation headers, and backward compatibility policies.
- **[api_error_handling.md](api_error_handling.md)** — RFC 7807 Problem Details error models, validation errors, business error codes, and retryable error handling.
- **[api_monitoring.md](api_monitoring.md)** — Prometheus API metrics (`http_server_requests_seconds`), Grafana APM dashboards, SLA metrics, and health check probes.

### 🏗️ System Architecture & Database
- **[system_architecture.md](system_architecture.md)** — C4 System Architecture, Component & Container Diagrams, Sequence Flows, and NFR targets.
- **[database_schema.md](database_schema.md)** — PostgreSQL 16 DDL, table definitions, constraints, foreign keys, B-tree/GIN composite indexes, soft deletes, and JSONB schemas.
- **[entity_relationship_diagram.md](entity_relationship_diagram.md)** — Complete Mermaid ER diagram spanning Organizations, Users, Clients, Projects, Proposals, Contracts, Invoices, Jira Stories, and Audit Logs.
- **[flyway_migrations.md](flyway_migrations.md)** — Flyway SQL migration scripts (`V1` to `V4`), checksum validation, and execution procedures.

---

## ⚡ Tech Stack & Architecture

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design Tokens**: [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism theme & Light/Dark Mode Context
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Automated Testing Engine**: [TestSprite AI Testing Engine (MCP)](https://www.testsprite.com/) + [Playwright](https://playwright.dev/)
- **Accessibility Compliance**: WCAG 2.1 Level AA (`role="progressbar"`, ARIA attributes, focus indicators)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Vinod-Nex/AI-Agency-Operating-System.git
   cd AI-Agency-Operating-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Launch**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
