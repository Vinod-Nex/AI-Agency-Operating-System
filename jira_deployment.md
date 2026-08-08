# Jira Integration Production Deployment Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides environment variable specifications, Atlassian Developer Console configuration steps, pre-launch checklists, go-live checklists, and rollback strategies for launching the Jira Cloud integration.

---

## 2. Environment Variables Matrix

| Variable Name | Required Scope | Secret / Public | Description / Format |
| :--- | :--- | :--- | :--- |
| `JIRA_CLIENT_ID` | Spring Boot / Next.js | Public Configuration | Atlassian OAuth 2.0 App Client ID |
| `JIRA_CLIENT_SECRET` | Spring Boot Backend | Secret | Atlassian OAuth 2.0 App Client Secret |
| `JIRA_REDIRECT_URI` | Spring Boot / Next.js | Public Configuration | `https://app.agencyos.ai/settings/integrations/jira/callback` |
| `JIRA_WEBHOOK_SECRET` | Spring Boot Backend | Secret | HMAC Signing Secret for Ingress Webhooks |
| `JIRA_TOKEN_ENCRYPTION_KEY` | Spring Boot Backend | Secret | 256-bit AES Key for Token Vault (`AES-256-GCM`) |

---

## 3. Atlassian Developer Console Setup Checklist

1. [ ] Log in to [developer.atlassian.com](https://developer.atlassian.com/console/myapps/).
2. [ ] Create a new **OAuth 2.0 (3LO) Integration App** named `AI Agency Operating System`.
3. [ ] Configure Authorization Redirect URI: `https://app.agencyos.ai/settings/integrations/jira/callback`.
4. [ ] Enable Permissions / Scopes: `read:jira-work`, `write:jira-work`, `read:jira-user`, `manage:jira-configuration`, `offline_access`.
5. [ ] Copy **Client ID** and **Client Secret** into AWS Secrets Manager / Railway Environment Variables.

---

## 4. Production Go-Live Checklist

1. [ ] **Verify Database Migration**: Confirm Flyway script `V5__jira_integration_schema.sql` executed cleanly.
2. [ ] **Verify Encryption Vault Key**: Confirm `JIRA_TOKEN_ENCRYPTION_KEY` is loaded in AWS KMS / Railway.
3. [ ] **Verify Callback Route**: Confirm Next.js `/settings/integrations/jira/callback` route renders the loading state.
4. [ ] **Execute Live Test Connection**: Complete an OAuth 3LO authorization flow using a test Atlassian site.
5. [ ] **Test Issue Creation**: Generate a test story from AgencyOS and verify creation in Jira Cloud.
6. [ ] **Test Webhook Listener**: Edit an issue summary in Jira and verify real-time update in AgencyOS within 2 seconds.

---

## 5. Rollback Strategy

1. **Feature Flag Disablement**: Set `INTEGRATION_JIRA_ENABLED=false` in Spring Boot configuration to hide UI buttons and reject new API calls.
2. **Backend Service Rollback**: Revert Railway / AWS ECS Fargate container image tag to previous stable build.
3. **Database Schema Integrity**: Migration scripts preserve soft-deletions on `jira_connections` to prevent data loss.
