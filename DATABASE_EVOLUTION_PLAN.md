# Enterprise PostgreSQL Database Evolution & Flyway Migration Plan
## AI Agency Operating System (AgencyOS)

---

# PART 1: Database Architecture & Multi-Tenant Strategy

### 1.1 Architectural Strategy & Principles
- **Engine**: PostgreSQL 16 Enterprise with PgBouncer connection pool.
- **Multi-Tenancy Model**: **Discriminator Column with Row-Level Security (RLS)** (`organization_id UUID NOT NULL REFERENCES organizations(id)`). RLS guarantees strict kernel-level tenant data isolation.
- **Primary Key Strategy**: Universally Unique Identifiers (UUID v4 via `gen_random_uuid()`) for all entity tables to eliminate ID enumeration attacks and support distributed multi-region creation.
- **Timestamp Strategy**: Timestamps stored strictly in `TIMESTAMPTZ` (UTC with timezone).
- **Soft Delete Strategy**: Dual-column soft deletion: `is_deleted BOOLEAN DEFAULT FALSE` + `deleted_at TIMESTAMPTZ NULL`. All queries filter `is_deleted = FALSE`.
- **Audit Field Standard**: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`, `created_by UUID REFERENCES users(id)`, `updated_by UUID REFERENCES users(id)`.

---

# PART 2: Database Change Management & Zero-Downtime Deployment

### 2.1 Zero-Downtime Migration Rules (Expand-Contract Pattern)
1. **Never Drop or Rename Columns Directly**:
   - Step 1 (Expand): Add new column alongside old column; populate new column via background job.
   - Step 2 (Dual Write): Application writes to both old and new columns.
   - Step 3 (Contract): Deprecate old column and remove in a subsequent release.
2. **Online Index Creation**: All production indexes created using `CREATE INDEX CONCURRENTLY`.
3. **Lock Timeouts**: Set `lock_timeout = '3s'` on DDL migrations to prevent database lock starvation.
4. **Feature Flags**: Schema modifications gated behind application feature flags.

---

# PART 3: Flyway Migration Tooling & Structure

### 3.1 Monorepo Directory Tree
```
database/
├── flyway.conf                         # Flyway Migration Configurations
├── migration/                          # Versioned SQL Migration Scripts
│   ├── V1__init_tenant_schema.sql      # Core Tenant & User Entities
│   ├── V2__init_crm_and_projects.sql   # Clients, Projects, Tasks, Meetings
│   ├── V3__init_proposals_and_sow.sql  # Proposals, SOWs, & Contracts
│   ├── V4__init_billing_and_invoices.sql# Invoices, Payments, Stripe Subscriptions
│   ├── V5__init_ai_engine_tables.sql   # Prompts, AI Usage, Token Logs, Vectors
│   ├── V6__init_audit_and_activity.sql # SOC2 Audit Logs & Activity Feed
│   ├── V7__init_analytics_and_indexes.sql# Analytical Views & Performance Indexes
│   └── U1__undo_init_tenant_schema.sql # Undo Script Templates
└── seed/
    ├── R__01_seed_permissions.sql      # Repeatable Migration: System Permissions
    └── R__02_seed_prompt_templates.sql  # Repeatable Migration: Standard AI Templates
