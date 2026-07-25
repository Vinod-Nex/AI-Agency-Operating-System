# GitHub Secrets & Secrets Management Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Complete GitHub Secrets Directory

| Secret Name | Usage Scope | Rotation Schedule |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | ECR Login & ECS Fargate deployment | 90 Days |
| `AWS_SECRET_ACCESS_KEY` | ECR Login & ECS Fargate deployment | 90 Days |
| `VERCEL_TOKEN` | Vercel CLI production deployment | 90 Days |
| `VERCEL_ORG_ID` | Vercel Organization Identifier | Static |
| `VERCEL_PROJECT_ID` | Vercel Project Identifier | Static |
| `SNYK_TOKEN` | Dependency vulnerability scanning | 90 Days |
| `SLACK_WEBHOOK_URL` | CI/CD build failure notifications | 180 Days |
