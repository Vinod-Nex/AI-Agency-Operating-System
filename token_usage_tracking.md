# Token Accounting & Multi-Tenant Quota Ledger Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document defines the database schema for AI operations, token consumption accounting ledgers, multi-tenant organization quotas, user usage tracking, and automated quota enforcement.

---

## 2. PostgreSQL DDL Schema for AI Infrastructure (`V6__ai_infrastructure_schema.sql`)

```sql
-- 1. AI Conversations Table
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id),
    project_id UUID REFERENCES projects(id),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    model_provider VARCHAR(50) NOT NULL, -- OPENAI, GEMINI
    model_name VARCHAR(100) NOT NULL,
    total_tokens_spent BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Prompt Templates Registry
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- PROPOSAL, SOW, CONTRACT, JIRA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Prompt Versions Table
CREATE TABLE prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL, -- e.g. v1.2.0
    system_prompt TEXT NOT NULL,
    user_prompt_template TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, ARCHIVED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, version)
);

-- 4. Model Configuration Table
CREATE TABLE model_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    use_case VARCHAR(100) NOT NULL UNIQUE, -- PROPOSAL_GEN, CONTRACT_GEN
    primary_provider VARCHAR(50) NOT NULL,
    primary_model VARCHAR(100) NOT NULL,
    fallback_provider VARCHAR(50) NOT NULL,
    fallback_model VARCHAR(100) NOT NULL,
    max_tokens INT NOT NULL DEFAULT 4096,
    temperature DECIMAL(3,2) DEFAULT 0.70,
    top_p DECIMAL(3,2) DEFAULT 0.95,
    timeout_ms INT DEFAULT 10000
);

-- 5. Token Usage Ledger Table
CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    conversation_id UUID REFERENCES ai_conversations(id),
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    cost_usd DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Cost Tracking Aggregates Table
CREATE TABLE cost_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    billing_period VARCHAR(7) NOT NULL, -- YYYY-MM
    total_prompt_tokens BIGINT DEFAULT 0,
    total_completion_tokens BIGINT DEFAULT 0,
    total_cost_usd DECIMAL(12, 4) DEFAULT 0.0000,
    budget_limit_usd DECIMAL(12, 4) DEFAULT 500.0000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(org_id, billing_period)
);

-- 7. AI Audit Logs Table
CREATE TABLE ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    prompt_hash VARCHAR(64) NOT NULL,
    safety_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Provider Health Table
CREATE TABLE provider_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL, -- HEALTHY, DEGRADED, DOWN
    latency_p95_ms INT,
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Business Rules & Token Quota Enforcement

1. **Atomic Consumption Ledger**: Every LLM execution writes an immutable transaction to `token_usage`.
2. **Quota Interception Filter**: Before executing an LLM call, the gateway verifies that `cost_tracking.total_cost_usd < budget_limit_usd`. If breached, HTTP 429 "Monthly AI Budget Exceeded" is returned.
