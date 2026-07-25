# 🚀 AI Agency Operating System (AgencyOS)

An enterprise-grade, full-stack **AI Operating System** designed for modern digital web, design, and software engineering agencies. Synthesize client proposals, generate compliant Statements of Work (SOWs) and contracts with e-signature links, manage itemized client billing with Stripe, track agile project milestones, sync Jira sprints, and manage client CRM directories—all in one unified, high-performance platform.

---

## 📚 Production Architectural & Engineering Documentation Suite

This project contains comprehensive enterprise-level architectural, product, design, database, API, DevOps, and QA testing specifications:

### 🏗️ System Architecture & Mapping
- **[system_architecture.md](system_architecture.md)** — C4 System Architecture, Component & Container Diagrams, Sequence Flows, and NFR targets.
- **[frontend_backend_mapping.md](frontend_backend_mapping.md)** — Comprehensive screen-by-screen mapping for 22+ pages: REST endpoints, payloads, validation rules, loading/error states, retry & caching strategies.

### 🗄️ Database & Schema Specifications
- **[database_schema.md](database_schema.md)** — PostgreSQL 16 DDL, table definitions, constraints, foreign keys, B-tree/GIN composite indexes, soft deletes, and JSONB schemas.
- **[entity_relationship_diagram.md](entity_relationship_diagram.md)** — Complete Mermaid ER diagram spanning Organizations, Users, Clients, Projects, Proposals, Contracts, Invoices, Jira Stories, and Audit Logs.
- **[flyway_migrations.md](flyway_migrations.md)** — Flyway SQL migration scripts (`V1` to `V4`), checksum validation, and execution procedures.

### 🔌 API Architecture & Integration
- **[api_integration_guide.md](api_integration_guide.md)** — OpenAPI 3.1 specification, JWT access/refresh token flows, RBAC authorization matrix, Axios/TanStack Query client interceptors, and global error handling.

### ☁️ Cloud Deployment & DevOps
- **[deployment_vercel_railway.md](deployment_vercel_railway.md)** — Option A Deployment: Vercel + Railway (Backend/PostgreSQL/Redis) + AWS S3.
- **[deployment_vercel_aws.md](deployment_vercel_aws.md)** — Option B Deployment: Vercel + AWS ECS Fargate + RDS PostgreSQL + ElastiCache + CloudFront + S3.
- **[github_actions_ci_cd.md](github_actions_ci_cd.md)** — Production GitHub Actions YAML workflows for CI, Docker builds, Playwright E2E, vulnerability scanning, and CD deployments.
- **[docker_setup.md](docker_setup.md)** — Production multi-stage Dockerfiles for Spring Boot & Next.js, `docker-compose.yml` for local dev/staging, and non-root container security setup.
- **[environment_variables.md](environment_variables.md)** — Complete inventory of all environment variables for Dev, Staging, and Production across Frontend, Backend, DB, Redis, and AWS.

### 📊 Observability, Logging & Security
- **[monitoring_strategy.md](monitoring_strategy.md)** — Prometheus metrics, Grafana dashboards, Spring Actuator `/actuator/health`, custom AI token metrics, and alerting rules.
- **[logging_strategy.md](logging_strategy.md)** — Structured JSON logging (Loki/ELK), correlation/trace IDs, audit/security/AI log schemas, and retention policies.
- **[observability_strategy.md](observability_strategy.md)** — OpenTelemetry distributed tracing architecture, W3C headers, span propagation, APM metrics, and incident response playbooks.
- **[security_checklist.md](security_checklist.md)** — Enterprise security audit checklist (OWASP Top 10, TLS 1.3, AES-256 DB encryption, JWT security, CORS policies).

### 🚀 Production Readiness & Operations
- **[production_checklist.md](production_checklist.md)** — Comprehensive production readiness checklist across infrastructure, security, database, monitoring, and DR.
- **[release_checklist.md](release_checklist.md)** — Pre-release, deployment execution, post-deployment smoke tests, semantic versioning (`v1.0.0`), and git tags.
- **[rollback_strategy.md](rollback_strategy.md)** — Automated and manual rollback strategy for database migrations, backend micro-services, and frontend deployments.

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
