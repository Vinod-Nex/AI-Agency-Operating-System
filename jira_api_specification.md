# Enterprise Jira REST API Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides the complete API specification for the AgencyOS Jira Cloud Integration Microservice. All endpoints require HTTPS, Bearer JWT authentication, and tenant organization scoping.

---

## 2. API Catalog & Endpoint Definitions

### 1. Connect Jira Site (Initiate OAuth 3LO Flow)
- **Endpoint**: `POST /api/v1/integrations/jira/connect`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "redirect_url": "https://app.agencyos.ai/settings/integrations/jira/callback"
}
```
- **Response Payload (200 OK)**:
```json
{
  "authorization_url": "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=JIRA_CLIENT_ID&scope=read%3Ajira-work%20write%3Ajira-work&redirect_uri=https%3A%2F%2Fapp.agencyos.ai%2Fsettings%2Fintegrations%2Fjira%2Fcallback&state=state_uuid_123&response_type=code&prompt=consent"
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden.

---

### 2. Disconnect Jira Site
- **Endpoint**: `POST /api/v1/integrations/jira/disconnect`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "jira_connection_id": "conn_99182371-2391-4a11-82bf-112233445566"
}
```
- **Response Payload (200 OK)**:
```json
{
  "status": "DISCONNECTED",
  "disconnected_at": "2026-07-25T21:50:00Z"
}
```

---

### 3. List Jira Projects
- **Endpoint**: `GET /api/v1/integrations/jira/projects`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Query Parameters**: `jira_connection_id` (UUID, required), `page` (int, default 1), `limit` (int, default 50)
- **Response Payload (200 OK)**:
```json
{
  "projects": [
    {
      "id": "10001",
      "key": "AGENCY",
      "name": "Agency Operating System",
      "project_type": "software",
      "avatar_url": "https://site.atlassian.net/avatar/10001"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 4. List Boards
- **Endpoint**: `GET /api/v1/integrations/jira/boards`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Query Parameters**: `jira_connection_id` (UUID), `project_key` (string)
- **Response Payload (200 OK)**:
```json
{
  "boards": [
    {
      "id": 42,
      "name": "AGENCY Board",
      "type": "scrum"
    }
  ]
}
```

---

### 5. List Sprints
- **Endpoint**: `GET /api/v1/integrations/jira/sprints`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Query Parameters**: `board_id` (long, required), `state` (`active` | `future` | `closed`)
- **Response Payload (200 OK)**:
```json
{
  "sprints": [
    {
      "id": 101,
      "name": "Sprint 24",
      "state": "active",
      "start_date": "2026-07-20T00:00:00Z",
      "end_date": "2026-08-03T00:00:00Z"
    }
  ]
}
```

---

### 6. Create Jira Epic
- **Endpoint**: `POST /api/v1/integrations/jira/epics`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_PROJECT_MANAGER`, `ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "jira_connection_id": "conn_99182371-2391-4a11-82bf-112233445566",
  "project_key": "AGENCY",
  "summary": "AI Proposal Engine Integration",
  "description": "Epic tracking end-to-end development of AI proposal generator.",
  "agencyos_proposal_id": "prop_88776655-4433"
}
```
- **Response Payload (201 Created)**:
```json
{
  "jira_issue_id": "10421",
  "jira_issue_key": "AGENCY-101",
  "self_url": "https://site.atlassian.net/browse/AGENCY-101"
}
```

---

### 7. Create Jira Story / Task / Bug
- **Endpoint**: `POST /api/v1/integrations/jira/issues`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_PROJECT_MANAGER`, `ROLE_DEVELOPER`)
- **Request Payload**:
```json
{
  "jira_connection_id": "conn_99182371-2391-4a11-82bf-112233445566",
  "project_key": "AGENCY",
  "issue_type": "Story", // Story | Task | Bug | Subtask
  "parent_issue_key": "AGENCY-101", // Epic or Parent Story Key
  "summary": "Implement Stripe Webhook Listener",
  "description_adf": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Implement HMAC signature validation." }]
      }
    ]
  },
  "story_points": 5,
  "assignee_account_id": "5b10ac8d82e05b22cc7d4ef5",
  "labels": ["ai-generated", "backend", "billing"]
}
```
- **Response Payload (201 Created)**:
```json
{
  "jira_issue_id": "10422",
  "jira_issue_key": "AGENCY-102",
  "status": "To Do"
}
```

---

### 8. Transition Issue Workflow State
- **Endpoint**: `POST /api/v1/integrations/jira/issues/{issue_key}/transitions`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "transition_id": "31", // e.g. 31 = "In Progress", 41 = "Done"
  "comment": "Work started automatically via AgencyOS workflow."
}
```
- **Response Payload (200 OK)**:
```json
{
  "jira_issue_key": "AGENCY-102",
  "new_status": "In Progress"
}
```

---

### 9. Add Comment to Issue
- **Endpoint**: `POST /api/v1/integrations/jira/issues/{issue_key}/comments`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "comment_text": "Meeting Action Item: Client approved contract terms on 2026-07-25."
}
```
- **Response Payload (201 Created)**:
```json
{
  "comment_id": "10052",
  "created_at": "2026-07-25T21:52:00Z"
}
```

---

### 10. Search Issues (JQL API)
- **Endpoint**: `POST /api/v1/integrations/jira/search`
- **Method**: `POST`
- **Auth**: Bearer JWT
- **Request Payload**:
```json
{
  "jira_connection_id": "conn_99182371-2391-4a11-82bf-112233445566",
  "jql": "project = AGENCY AND status = 'In Progress' ORDER BY updated DESC",
  "max_results": 50,
  "start_at": 0
}
```
- **Response Payload (200 OK)**:
```json
{
  "issues": [
    {
      "key": "AGENCY-102",
      "summary": "Implement Stripe Webhook Listener",
      "status": "In Progress",
      "assignee": "Jane Doe"
    }
  ],
  "total": 1
}
```

---

### 11. Trigger Manual Project Synchronization
- **Endpoint**: `POST /api/v1/integrations/jira/projects/{project_key}/sync`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`, `ROLE_PROJECT_MANAGER`)
- **Request Payload**:
```json
{
  "sync_mode": "FULL" // FULL | DELTA
}
```
- **Response Payload (202 Accepted)**:
```json
{
  "sync_job_id": "job_77112233-4455-6677",
  "status": "IN_PROGRESS"
}
```
