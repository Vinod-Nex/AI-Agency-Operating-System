# Google Cloud OAuth 2.0 & Token Vault Architecture Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies Google Cloud Project setup, OAuth 2.0 (3LO with PKCE) flow, consent screen verification, Service Account configuration, token refresh rotation, and AES-256-GCM encrypted token storage.

---

## 2. OAuth 2.0 PKCE Flow Sequence Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Agency Admin
    participant FE as Next.js 15 UI
    participant API as Spring Boot Backend
    participant DB as PostgreSQL Encrypted Vault
    participant Google as Google OAuth Server (accounts.google.com)

    Admin->>FE: Click "Connect Google Workspace"
    FE->>API: POST /api/v1/integrations/google/oauth/connect
    API->>API: Generate State Token & PKCE Code Verifier / Challenge (S256)
    API-->>FE: Return Authorization URL
    FE->>Google: Redirect to Google OAuth Consent Screen
    
    Admin->>Google: Authenticate & Grant Requested Scopes
    Google-->>FE: Redirect to /settings/integrations/google/callback?code=AUTH_CODE&state=STATE
    
    FE->>API: POST /api/v1/integrations/google/oauth/callback { code, state, code_verifier }
    API->>Google: POST https://oauth2.googleapis.com/token (Exchange Code + Code Verifier)
    Google-->>API: Return { access_token, refresh_token, expires_in, scope }
    
    API->>DB: Encrypt Tokens (AES-256 GCM) & Save in google_accounts / oauth_tokens
    API-->>FE: Return Connection Active Status
```

---

## 3. Least-Privilege Scope Matrix

| Google Workspace Service | Required OAuth Scope | Access Level Rationale |
| :--- | :--- | :--- |
| **Gmail** | `https://www.googleapis.com/auth/gmail.compose` | Create & manage email drafts |
| **Google Calendar** | `https://www.googleapis.com/auth/calendar.events` | Create & sync meeting events |
| **Google Drive** | `https://www.googleapis.com/auth/drive.file` | Per-file access created by AgencyOS |
| **Google Docs** | `https://www.googleapis.com/auth/documents` | Generate proposal/SOW docs |
| **Google Sheets** | `https://www.googleapis.com/auth/spreadsheets` | Export financial reports |
| **Google Slides** | `https://www.googleapis.com/auth/presentations` | Generate client pitch decks |
| **Google Tasks** | `https://www.googleapis.com/auth/tasks` | Action items synchronization |
