# Google Workspace Production Deployment Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides environment variable placeholder specifications, Google Cloud Console setup steps, pre-launch production checklists, and emergency rollback strategies for launching Google Workspace integrations.

---

## 2. Environment Variables Matrix (Placeholders Only)

| Variable Name | Required Scope | Secret / Public | Placeholder Configuration Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | Spring Boot / Next.js | Public Configuration | `GOOGLE_CLIENT_ID=<stored securely>` | Google Cloud OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Spring Boot Backend | Secret | `GOOGLE_CLIENT_SECRET=<stored securely>` | Google Cloud OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | Spring Boot / Next.js | Public Configuration | `GOOGLE_REDIRECT_URI=https://app.agencyos.ai/settings/integrations/google/callback` | OAuth Callback Redirect URI |
| `GOOGLE_PUBSUB_TOPIC` | Spring Boot Backend | Configuration | `GOOGLE_PUBSUB_TOPIC=projects/agencyos/topics/workspace-watch` | Google Cloud Pub/Sub Topic |
| `GOOGLE_SA_KEY_JSON` | Spring Boot Backend | Secret | `GOOGLE_SA_KEY_JSON=<stored securely>` | Service Account Key JSON |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Spring Boot Backend | Secret | `GOOGLE_TOKEN_ENCRYPTION_KEY=<stored securely>` | AES-256 Key for Token Vault |

---

## 3. Production Go-Live Checklist

1. [ ] **Verify Google Cloud OAuth Screen Verification**: Confirm OAuth consent screen is verified and publish status is `In Production`.
2. [ ] **Verify Database Migration**: Confirm Flyway script `V7__google_workspace_schema.sql` executed cleanly.
3. [ ] **Verify Domain-Wide Delegation**: Confirm Service Account Client ID is authorized in Google Workspace Admin Console.
4. [ ] **Test Live OAuth Connection**: Complete an OAuth PKCE flow using a production Google Workspace user account.
5. [ ] **Test Document Generation**: Generate a test Google Doc proposal and verify creation in Google Drive.
6. [ ] **Verify Pub/Sub Push Webhooks**: Confirm push notification endpoint receives and acknowledges watch events.

---

## 4. Rollback Strategy

1. **Feature Flag Disablement**: Set `INTEGRATION_GOOGLE_WORKSPACE_ENABLED=false` via Spring Boot Actuator to disable Google UI integration buttons.
2. **Backend Service Rollback**: Revert Railway / AWS ECS container image tag to previous stable build.
3. **Database Guard**: Schema migrations preserve token records and file mapping metadata during rollbacks.
