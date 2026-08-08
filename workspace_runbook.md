# Google Workspace Operational Runbook & SOPs
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides step-by-step Standard Operating Procedures (SOPs) for On-call SREs, Integration Engineers, and Support Leads to triage and resolve Google Workspace integration outages, token refresh failures, Pub/Sub webhook drops, and domain-wide delegation issues.

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Triage & Recover Expired Google OAuth Tokens
- **Symptom**: Alert `GoogleOAuthTokenRefreshFailed` or users report HTTP 401 Unauthorized errors during Google Workspace operations.
- **Root Cause**: Refresh token revoked or user changed password.
- **Resolution Procedure**:
  1. Locate google account ID from database:
     ```sql
     SELECT a.id, a.email, a.status, t.expires_at 
     FROM google_accounts a 
     JOIN oauth_tokens t ON a.id = t.google_account_id 
     WHERE a.status = 'ERROR' OR t.expires_at < NOW();
     ```
  2. Attempt administrative force-refresh via API:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/admin/google/accounts/{id}/refresh \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN"
     ```
  3. If refresh fails with `invalid_grant`, notify user to re-authenticate via UI (`/settings/integrations/google`).

---

### SOP-02: Repair Service Account Domain-Wide Delegation
- **Symptom**: Admin SDK Directory API returns HTTP 403 `Not Authorized to Access This Domain`.
- **Resolution Procedure**:
  1. Open Google Workspace Admin Console (`admin.google.com`) -> Security -> API Controls -> Domain-wide Delegation.
  2. Verify Service Account Client ID is listed with scopes: `admin.directory.user.readonly`, `admin.directory.group.readonly`.
  3. If missing, re-add Client ID and scopes.
  4. Test delegation via backend health probe endpoint (`/actuator/health/readiness`).

---

### SOP-03: Replay Failed Google Cloud Pub/Sub Webhooks
- **Symptom**: New Gmail messages or Calendar events not reflecting in AgencyOS within 5 seconds.
- **Resolution Procedure**:
  1. Inspect failed webhook events:
     ```sql
     SELECT id, google_channel_id, service_name, status 
     FROM webhook_events 
     WHERE status = 'FAILED' ORDER BY created_at DESC LIMIT 10;
     ```
  2. Re-trigger full delta sync for affected account:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/integrations/google/sync/delta \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{"google_account_id":"acc_12345"}'
     ```
