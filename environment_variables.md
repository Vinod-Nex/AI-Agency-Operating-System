# Environment Variables & Configuration Inventory
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Security Policies

All sensitive credentials, API keys, database connection strings, and JWT signing keys in **AgencyOS** are strictly separated from source code using environment variables:
- **Production Secrets Store**: AWS Secrets Manager / Railway Environment Secrets.
- **Frontend Variables**: Prefixed with `NEXT_PUBLIC_` to expose to browser bundle.
- **Security Constraint**: Never commit `.env` or `.env.production` files to git.

---

## 2. Complete Environment Variable Inventory

### A. Next.js 15 Frontend Environment Variables (`.env.production`)

| Variable Name | Description | Default / Example Value | Exposed to Browser |
| :--- | :--- | :--- | :---: |
| `NEXT_PUBLIC_API_BASE_URL` | Base REST API URL for backend calls | `https://api.agencyos.io/api/v1` | Yes |
| `NEXT_PUBLIC_APP_URL` | Public web application URL | `https://agencyos.io` | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable API Key | `pk_live_51Nx...` | Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog Analytics Client Key | `phc_abc123...` | Yes |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog Host Domain | `https://app.posthog.com` | Yes |

---

### B. Spring Boot Backend Environment Variables (`application-prod.yml`)

| Variable Name | Description | Example / Required Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` |
| `PORT` | HTTP Server Listener Port | `8080` |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC Connection String | `jdbc:postgresql://db.agencyos.io:5432/agencyos?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | PostgreSQL DB Master Username | `agencyos_admin` |
| `SPRING_DATASOURCE_PASSWORD` | PostgreSQL DB Master Password | `[SECRETS_MANAGER]` |
| `SPRING_REDIS_HOST` | Redis Server Host | `redis.agencyos.io` |
| `SPRING_REDIS_PORT` | Redis Server Port | `6379` |
| `SPRING_REDIS_PASSWORD` | Redis Auth Password | `[SECRETS_MANAGER]` |
| `JWT_SECRET` | HMAC-SHA256 Secret Key (256+ bits) | `super_secret_jwt_key_minimum_256_bits_length_here_12345` |
| `JWT_ACCESS_EXPIRATION_MS` | Access Token Expiry in ms | `900000` (15 minutes) |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh Token Expiry in ms | `604800000` (7 days) |
| `ANTHROPIC_API_KEY` | Fallback Anthropic API Key | `sk-ant-api03-...` |
| `OPENAI_API_KEY` | Fallback OpenAI API Key | `sk-proj-...` |
| `GEMINI_API_KEY` | Fallback Google Gemini API Key | `AIzaSy...` |
| `AWS_S3_BUCKET` | AWS S3 Bucket Name for PDFs | `agencyos-contracts-prod` |
| `AWS_REGION` | AWS Region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS Service Account Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS Service Account Secret Key | `[SECRETS_MANAGER]` |
| `STRIPE_SECRET_KEY` | Stripe Secret API Key | `sk_live_51Nx...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signature Key | `whsec_abc123...` |
