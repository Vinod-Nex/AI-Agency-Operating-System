# Multi-Cloud Deployment Pipeline Specification (`deployment-pipeline.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Strategy

```
[ GitHub Main Release Tag ]
           │
           ├──> Deploy Frontend: Vercel Production Environment
           │
           └──> Deploy Backend: AWS ECS Fargate / Railway Production
```

### Option A Deployment (Railway Backend + Vercel Frontend)
- **Frontend**: Triggered via `vercel --prod` CLI token.
- **Backend**: Container build auto-triggered on Railway via webhook or GitHub integration.

### Option B Deployment (AWS ECS Fargate + Vercel Frontend)
- **Frontend**: Triggered via `vercel --prod` CLI token.
- **Backend**: Docker image built and pushed to Amazon ECR, followed by `aws ecs update-service --force-new-deployment`.
