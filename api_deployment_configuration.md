# API Deployment & Infrastructure Configuration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Base URL Environments

| Environment | Base URL | Deployment Target | CORS Whitelist |
| :--- | :--- | :--- | :--- |
| **Production** | `https://api.agencyos.io/api/v1` | AWS ECS Fargate / Railway | `https://agencyos.io` |
| **Staging** | `https://staging-api.agencyos.io/api/v1` | AWS ECS / Railway Staging | `https://staging.agencyos.io` |
| **Local Sandbox** | `http://localhost:8080/api/v1` | Local Docker Compose | `http://localhost:3000` |

---

## 2. Feature Flags Inventory (`Unleash` / `LaunchDarkly`)

| Feature Flag Key | Description | Default State |
| :--- | :--- | :---: |
| `feature_byok_ai_routing` | Enables Bring Your Own Key AI configuration | Enabled |
| `feature_jira_sprint_sync` | Enables real-time Atlassian Cloud Jira sync | Enabled |
| `feature_stripe_invoicing` | Enables Stripe payment checkout links | Enabled |