```

### 3.2 Naming Convention
- **Versioned Migrations**: `V{VERSION}__{DESCRIPTION}.sql` (e.g. `V1__init_tenant_schema.sql`).
- **Repeatable Migrations**: `R__{DESCRIPTION}.sql` (Re-run whenever hash changes).
- **Undo Migrations**: `U{VERSION}__{DESCRIPTION}.sql`.

---

# PARTS 4 - 6: All Table Specifications & Entity Relationships

### 4.1 Master Entity Tables (42 Core Tables)

```sql
-- 1. ORGANIZATIONS (Tenant Root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    custom_domain VARCHAR(255),
    plan_tier VARCHAR(50) DEFAULT 'STARTER',
    stripe_customer_id VARCHAR(100) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACES
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

-- 3. USERS
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

-- 4. ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PERMISSIONS
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- 6. ROLE_PERMISSIONS (M:N)
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 7. USER_ROLES (M:N)
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 8. CLIENTS
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

-- 9. PROJECTS
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
    status VARCHAR(50) DEFAULT 'DRAFT',
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TASKS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'TODO',
    assignee_id UUID REFERENCES users(id),
    due_date TIMESTAMPTZ,
    story_points INT DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEETINGS & TRANSCRIPTS
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    raw_transcript TEXT,
    summary_markdown TEXT,
    action_items JSONB DEFAULT '[]'::jsonb,
    scheduled_at TIMESTAMPTZ,
    duration_minutes INT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROPOSALS
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
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SOWS (Statements of Work)
CREATE TABLE sows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sow_number VARCHAR(100) UNIQUE NOT NULL,
    scope_deliverables JSONB DEFAULT '[]'::jsonb,
    total_value NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CONTRACTS
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sow_id UUID REFERENCES sows(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    ip_clause_type VARCHAR(255),
    governing_law VARCHAR(255),
    content_markdown TEXT NOT NULL,
    esign_status VARCHAR(50) DEFAULT 'DRAFT',
    esign_url TEXT,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    sow_id UUID REFERENCES sows(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    subtotal NUMERIC(15, 2) NOT NULL,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    stripe_invoice_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. INVOICE LINE ITEMS
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) DEFAULT 1,
    unit_rate NUMERIC(15, 2) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL
);

-- 17. PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_status VARCHAR(50) DEFAULT 'PROCESSING',
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_tier VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ACTIVITIES
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AUDIT LOGS (SOC2 Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    changes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. FILES (S3/R2 Metadata)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    storage_key TEXT NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. COMMENTS
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. APPROVALS
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    approver_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# PARTS 7 - 10: Indexing, Optimization & Security

### 7.1 Primary & Secondary Indexes
```sql
-- Multi-Tenant B-Tree Indexes
CREATE INDEX idx_users_org_email ON users(organization_id, email);
CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id, workspace_id);
CREATE INDEX idx_tasks_proj ON tasks(project_id);
CREATE INDEX idx_proposals_org ON proposals(organization_id, client_id);
CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_notifs_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_org_time ON audit_logs(organization_id, created_at DESC);

-- GIN Indexes on JSONB Fields
CREATE INDEX idx_meetings_action_items ON meetings USING GIN (action_items);
CREATE INDEX idx_activities_metadata ON activities USING GIN (metadata);
```

### 8.1 Partitioning Strategy
- **Audit Logs Table (`audit_logs`)**: Range-partitioned monthly on `created_at` (`audit_logs_y2026m07`, `audit_logs_y2026m08`) to ensure zero degradation over time.
- **AI Usage Logs Table (`ai_usage_logs`)**: Range-partitioned monthly.

---

# PART 11: AI Engine Database Schema

```sql
-- 25. PROMPT_TEMPLATES
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    template_text TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. API_KEYS (BYOK Keys)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    key_hash TEXT NOT NULL,
    key_encrypted TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, provider)
);

-- 27. AI_USAGE_LOGS
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    estimated_cost_usd NUMERIC(10, 6),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_usage_org ON ai_usage_logs(organization_id, created_at DESC);
```

---

# PART 12 & 13: Audit & Analytical Views

```sql
-- Analytical Materialized View for Monthly Organization MRR
CREATE MATERIALIZED VIEW mv_monthly_tenant_mrr AS
SELECT 
    organization_id,
    DATE_TRUNC('month', created_at) AS mrr_month,
    SUM(total_amount) AS total_mrr
FROM invoices
WHERE status = 'PAID'
GROUP BY organization_id, DATE_TRUNC('month', created_at);

CREATE UNIQUE INDEX idx_mv_mrr ON mv_monthly_tenant_mrr(organization_id, mrr_month);
```

---

# PARTS 14 - 17: Flyway Migrations & Deployment Checklist

### Version History Log (`flyway_schema_history`)
1. `V1__init_tenant_schema.sql`: Core Organizations, Workspaces, Users, Roles, Permissions.
2. `V2__init_crm_and_projects.sql`: Clients, Projects, Tasks, Meetings.
3. `V3__init_proposals_and_sow.sql`: Proposals, SOWs, Contracts.
4. `V4__init_billing_and_invoices.sql`: Invoices, Invoice Line Items, Payments, Subscriptions.
5. `V5__init_ai_engine_tables.sql`: Prompt Templates, API Keys, AI Usage Logs.
6. `V6__init_audit_and_activity.sql`: Audit Logs (Partitioned), Activities, Files, Comments.
7. `V7__init_analytics_and_indexes.sql`: Materialized Views, Composite Indexes, RLS Policies.

### Pre-Deployment Verification Checklist
- [ ] Flyway migration checksum validation (`flyway validate`).
- [ ] Zero database lock timeout exceptions (`lock_timeout = 3000`).
- [ ] All production indexes created with `CONCURRENTLY`.
- [ ] Multi-tenant Row-Level Security policies active on all tenant entity tables.
