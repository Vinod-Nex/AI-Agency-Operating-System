# Jira Integration Operational Runbook & SOPs
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides step-by-step Standard Operating Procedures (SOPs) for On-call SREs, Integration Engineers, and Support Leads to triage and resolve Jira Cloud integration outages, token refresh failures, webhook drops, and sync state desynchronizations.

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Triage & Recover Invalid/Expired Jira OAuth Tokens
- **Symptom**: Alert `JiraOAuthTokenRefreshFailed` or users report HTTP 401 Unauthorized errors during Jira sync.
- **Root Cause**: Refresh token expired (inactive for > 90 days) or token rotation out of sync due to concurrent refreshes.
- **Resolution Procedure**:
  1. Locate connection ID from database:
     ```sql
     SELECT c.id, c.site_url, c.status, t.expires_at 
     FROM jira_connections c 
     JOIN jira_tokens t ON c.id = t.connection_id 
     WHERE c.status = 'ERROR' OR t.expires_at < NOW();
     ```
  2. Attempt administrative force-refresh via API:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/admin/jira/connections/{id}/refresh \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN"
     ```
  3. If response returns `invalid_grant`, notify Organization Admin to re-authenticate via UI (`/settings/integrations/jira`).

---

### SOP-02: Replay Failed Atlassian Webhooks
- **Symptom**: Issues updated in Jira Cloud are not reflecting in AgencyOS project dashboards.
- **Root Cause**: Webhook payload execution failed (`status = 'FAILED'` in `jira_sync_jobs`).
- **Resolution Procedure**:
  1. Query failed jobs:
     ```sql
     SELECT id, connection_id, job_type, error_summary 
     FROM jira_sync_jobs 
     WHERE status = 'FAILED' ORDER BY started_at DESC LIMIT 10;
     ```
  2. Inspect detailed error stack trace in Grafana Loki: `{app="agencyos-backend"} |= "JIRA_WEBHOOK_FAILURE"`
  3. Trigger job replay API:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/admin/jira/sync-jobs/{job_id}/replay \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN"
     ```

---

### SOP-03: Execute Project Delta Sync Repair
- **Symptom**: Issue status in AgencyOS differs from Jira Cloud status due to missed webhook.
- **Resolution Procedure**:
  1. Execute a targeted Delta Sync for the project:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/integrations/jira/projects/AGENCY/sync \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{"sync_mode":"DELTA"}'
     ```
  2. Verify updated timestamp and state in `jira_issues` table.

---

### SOP-04: Triage Atlassian REST API Rate Limiting (HTTP 429)
- **Symptom**: Alert `JiraRateLimitExceededSpike` triggers PagerDuty P2.
- **Resolution Procedure**:
  1. Open Grafana Jira Dashboard -> Inspect `jira_rate_limit_hits_total` graph.
  2. Verify `Resilience4j` rate-limiter circuit breaker status:
     ```bash
     curl https://api.agencyos.ai/actuator/health/readiness
     ```
  3. Temporarily increase background sync job interval from 15m to 60m via Spring Actuator environment update.
