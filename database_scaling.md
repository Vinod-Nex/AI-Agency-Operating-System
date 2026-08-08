# PostgreSQL Database Scaling, Sharding & Partitioning Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the PostgreSQL scaling roadmap: connection pooling (PgBouncer), read replicas, declarative range partitioning, materialized views, archiving to S3, and tenant sharding readiness.

---

## 2. PostgreSQL Scaling Architecture Topology

```mermaid
graph TD
    API[Spring Boot Microservices / HikariCP] --> PgBouncer[PgBouncer Connection Pooler]
    
    PgBouncer -->|Write Queries (INSERT/UPDATE/DELETE)| PrimaryDB[(AWS Aurora PostgreSQL - Primary Writer)]
    PgBouncer -->|Read Queries (SELECT)| ReadReplica1[(Aurora Read Replica 1 - Reporting)]
    PgBouncer -->|Read Queries (SELECT)| ReadReplica2[(Aurora Read Replica 2 - API Readers)]

    PrimaryDB -->|Streaming WAL Replication| ReadReplica1
    PrimaryDB -->|Streaming WAL Replication| ReadReplica2
    
    PrimaryDB -->|S3 Export Archive| S3Glacier[(AWS S3 Glacier Cold Storage)]
```

---

## 3. Database Scaling Initiatives & Timeline

| Scaling Phase | Architecture Milestone | Primary Technique | Target Database Metric |
| :--- | :--- | :--- | :--- |
| **Month 1** | Connection Optimization | Deploy PgBouncer (Transaction Pooling) | Active DB Connections < 200 |
| **Month 3** | Read/Write Splitting | Spring `@Transactional(readOnly = true)` to Replicas | Primary CPU Utilization < 40% |
| **Month 6** | Declarative Partitioning | Monthly Range Partitioning on `ai_usage` & `audit_logs` | Query execution time < 15ms |
| **Month 12**| Materialized Metric Views | Concurrent Refresh Views for Executive Dashboards | Dashboard Load Time < 200ms |
| **Month 24**| Multi-Tenant Sharding | Citus Extension / Tenant ID Hash Sharding | Scaling to 10M+ Rows / Day |

---

## 4. Declarative Range Partitioning Specification

For high-volume append-only tables (`ai_usage`, `token_usage`, `audit_logs`), declarative monthly range partitioning is enforced:

```sql
-- Partition Master Table
CREATE TABLE ai_usage_partitioned (
    id UUID NOT NULL,
    org_id UUID NOT NULL,
    user_id UUID NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    cost_usd DECIMAL(10,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
) PARTITION BY RANGE (created_at);

-- Monthly Partition Tables
CREATE TABLE ai_usage_y2026m08 PARTITION OF ai_usage_partitioned
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE ai_usage_y2026m09 PARTITION OF ai_usage_partitioned
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
```
