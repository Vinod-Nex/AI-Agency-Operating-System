# AI Gateway Production Deployment & Configuration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides environment variable placeholder specifications, secrets management architecture, pre-launch production checklists, health check endpoint probes, and rollback strategies for OpenAI and Google Gemini integrations.

---

## 2. Environment Variables Matrix (Placeholders Only)

| Variable Name | Required Scope | Secret / Public | Placeholder Configuration Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | Spring Boot Backend | Secret | `OPENAI_API_KEY=<stored securely>` | OpenAI API Secret Key |
| `GEMINI_API_KEY` | Spring Boot Backend | Secret | `GEMINI_API_KEY=<stored securely>` | Google Gemini API Secret Key |
| `OPENAI_BASE_URL` | Spring Boot Backend | Configuration | `OPENAI_BASE_URL=https://api.openai.com/v1` | OpenAI API Base Endpoint |
| `OPENAI_MODEL` | Spring Boot Backend | Configuration | `OPENAI_MODEL=gpt-4o` | Default OpenAI Model Name |
| `GEMINI_MODEL` | Spring Boot Backend | Configuration | `GEMINI_MODEL=gemini-1.5-pro` | Default Gemini Model Name |
| `LLM_PROVIDER` | Spring Boot Backend | Configuration | `LLM_PROVIDER=OPENAI` | Default Primary LLM Provider |
| `MAX_TOKENS` | Spring Boot Backend | Configuration | `MAX_TOKENS=4096` | Max Completion Tokens Limit |
| `TEMPERATURE` | Spring Boot Backend | Configuration | `TEMPERATURE=0.7` | Model Sampling Temperature |
| `TOP_P` | Spring Boot Backend | Configuration | `TOP_P=0.95` | Nucleus Sampling Parameter |
| `TIMEOUT` | Spring Boot Backend | Configuration | `TIMEOUT=10000` | HTTP Request Timeout (ms) |
| `RETRY_COUNT` | Spring Boot Backend | Configuration | `RETRY_COUNT=3` | Max Exponential Retry Count |

---

## 3. Production Go-Live Checklist

1. [ ] **Verify API Key Storage**: Confirm `OPENAI_API_KEY` and `GEMINI_API_KEY` are provisioned in AWS Secrets Manager or Railway Encrypted Variables.
2. [ ] **Verify Database Migrations**: Confirm Flyway script `V6__ai_infrastructure_schema.sql` executed cleanly.
3. [ ] **Verify Redis Vector Search**: Confirm RedisSearch index `idx:vector:chunks` is created for document RAG.
4. [ ] **Test Provider Connectivity**: Execute `/actuator/health/readiness` and verify OpenAI & Gemini health probes return `UP`.
5. [ ] **Test Synthetic Fallback**: Inject HTTP 500 on OpenAI mock endpoint and verify fallback switch to Gemini in < 1,500ms.
6. [ ] **Verify Token Budget Guards**: Confirm monthly organization budget limit enforcement is active.

---

## 4. Emergency Rollback Strategy

1. **Provider Hot-Swap**: Switch primary provider from OpenAI to Gemini via Spring Actuator POST request without container restarts:
   ```bash
   curl -X POST https://api.agencyos.ai/actuator/env \
        -H "Content-Type: application/json" \
        -d '{"name":"LLM_PROVIDER","value":"GEMINI"}'
   ```
2. **Container Image Rollback**: Revert Railway / AWS ECS container image tag to previous stable build.
3. **Database Guard**: Schema migrations preserve token audit tables to maintain billing data integrity during rollbacks.
