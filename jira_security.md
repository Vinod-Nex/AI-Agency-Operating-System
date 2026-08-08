# Jira Integration Security Architecture & Compliance Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the security controls, OAuth 2.0 3LO token vault protection, AES-256-GCM encryption, KMS secret management, webhook HMAC verification, RBAC mapping, and multi-tenant isolation standards for Jira Cloud integration.

---

## 2. Security Architecture Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      JIRA INTEGRATION SECURITY VAULT                    │
├─────────────────────────────────────────────────────────────────────────┤
│ • Token Encryption: AES-256-GCM with dynamic GCM Tag & unique IV per row│
│ • Key Management: Master Key stored in AWS KMS / Railway Encrypted Env. │
│ • OAuth Authorization: PKCE (Proof Key for Code Exchange) enabled.       │
│ • Tenant Isolation: Multi-tenant database rows partitioned by org_id.  │
│ • Signature Validation: HMAC SHA-256 signature verification on Webhooks.  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. RBAC Permission Mapping Matrix

AgencyOS maps local application roles to Jira REST API execution privileges:

| AgencyOS Role | Connect / Disconnect Site | Create Epics & Backlog | Update Issue Status | Add Comments | View Jira Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Organization Admin** | Full Allowed | Full Allowed | Full Allowed | Full Allowed | Full Allowed |
| **Workspace Admin** | Denied | Full Allowed | Full Allowed | Full Allowed | Full Allowed |
| **Project Manager** | Denied | Full Allowed | Full Allowed | Full Allowed | Full Allowed |
| **Developer** | Denied | Denied (Stories Only)| Full Allowed | Full Allowed | Full Allowed |
| **Viewer** | Denied | Denied | Denied | Denied | Read-Only |

---

## 4. Key Security Mechanisms

1. **AES-256-GCM Token Encryption**: Raw OAuth Access and Refresh Tokens are encrypted in memory before insertion into `jira_tokens`. Plaintext tokens are never written to disk or printed in application logs.
2. **PII Protection & Data Scrubbing**: User email addresses fetched from Atlassian Accounts are masked in application telemetry logs.
3. **Audit Logging**: All site connection changes, token refreshes, issue creations, and administrative disconnects are logged to `jira_audit_logs` with actor UUID and timestamp.
