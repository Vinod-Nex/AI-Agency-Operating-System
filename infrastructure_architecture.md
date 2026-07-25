# Enterprise Infrastructure Architecture & Multi-Environment Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Multi-Environment Overview

**AgencyOS** operates across four isolated deployment environments:

```
[ Development (Local Docker) ] ──> [ Testing / QA (Railway QA) ] ──> [ Staging (AWS Pre-Prod) ] ──> [ Production (AWS Multi-AZ) ]
```

| Environment | Purpose | Target URL | Database Strategy | Redis Strategy | Secrets Management |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Development** | Local feature iteration | `http://localhost:3000` | Local Docker PostgreSQL 16 | Local Docker Redis 7 | `.env.local` |
| **Testing / QA** | Automated E2E & QA testing | `https://qa.agencyos.io` | Railway Managed PostgreSQL | Railway Redis | GitHub Secrets |
| **Staging** | Pre-production validation | `https://staging.agencyos.io` | Amazon RDS Single-AZ | Amazon ElastiCache | AWS Secrets Manager |
| **Production** | Live SaaS platform | `https://agencyos.io` | Amazon RDS Multi-AZ | ElastiCache Cluster | AWS Secrets Manager |

---

## 2. Infrastructure as Code (Terraform Setup)

All AWS production infrastructure is declared as code using Terraform:
- State Backend: Amazon S3 (`agencyos-tf-state-bucket`) with DynamoDB state locking.
- Modules: `vpc`, `ecs_fargate`, `rds_postgres`, `elasticache_redis`, `s3_storage`, `cloudfront`.
