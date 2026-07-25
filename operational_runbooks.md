# SRE Operational Runbooks Catalog
## AI Agency Operating System (AgencyOS)

---

## 1. Catalog of Operational Incident Runbooks

### Runbook 1: Total API Outage (HTTP 502 / 503)
1. **Check ECS Fargate Status**: `aws ecs describe-services --cluster agencyos-prod-cluster --services agencyos-backend-service`
2. **Inspect Application Logs**: `loki-cli query '{service="agencyos-backend-api"} |= "ERROR"' --limit 50`
3. **Restart ECS Tasks**: If OOM memory failure detected, execute `aws ecs update-service --force-new-deployment`.

### Runbook 2: Database Connection Exhaustion (HikariCP)
1. **Inspect Active Connections**: Query `hikaricp_connections_active`.
2. **Kill Idle DB Locks**: Execute `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction'`.

### Runbook 3: AI Provider Outage & Failover
1. **Symptom**: Anthropic Claude API returning 503 / 429.
2. **Action**: The synthesis engine automatically shifts traffic to OpenAI GPT-4o. If manual intervention is required, update feature flag `override_ai_provider=OPENAI`.
