# PostgreSQL Database Deployment & Connection Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. PostgreSQL 16 Deployment Specifications

- **Managed Engine**: Amazon RDS PostgreSQL 16.2 (Multi-AZ Deployment)
- **Primary Instance Class**: `db.m6g.xlarge` (4 vCPU, 16 GB RAM, 100 GB GP3 Storage)
- **Read Replica Class**: `db.m6g.large` (2 vCPU, 8 GB RAM)
- **High Availability**: Multi-AZ Synchronous Replication with automatic failover ($< 60\text{s}$).

---

## 2. Connection Pooling Configuration (`HikariCP`)

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 30
      minimum-idle: 10
      idle-timeout: 300000 # 5 minutes
      max-lifetime: 1800000 # 30 minutes
      connection-timeout: 20000 # 20 seconds
      leak-detection-threshold: 60000 # 60 seconds
```

---

## 3. Flyway Migration Order & Execution

1. `V1__init_schema.sql` -> Create core database tables.
2. `V2__add_performance_indexes.sql` -> B-Tree composite indexes for pagination.
3. `V3__audit_and_jsonb_gin_indexes.sql` -> GIN indexing for JSONB fields.
4. `V4__seed_initial_data.sql` -> Initial staging tenant records.

### Automated Backups & PITR
- Automated Daily Snapshots: Retained for 30 days.
- WAL Log Archiving: Point-In-Time Recovery (PITR) with $< 15$-minute RPO.
