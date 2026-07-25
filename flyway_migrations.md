# Flyway Database Migration Plan & Execution Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Naming Conventions

All database schema mutations in **AgencyOS** are versioned and applied using **Flyway SQL Migrations**.
- Migration Location: `src/main/resources/db/migration/`
- Naming Format: `V<Version>__<Description>.sql` (e.g., `V1__init_schema.sql`, `V2__add_indexes.sql`).
- Repeatable Migration Format: `R__<Description>.sql` (for views and stored procedures).

---

## 2. Flyway Migration Scripts

### Script 1: `V1__init_schema.sql`
```sql
-- Flyway Migration V1: Initial Schema Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    primary_email VARCHAR(255) NOT NULL,
    default_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'PROFESSIONAL',
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    stripe_customer_id VARCHAR(100) UNIQUE,
    ai_keys_config JSONB DEFAULT '{}'::jsonb,
    notification_settings JSONB DEFAULT '{"email": true, "slack": true}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_MEMBER',
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
```

---

### Script 2: `V2__add_performance_indexes.sql`
```sql
-- Flyway Migration V2: Performance & Pagination B-Tree Composite Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations (slug) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_users_org_role ON users (organization_id, role) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_clients_org_status ON clients (organization_id, status) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_projects_org_status ON projects (organization_id, status, deadline_date) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_proposals_org_status ON proposals (organization_id, status, created_at DESC) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_contracts_org_status ON contracts (organization_id, status) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_invoices_org_status ON invoices (organization_id, status, due_date) WHERE is_deleted = FALSE;
```

---

### Script 3: `V3__audit_and_jsonb_gin_indexes.sql`
```sql
-- Flyway Migration V3: GIN Indexing for JSONB Fields
CREATE INDEX IF NOT EXISTS idx_proposals_tech_stack_gin ON proposals USING gin (tech_stack);
CREATE INDEX IF NOT EXISTS idx_invoices_items_gin ON invoices USING gin (items);
CREATE INDEX IF NOT EXISTS idx_audit_logs_details_gin ON audit_logs USING gin (details);
```

---

### Script 4: `V4__seed_initial_data.sql`
```sql
-- Flyway Migration V4: Initial Seed Data for Staging & Local Dev
INSERT INTO organizations (id, name, slug, primary_email, subscription_tier)
VALUES ('00000000-0000-0000-0000-000000000001', 'Apex Digital Studio', 'apex-digital', 'admin@apexdigital.io', 'PROFESSIONAL')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'vinod@apexdigital.io',
    '$2a$12$KIXH02m94wN6hQ0172h3yO0h.K.61H2p1k78q15K21s11h87q', -- bcrypt hash for Password123!
    'Vinod',
    'Kumar',
    'ROLE_ADMIN'
) ON CONFLICT (email) DO NOTHING;
```

---

## 3. Flyway Execution Commands

### Run Migrations via Maven Plugin
```bash
mvn flyway:migrate -Dflyway.url=jdbc:postgresql://localhost:5432/agencyos -Dflyway.user=postgres -Dflyway.password=postgres
```

### Check Migration Status
```bash
mvn flyway:info
```

### Validate Migration Checksums
```bash
mvn flyway:validate
```

### Repair Failed Migrations
```bash
mvn flyway:repair
```
