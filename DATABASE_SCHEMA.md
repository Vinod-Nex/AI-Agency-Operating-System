# Enterprise PostgreSQL 16 Database Schema Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Executive Summary & Design Principles

The **AI Agency Operating System** uses **PostgreSQL 16** as its primary transactional store.
The schema adheres to the following strict database design standards:
1. **Multi-Tenancy Isolation**: Shared database, separate schema or strict `organization_id` foreign key scoping across all tenant tables.
2. **Primary Key Strategy**: All primary keys use `UUID v4` (`gen_random_uuid()`) to prevent enumeration attacks and support distributed ID generation.
3. **Auditability**: Every table includes standard audit columns (`created_at`, `created_by`, `updated_at`, `updated_by`).
4. **Soft Deletes**: Deletions are logical via `deleted_at TIMESTAMP WITH TIME ZONE NULL` and `is_deleted BOOLEAN DEFAULT FALSE`.
5. **JSONB Usage**: Flexible document structures (AI prompt metadata, line items, BYOK key configurations) use PostgreSQL `JSONB` with GIN indexing for fast querying.
6. **Indexing Strategy**: B-Tree composite indexes on `(organization_id, status, created_at DESC)` for high-throughput pagination.

---

## 2. Complete PostgreSQL 16 DDL

```sql
-- PostgreSQL 16 Database Schema Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. ORGANIZATIONS (Tenants)
-- ====================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    primary_email VARCHAR(255) NOT NULL,
    default_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'PROFESSIONAL', -- STARTER, PROFESSIONAL, ENTERPRISE
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',    -- TRIAL, ACTIVE, PAST_DUE, CANCELLED
    stripe_customer_id VARCHAR(100) UNIQUE,
    ai_keys_config JSONB DEFAULT '{}'::jsonb,                     -- BYOK encrypted keys
    notification_settings JSONB DEFAULT '{"email": true, "slack": true}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

CREATE INDEX idx_organizations_slug ON organizations (slug) WHERE is_deleted = FALSE;
CREATE INDEX idx_organizations_stripe_cust ON organizations (stripe_customer_id);

-- ====================================================================
-- 2. USERS & ACCOUNTS
-- ====================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_MEMBER', -- ROLE_ADMIN, ROLE_MANAGER, ROLE_MEMBER, ROLE_VIEWER
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

CREATE INDEX idx_users_org_role ON users (organization_id, role) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_email ON users (email);

-- ====================================================================
-- 3. CLIENTS (CRM)
-- ====================================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    industry VARCHAR(100),
    website VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE_CONTRACT', -- ONBOARDING, ACTIVE_CONTRACT, INACTIVE
    total_revenue NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_clients_org_status ON clients (organization_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_clients_company_name ON clients USING btree (organization_id, LOWER(company_name));

-- ====================================================================
-- 4. PROJECTS (Agile Tracker)
-- ====================================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS', -- PLANNING, IN_PROGRESS, IN_REVIEW, COMPLETED
    budget_allocated NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    budget_spent NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    deadline_date DATE,
    assigned_team_ids JSONB DEFAULT '[]'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_projects_org_status ON projects (organization_id, status, deadline_date) WHERE is_deleted = FALSE;

-- ====================================================================
-- 5. PROPOSALS
-- ====================================================================
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(200) NOT NULL,
    project_title VARCHAR(200) NOT NULL,
    budget NUMERIC(15, 2) NOT NULL,
    timeline_weeks INT NOT NULL,
    industry VARCHAR(100),
    tech_stack JSONB DEFAULT '[]'::jsonb,
    scope_objectives TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, GENERATED, SENT, ACCEPTED, REJECTED
    generated_content_markdown TEXT,
    tokens_used INT DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_proposals_org_status ON proposals (organization_id, status, created_at DESC) WHERE is_deleted = FALSE;

-- ====================================================================
-- 6. CONTRACTS & SOWs
-- ====================================================================
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    client_name VARCHAR(200) NOT NULL,
    agreement_type VARCHAR(50) NOT NULL DEFAULT 'STATEMENT_OF_WORK', -- STATEMENT_OF_WORK, MSA, NDA
    ip_ownership VARCHAR(100) NOT NULL DEFAULT 'CLIENT_EXCLUSIVE',
    governing_law VARCHAR(150) NOT NULL DEFAULT 'Delaware, USA',
    effective_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT_FOR_SIGNATURE, EXECUTED, EXPIRED
    document_pdf_url VARCHAR(500),
    signature_token VARCHAR(255) UNIQUE,
    signature_url VARCHAR(500),
    signed_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_contracts_org_status ON contracts (organization_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_contracts_sig_token ON contracts (signature_token) WHERE signature_token IS NOT NULL;

-- ====================================================================
-- 7. INVOICES
-- ====================================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of line items: [{description, quantity, rate, amount}]
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 8.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, PAID, OVERDUE, CANCELLED
    stripe_checkout_url VARCHAR(500),
    paid_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_invoices_org_status ON invoices (organization_id, status, due_date) WHERE is_deleted = FALSE;

-- ====================================================================
-- 8. JIRA SPRINTS & STORIES
-- ====================================================================
CREATE TABLE jira_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    jira_issue_key VARCHAR(50) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    description TEXT,
    story_points INT DEFAULT 3,
    status VARCHAR(50) NOT NULL DEFAULT 'TO_DO', -- TO_DO, IN_PROGRESS, DONE
    epic_name VARCHAR(150),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jira_org_key ON jira_stories (organization_id, jira_issue_key);

-- ====================================================================
-- 9. AUDIT LOGS
-- ====================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_org_date ON audit_logs (organization_id, created_at DESC);
```
