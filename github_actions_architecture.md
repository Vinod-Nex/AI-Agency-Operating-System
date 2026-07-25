# GitHub Actions Workflow Architecture & Runner Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Workflow Architecture & Reusable Actions

GitHub Actions workflows in **AgencyOS** are modularized into atomic, reusable workflow components:

```
.github/
└── workflows/
    ├── frontend-ci.yml        # Next.js 15 Lint, TypeCheck, Jest, Playwright
    ├── backend-ci.yml         # Spring Boot Maven Compile, JUnit 5, JaCoCo
    ├── database-ci.yml        # Flyway Dry-Run & Schema Drift Detection
    ├── security-pipeline.yml  # Snyk, CodeQL SAST, Trivy Container Scan
    ├── deploy-production.yml  # Vercel & AWS ECS Production Deploy
    └── rollback.yml           # Automated Rollback Trigger
```

---

## 2. Least-Privilege GitHub Token Permissions

```yaml
permissions:
  contents: read
  id-token: write      # Required for AWS OIDC authentication
  packages: read
  security-events: write # Required for CodeQL SARIF uploads
```
