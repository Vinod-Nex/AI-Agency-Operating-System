# Enterprise Google Workspace Admin SDK Directory Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details the Google Workspace Admin SDK Directory API v1 integration for organization directory synchronization, user provision/deprovision tracking, Google Groups management, and Service Account Domain-wide Delegation.

---

## 2. Service Account Domain-Wide Delegation Setup

To manage domain directory users and groups without requiring individual user interactive logins:

1. **Create Service Account**: In Google Cloud Console, provision service account `agencyos-admin-sa@project-id.iam.gserviceaccount.com`.
2. **Enable Domain-Wide Delegation**: Check "Enable Google Workspace Domain-wide Delegation". Copy Service Account **Client ID**.
3. **Grant Scopes in Admin Console**: In Google Workspace Admin Console (`admin.google.com`) -> Security -> API Controls -> Domain-wide Delegation -> Add Client ID with Scopes:
   - `https://www.googleapis.com/auth/admin.directory.user.readonly`
   - `https://www.googleapis.com/auth/admin.directory.group.readonly`
