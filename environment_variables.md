# Environment Variables & Configuration Inventory
## AI Agency Operating System (AgencyOS)

---

## 1. Environment Variable Directory Matrix

| Variable Name | Component | Dev Value | QA Value | Staging Value | Production Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8080/api/v1` | `https://qa-api.agencyos.io/api/v1` | `https://staging-api.agencyos.io/api/v1` | `https://api.agencyos.io/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Frontend | `http://localhost:3000` | `https://qa.agencyos.io` | `https://staging.agencyos.io` | `https://agencyos.io` |
| `NEXT_PUBLIC_ENV` | Frontend | `development` | `qa` | `staging` | `production` |
| `DATABASE_URL` | Backend | `jdbc:postgresql://localhost:5432/agencyos` | `jdbc:postgresql://qa-db.agencyos.io:5432/agencyos` | `jdbc:postgresql://staging-db.agencyos.io:5432/agencyos` | `jdbc:postgresql://prod-db.agencyos.io:5432/agencyos?sslmode=require` |
| `REDIS_URL` | Backend | `redis://localhost:6379` | `redis://qa-redis.agencyos.io:6379` | `redis://staging-redis.agencyos.io:6379` | `rediss://prod-redis.agencyos.io:6379` |
| `JWT_SECRET` | Backend | `dev_jwt_secret_32_chars_long_123` | `qa_jwt_secret_32_chars_long_123` | `[AWS_SECRETS_MANAGER]` | `[AWS_SECRETS_MANAGER]` |
| `JWT_REFRESH_SECRET` | Backend | `dev_refresh_secret_32_chars_long` | `qa_refresh_secret_32_chars_long` | `[AWS_SECRETS_MANAGER]` | `[AWS_SECRETS_MANAGER]` |
| `OPENAI_API_KEY` | Backend | `sk-proj-dev...` | `sk-proj-qa...` | `[AWS_SECRETS_MANAGER]` | `[AWS_SECRETS_MANAGER]` |
| `ANTHROPIC_API_KEY` | Backend | `sk-ant-dev...` | `sk-ant-qa...` | `[AWS_SECRETS_MANAGER]` | `[AWS_SECRETS_MANAGER]` |
| `GEMINI_API_KEY` | Backend | `AIzaSyDev...` | `AIzaSyQA...` | `[AWS_SECRETS_MANAGER]` | `[AWS_SECRETS_MANAGER]` |
| `STRIPE_SECRET_KEY` | Backend | `sk_test_...` | `sk_test_...` | `sk_test_...` | `sk_live_...` |
| `AWS_S3_BUCKET` | Backend | `agencyos-dev-s3` | `agencyos-qa-s3` | `agencyos-staging-s3` | `agencyos-prod-s3` |
