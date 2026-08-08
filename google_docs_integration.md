# Enterprise Google Docs API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the Google Docs v1 API integration for automated AI proposal document generation, SOW compiling, contract drafting, inline template variable replacements, and collaborative inline comments.

---

## 2. Google Docs Generation & BatchUpdate Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Agency PM
    participant API as Spring Boot Backend
    participant DocsAPI as Google Docs API v1
    participant DriveAPI as Google Drive API v3

    Admin->>API: POST /api/v1/integrations/google/docs/generate-proposal
    
    API->>DriveAPI: Copy Template Doc ("AgencyOS Proposal Master Template")
    DriveAPI-->>API: Return New Document ID ("doc_abc123")
    
    API->>DocsAPI: POST /v1/documents/doc_abc123:batchUpdate
    Note over API,DocsAPI: Batch Requests: Replace {{client_name}}, Insert Tables, Format Headers
    
    DocsAPI-->>API: Return Updated Document Metadata
    API-->>Admin: Return Live Google Doc Link (https://docs.google.com/document/d/doc_abc123/edit)
```

---

## 3. BatchUpdate Requests Specification (`documents.batchUpdate`)

To modify a Google Doc atomically without multiple HTTP network calls, AgencyOS sends a array of `Request` objects:

```json
{
  "requests": [
    {
      "replaceAllText": {
        "containsText": { "text": "{{client_name}}", "matchCase": true },
        "replaceText": "Acme Corporation"
      }
    },
    {
      "replaceAllText": {
        "containsText": { "text": "{{total_budget}}", "matchCase": true },
        "replaceText": "$75,000.00 USD"
      }
    }
  ]
}
```
