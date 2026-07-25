# CI/CD Deployment Pipelines & Release Automation
## AI Agency Operating System (AgencyOS)

---

## 1. Automated Release Pipeline Architecture

```
[ Git Push / PR ]
       │
       ├──> 1. ESLint & Spotless Format Check
       ├──> 2. JUnit 5 Backend Unit & Integration Tests
       ├──> 3. Playwright Frontend E2E Test Suite
       ├──> 4. Trivy Container & Snyk Vulnerability Scans
       ├──> 5. Docker Multi-Stage Build & Push to Amazon ECR
       ├──> 6. Flyway DB Schema Migration Execution
       └──> 7. Zero-Downtime Deployment (Vercel & AWS ECS)
```

---

## 2. GitHub Actions Production Workflow (`.github/workflows/deploy-production.yml`)

```yaml
name: Deploy Production Platform

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  validate-and-deploy:
    name: Production Release Workflow
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Set up Java 21 LTS & Node.js 20
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Run Backend Tests & Flyway Validation
        run: mvn clean test flyway:validate

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build & Push Docker Container to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: agencyos-backend
          IMAGE_TAG: ${{ github.ref_name }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Trigger AWS ECS Fargate Rolling Update
        run: |
          aws ecs update-service --cluster agencyos-prod-cluster --service agencyos-backend-service --force-new-deployment
```
