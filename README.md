# 🚀 AI Agency Operating System (AgencyOS)

An enterprise-grade, full-stack **AI Operating System** designed for modern digital web, design, and software engineering agencies. Synthesize client proposals, generate compliant Statements of Work (SOWs) and contracts with e-signature links, manage itemized client billing with Stripe, track agile project milestones, sync Jira sprints, and manage client CRM directories—all in one unified, high-performance platform.

---

## 📚 Complete Enterprise Documentation Index

This project contains comprehensive enterprise-level architectural, product, design, database, API, DevOps, and QA testing specifications:

### 📊 Observability, SRE & Operations Architecture
- **[monitoring_and_logging.md](monitoring_and_logging.md)** — Master Observability, Logging, Monitoring, Alerting & Incident Response Specification.
- **[observability_architecture.md](observability_architecture.md)** — OpenTelemetry Collector architecture, 3 Pillars of Observability, and telemetry flows.
- **[logging_strategy.md](logging_strategy.md)** — Structured JSON log format, correlation IDs, trace/span IDs, audit & AI log categories.
- **[monitoring_strategy.md](monitoring_strategy.md)** — APM monitoring strategy across Next.js 15, Spring Boot API, PostgreSQL, Redis, and AI providers.
- **[grafana_dashboards.md](grafana_dashboards.md)** — Specifications for 8 Grafana Dashboards (Executive, Ops, API, Database, AI, Billing, Security, Infrastructure).
- **[prometheus_metrics.md](prometheus_metrics.md)** — Complete Prometheus metric catalog (`http_server_requests_seconds`, HikariCP, Redis, AI token counters).
- **[alerting_strategy.md](alerting_strategy.md)** — Alerting rules catalog, severity levels (SEV1-SEV4), and notification channels (Slack, PagerDuty, Email).
- **[incident_response_runbook.md](incident_response_runbook.md)** — Incident management framework, escalation matrix, incident timeline, postmortem template, and RCA.
- **[distributed_tracing.md](distributed_tracing.md)** — OpenTelemetry tracing strategy, span hierarchy, and W3C context propagation across services.
- **[security_monitoring.md](security_monitoring.md)** — Security event monitoring, failed login detection, RBAC violations, API abuse, and audit trails.
- **[performance_monitoring.md](performance_monitoring.md)** — Core Web Vitals ($LCP < 2.2\text{s}$, $CLS < 0.05$, $INP < 90\text{ms}$), backend throughput, and AI latency tracking.
- **[health_checks.md](health_checks.md)** — Health check probes (`/actuator/health/liveness`, readiness), DB, Redis, S3, and AI provider health.
- **[log_retention_policy.md](log_retention_policy.md)** — Log retention periods across environments, PII redaction, archiving, and compliance rules.
- **[operational_runbooks.md](operational_runbooks.md)** — Step-by-step operational runbooks for API down, DB outage, Redis crash, AI provider failover, and DR.

### ⚙️ CI/CD Architecture & GitHub Actions Pipeline
- **[ci_cd_setup.md](ci_cd_setup.md)** — Master CI/CD Architecture & Implementation Guide bridging GitHub Actions, Next.js 15, Spring Boot 3.2, Vercel, Railway, and AWS.
- **[github_actions_architecture.md](github_actions_architecture.md)** — GitHub Actions workflow topology, reusable workflows, matrix builds, permissions, and runner infrastructure.
- **[frontend_ci_pipeline.md](frontend_ci_pipeline.md)** — Next.js 15 linting, TypeScript type-check, Jest component tests, Playwright E2E, and bundle analysis pipeline.
- **[backend_ci_pipeline.md](backend_ci_pipeline.md)** — Spring Boot 3.2 Java 21 compile, JUnit 5, REST Assured, Spring validation, Flyway dry-runs, and JaCoCo coverage pipeline.
- **[database_ci_pipeline.md](database_ci_pipeline.md)** — Flyway migration validation, schema drift detection, seed data validation, and rollback tests.
- **[deployment_pipeline.md](deployment_pipeline.md)** — Vercel preview/production deployments, Railway, and AWS ECS Fargate Blue-Green & Canary deployment workflows.
- **[release_strategy.md](release_strategy.md)** — GitHub Flow, semantic versioning (`v1.0.0`), Git tags, approval gates, and automated release notes.
- **[rollback_strategy.md](rollback_strategy.md)** — Automated and emergency rollback procedures for Vercel, ECS Fargate, Railway, and database schema migrations.
- **[security_pipeline.md](security_pipeline.md)** — Snyk dependency scans, CodeQL SAST, Trivy container scans, OWASP Dependency Check, and SBOM generation.
- **[quality_gates.md](quality_gates.md)** — Frontend/Backend coverage thresholds, performance budgets, accessibility WCAG AA gates, and lint thresholds.
- **[environment_strategy.md](environment_strategy.md)** — Multi-environment strategy (Dev, QA, Testing, Staging, Production) URLs, database, Redis, and secret mappings.
- **[github_secrets.md](github_secrets.md)** — GitHub Secrets inventory, access policies, secret rotation, and least-privilege permission matrix.
- **[monitoring_pipeline.md](monitoring_pipeline.md)** — Pipeline build duration SLA metrics, failure notifications via Slack & Microsoft Teams, and deployment tracking.
- **[pipeline_checklists.md](pipeline_checklists.md)** — Pre-build, security scan, pre-deployment, post-deployment smoke test, and release checklists.

### ☁️ Production Deployment & DevOps Architecture
- **[deployment_vercel_railway.md](deployment_vercel_railway.md)** — Option A Production Deployment: Vercel + Railway (Backend/PostgreSQL/Redis) + AWS S3.
- **[deployment_vercel_aws.md](deployment_vercel_aws.md)** — Option B Enterprise AWS Deployment: Vercel + AWS ECS Fargate + RDS PostgreSQL + ElastiCache + CloudFront + Route 53.
- **[environment_variables.md](environment_variables.md)** — Complete inventory of all environment variables for Dev, QA, Staging, and Production across all layers.
- **[infrastructure_architecture.md](infrastructure_architecture.md)** — C4 Deployment diagrams, multi-environment strategy (Dev/QA/Staging/Prod URLs, DB, Redis, Secrets).
- **[database_deployment.md](database_deployment.md)** — PostgreSQL RDS deployment, HikariCP connection pooling, Flyway migrations, seed data, backups, read replicas, HA.
- **[redis_deployment.md](redis_deployment.md)** — Redis deployment architecture, L2 response caching, session storage, rate-limit buckets, queue backends, TTL.
- **[storage_deployment.md](storage_deployment.md)** — AWS S3 / Cloudflare R2 bucket structure, IAM policies, pre-signed URLs, multipart upload strategy, backups.
- **[security_deployment.md](security_deployment.md)** — HTTPS everywhere, TLS 1.3, WAF, CORS, CSP, CSRF, JWT security, IAM roles, rate limiting, OWASP controls.
- **[backup_restore_strategy.md](backup_restore_strategy.md)** — Automated snapshot backups, WAL archiving, point-in-time recovery (PITR), RTO $< 15\text{m}$, RPO $< 15\text{m}$.
- **[scaling_strategy.md](scaling_strategy.md)** — Auto-scaling rules (ECS Fargate / Railway), PostgreSQL read replicas, Redis cluster scaling, AI provider failover.
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
