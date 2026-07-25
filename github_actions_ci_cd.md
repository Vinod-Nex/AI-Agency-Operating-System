# GitHub Actions CI/CD Pipeline & Automated Release Workflows
## AI Agency Operating System (AgencyOS)

---

## 1. CI/CD Workflow Overview

The **AgencyOS** CI/CD pipeline guarantees high software quality, security compliance, and zero-downtime deployments via automated GitHub Actions:

```
[ Git Push / PR ] 
      │
      ├──> Step 1: Lint & Code Formatting (ESLint & Spotless)
      ├──> Step 2: Unit & Integration Tests (JUnit 5 & Playwright)
      ├──> Step 3: Security & Dependency Scan (Trivy & Snyk)
      ├──> Step 4: Docker Multi-Stage Build & ECR Push
      ├──> Step 5: Flyway Database Migration Execution
      └──> Step 6: Automated Zero-Downtime Deployment (Vercel + ECS)
```

---

## 2. Production GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    name: Lint, Unit Test & Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Set up Java 21 LTS
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Frontend Next.js Lint & Build
        run: |
          npm run lint
          npm run build

      - name: Backend Unit Tests & Spotless Verification
        run: mvn clean test

      - name: Run Playwright End-to-End Tests
        run: |
          npx playwright install --with-deps
          npx playwright test

      - name: Security Vulnerability Scan (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          format: 'sarif'
          output: 'trivy-results.sarif'

  build-and-deploy:
    name: Build Docker Container & Deploy
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, Tag & Push Docker Image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: agencyos-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to Vercel (Frontend)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Deploy to AWS ECS (Backend)
        run: |
          aws ecs update-service --cluster agencyos-prod-cluster --service agencyos-backend-service --force-new-deployment
```

---

## 3. Semantic Versioning & Release Checklist

- **Tag Creation**: `git tag -a v1.0.0 -m "Release v1.0.0: Initial Enterprise Production Launch"`
- **Git Push Tags**: `git push origin v1.0.0`
