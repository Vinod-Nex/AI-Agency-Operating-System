# Grafana Production Dashboard Specifications
## AI Agency Operating System (AgencyOS)

---

## 1. Catalog of 8 Production Grafana Dashboards

| Dashboard ID | Dashboard Title | Primary Audience | Key Visual Widgets |
| :--- | :--- | :--- | :--- |
| `dash-exec` | **Executive Agency Dashboard** | C-Level / Agency Admins | MRR, Proposals Generated, AI Hours Saved, Token Quota. |
| `dash-ops` | **Platform Operations Dashboard** | SRE & Operations Team | System Health, Active ECS Tasks, Error Rates, CPU/RAM. |
| `dash-api` | **API Performance Dashboard** | Backend Engineers | Request Throughput, P95/P99 Latency, 4xx/5xx Breakdown. |
| `dash-db` | **PostgreSQL & Redis Dashboard** | DBAs & Backend Team | HikariCP Active Pools, Slow Queries, Redis Cache Hit Ratio. |
| `dash-ai` | **AI Prompt Engine Dashboard** | AI Engineers & SREs | Claude/GPT-4o/Gemini Token Consumption, LLM Fallbacks. |
| `dash-billing` | **Stripe Billing & Invoicing** | Financial Ops | Invoices Created vs Paid, Stripe Webhook Processing Times. |
| `dash-sec` | **Security & Audit Dashboard** | Security Architects | Failed Login Attempts, RBAC Violations, Rate Limit Spikes. |
| `dash-infra` | **Cloud Infrastructure Dashboard**| Cloud Architects | AWS ECS Fargate CPU, ALB Target Response Time, S3 Storage. |
