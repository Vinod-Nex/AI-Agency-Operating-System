# Master Enterprise CI/CD Pipeline Architecture & Implementation Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Executive Summary & DevSecOps Architecture

The **AI Agency Operating System (AgencyOS)** relies on an enterprise-grade, fully automated **GitHub Actions CI/CD Pipeline** designed around the **GitHub Flow** branching model.

```mermaid
graph TD
    Developer[Developer Push / PR] -->|Trigger| GitHubActions[GitHub Actions Runner]
    
    subgraph CI Phase [Continuous Integration]
        GitHubActions --> Lint[1. ESLint & Spotless Format]
        GitHubActions --> Unit[2. JUnit 5 & Jest Unit Tests]
        GitHubActions --> Security[3. Trivy & Snyk Vulnerability Scans]
        GitHubActions --> E2E[4. Playwright E2E Test Suite]
    end

    subgraph Build Phase [Container & Artifact Build]
        CI Phase --> DockerBuild[5. Multi-Stage Docker Build & ECR Push]
        CI Phase --> FlywayValidate[6. Flyway DB Migration Dry-Run]
    end

    subgraph CD Phase [Continuous Deployment]
        Build Phase --> VercelDeploy[7. Vercel Frontend Deployment]
        Build Phase --> ECSDeploy[8. AWS ECS Fargate / Railway Backend Update]
    end

    CD Phase --> SmokeTest[9. Automated Post-Deploy Smoke Tests]
```

---

## 2. GitHub Flow Branching & Merge Strategy

- **`main`**: Production-ready branch. Direct commits disabled. Requires 2 peer PR approvals, passing status checks, and linear git history.
- **`develop`**: Integration branch for staging deployments.
- **`feature/*`**: Feature development branches created off `develop` or `main`.
- **`bugfix/*` / `hotfix/*`**: Emergency patch branches for staging and production.

### Branch Protection Rules Matrix
- Require signed commits (GPG).
- Require linear history (Rebase or Squash merge).
- Require all status checks to pass before merging:
  - `lint-and-typecheck`
  - `unit-and-integration-tests`
  - `playwright-e2e-tests`
  - `security-vulnerability-scan`
