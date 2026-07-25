# Multi-Environment Architecture & Promotion Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Environment Directory Matrix

| Environment | Primary Purpose | Base URL | Database Tier | Redis Tier | Secret Store |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Development** | Local engineering | `http://localhost:3000` | Docker PostgreSQL 16 | Docker Redis 7 | `.env.local` |
| **QA / Testing** | Automated E2E & regression | `https://qa.agencyos.io` | Railway Managed DB | Railway Redis | GitHub Secrets |
| **Staging** | Pre-production validation | `https://staging.agencyos.io` | Amazon RDS Single-AZ | Amazon ElastiCache | AWS Secrets Manager |
| **Production** | Live tenant traffic | `https://agencyos.io` | Amazon RDS Multi-AZ | ElastiCache Cluster | AWS Secrets Manager |
