# Enterprise Google Workspace Database Schema
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document defines the relational PostgreSQL database schema (`V7__google_workspace_schema.sql`) for managing multi-tenant Google accounts, OAuth token vaults, Gmail sync state, Calendar events, Drive files, Docs/Sheets/Slides mappings, Contacts, Tasks, Forms, Admin Directory users/groups, sync jobs, webhooks, and audit logs.

---

## 2. PostgreSQL DDL Schema Definitions (17 Tables)

```sql
-- 1. Google Accounts Table
CREATE TABLE google_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    hd VARCHAR(255), -- Hosted Domain (e.g. agency.com)
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(org_id, google_user_id)
);

-- 2. OAuth Tokens Vault (AES-256-GCM)
CREATE TABLE oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_account_id UUID NOT NULL UNIQUE REFERENCES google_accounts(id) ON DELETE CASCADE,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT NOT NULL,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    scopes TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gmail Sync Table
CREATE TABLE gmail_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_account_id UUID NOT NULL REFERENCES google_accounts(id) ON DELETE CASCADE,
    history_id VARCHAR(255),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Calendar Events Table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_account_id UUID NOT NULL REFERENCES google_accounts(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_zone VARCHAR(100) NOT NULL,
    meet_link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Meetings Metadata Table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    transcript_url VARCHAR(500),
    recording_url VARCHAR(500),
    action_items_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Drive Files Table
CREATE TABLE drive_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_file_id VARCHAR(255) NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    parent_folder_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Google Docs Mappings Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_file_id UUID REFERENCES drive_files(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL, -- PROPOSAL, SOW, CONTRACT
    agencyos_entity_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Google Sheets Mappings Table
CREATE TABLE sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_file_id UUID REFERENCES drive_files(id) ON DELETE CASCADE,
    sheet_type VARCHAR(50) NOT NULL, -- INVOICE_LEDGER, FINANCIAL_REPORT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Google Slides Mappings Table
CREATE TABLE slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_file_id UUID REFERENCES drive_files(id) ON DELETE CASCADE,
    presentation_type VARCHAR(50) NOT NULL, -- PITCH_DECK, EXECUTIVE_REVIEW
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Google Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_resource_name VARCHAR(255) NOT NULL UNIQUE,
    given_name VARCHAR(255),
    family_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(100),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Google Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_task_id VARCHAR(255) NOT NULL UNIQUE,
    task_list_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Google Forms Table
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_form_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    form_type VARCHAR(50) NOT NULL, -- LEAD_CAPTURE, FEEDBACK
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Workspace Users Directory Table
CREATE TABLE workspace_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    primary_email VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Workspace Groups Directory Table
CREATE TABLE workspace_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    google_group_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Workspace Sync Jobs Ledger
CREATE TABLE sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_name VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- FULL, DELTA
    status VARCHAR(50) NOT NULL,
    error_summary TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 16. Webhook Events Table (Idempotency Engine)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_channel_id VARCHAR(255) NOT NULL UNIQUE,
    service_name VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Workspace Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
