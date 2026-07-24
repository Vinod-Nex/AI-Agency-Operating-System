-- Migration: V1__init_schema.sql
-- Description: Enterprise Multi-Tenant PostgreSQL Schema DDL for AI Agency Operating System

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'AGENCY_OWNER', 'AGENCY_ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'QA_ENGINEER', 'FINANCE_MANAGER', 'CLIENT_USER');
CREATE TYPE plan_tier_enum AS ENUM ('STARTER', 'PROFESSIONAL', 'AGENCY_SCALE', 'ENTERPRISE');
CREATE TYPE doc_status_enum AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SENT_TO_CLIENT', 'SIGNED', 'REJECTED', 'EXPIRED');
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE task_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE ai_provider_enum AS ENUM ('ANTHROPIC', 'OPENAI', 'GOOGLE_GEMINI');

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    custom_domain VARCHAR(255),
    plan_tier plan_tier_enum DEFAULT 'STARTER',
    stripe_customer_id VARCHAR(100) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- 3. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    primary_contact_name VARCHAR(255),
    primary_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website TEXT,
    billing_address TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    budget NUMERIC(15, 2),
    start_date DATE,
    target_end_date DATE,
    progress_percentage INT DEFAULT 0,
    status doc_status_enum DEFAULT 'DRAFT',
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority_enum DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'TODO',
    assignee_id UUID REFERENCES users(id),
    due_date TIMESTAMPTZ,
    story_points INT DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    target_budget NUMERIC(15, 2),
    timeline_weeks VARCHAR(100),
    requirements_text TEXT,
    content_markdown TEXT NOT NULL,
    pdf_url TEXT,
    status doc_status_enum DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orgs_slug ON organizations(slug);
CREATE INDEX idx_users_org ON users(organization_id, email);
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id, workspace_id);
CREATE INDEX idx_tasks_proj ON tasks(project_id);
CREATE INDEX idx_proposals_org ON proposals(organization_id, client_id);
