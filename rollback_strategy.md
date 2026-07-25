# Automated & Emergency Rollback Workflow Specification (`rollback.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Automated Incident Trigger & Rollback Workflow

```yaml
name: Rollback Pipeline

on:
  workflow_dispatch:
    inputs:
      target_environment:
        description: 'Environment to rollback'
        required: true
        default: 'production'

jobs:
  rollback-execution:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback Vercel Frontend
        run: vercel rollback --prod --token ${{ secrets.VERCEL_TOKEN }}

      - name: Rollback AWS ECS Fargate Backend
        run: |
          aws ecs update-service --cluster agencyos-prod-cluster --service agencyos-backend-service --task-definition agencyos-backend-task:PREVIOUS_REVISION --force-new-deployment
```
