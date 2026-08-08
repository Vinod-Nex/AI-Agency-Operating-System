# Enterprise Operational Runbooks Catalog
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides step-by-step resolution procedures and operational runbooks for On-call SREs and DevOps Engineers responding to 8 core production failure modes.

---

## 2. Production Operational Runbooks Catalog

### Runbook 1: API Failure & 5xx HTTP Error Rate Spike
- **Symptom**: Prometheus alert `HighHTTP5xxErrorRate` triggers PagerDuty P1.
- **Triage & Diagnosis**:
  1. Open Grafana API Dashboard. Check error code breakdown (500 vs 502 vs 503 vs 504).
  2. Query Loki for recent backend exceptions: `{app="agencyos-backend", level="ERROR"}`.
- **Remediation Steps**:
  1. If memory exhaustion / OutOfMemory, trigger container restart: `railway service restart backend`.
  2. If upstream dependency timeout, enable circuit breaker override via Spring Actuator POST endpoint.
  3. If bug in recent release, initiate immediate rollback to previous image tag (See Runbook 6).

---

### Runbook 2: PostgreSQL Database Failure & Connection Pool Exhaustion
- **Symptom**: Alert `PostgreSQLDatabaseDown` or `HikariCPConnectionPoolExhausted`.
- **Triage & Diagnosis**:
  1. Check AWS RDS CPU and connection count: `aws rds describe-db-instances`.
  2. Identify long-running unindexed queries:
     ```sql
     SELECT pid, now() - query_start AS duration, query 
     FROM pg_stat_activity 
     WHERE state != 'idle' ORDER BY duration DESC;
     ```
- **Remediation Steps**:
  1. Terminate blocking/runaway queries: `SELECT pg_terminate_backend(pid);`.
  2. Increase HikariCP max pool size temporarily via environment variable configuration reload.
  3. If RDS instance is unresponsive, trigger multi-AZ failover to standby instance via AWS CLI.

---

### Runbook 3: Redis Failure & Queue Processing Stoppage
- **Symptom**: Alert `RedisInstanceDown` or `BullMQQueueBacklogHigh`.
- **Triage & Diagnosis**:
  1. Verify Redis memory usage: `redis-cli info memory`.
  2. Check connected client count and maxmemory eviction metrics.
- **Remediation Steps**:
  1. Flush non-essential cache keys: `redis-cli EVAL "return redis.call('del', unpack(redis.call('keys', 'cache:tmp:*')))" 0`.
  2. Restart Redis container instance if socket connection is frozen.
  3. Scale up Railway / AWS ElastiCache node memory size.

---

### Runbook 4: AI Provider Outage & Automated Provider Fallback
- **Symptom**: Alert `AIProviderOutage` (Anthropic, OpenAI, or Gemini returning 503 / 429).
- **Triage & Diagnosis**:
  1. Check Grafana AI Dashboard to isolate failing provider.
  2. Check official provider status pages (status.openai.com, status.anthropic.com).
- **Remediation Steps**:
  1. Activate manual AI Gateway fallback override via Spring Actuator:
     ```bash
     curl -X POST https://api.agencyos.ai/actuator/env \
          -H "Content-Type: application/json" \
          -d '{"name":"AI_DEFAULT_PROVIDER","value":"OPENAI"}'
     ```
  2. Verify proposal generation traffic redirects cleanly to backup provider.

---

### Runbook 5: Deployment Failure & CI/CD Pipeline Breakdown
- **Symptom**: Railway / Vercel build failure or health probe timeout during deployment rollout.
- **Triage & Diagnosis**:
  1. Check Railway / Vercel build log outputs for compilation errors or migration failures.
- **Remediation Steps**:
  1. Cancel active deployment job in Railway / Vercel.
  2. Restore traffic router to existing stable deployment target.
  3. Fix failing code/test locally and submit hotfix pull request.

---

### Runbook 6: Production Service Rollback Procedure
- **Symptom**: Unhandled regression introduced in latest deployment.
- **Remediation Steps**:
  1. Roll back Railway Backend Service:
     ```bash
     railway rollback --service agencyos-backend --target v1.4.1
     ```
  2. Roll back Vercel Frontend Deployment:
     ```bash
     vercel rollback agencyos-frontend.vercel.app
     ```
  3. Verify liveness and readiness health endpoints (`/actuator/health/readiness`).

---

### Runbook 7: Database Backup & Point-In-Time Restore (PITR)
- **Symptom**: Accidental data corruption or malicious deletion requiring database restoration.
- **Remediation Steps**:
  1. Identify exact target timestamp prior to corruption event (e.g. `2026-07-25T20:15:00Z`).
  2. Initiate AWS RDS Point-In-Time Restore to a new DB instance:
     ```bash
     aws rds restore-db-instance-to-point-in-time \
         --source-db-instance-identifier agencyos-prod-db \
         --target-db-instance-identifier agencyos-prod-db-restored \
         --restore-time 2026-07-25T20:15:00Z
     ```
  3. Point Spring Boot backend JDBC URL to restored database instance endpoint.
  4. Perform data consistency check and re-enable application traffic.

---

### Runbook 8: TLS/SSL Certificate Expiry & Renewal Failure
- **Symptom**: Browser SSL certificate error (`NET::ERR_CERT_DATE_INVALID`).
- **Triage & Diagnosis**: Check domain TLS certificate expiration date via OpenSSL:
  ```bash
  openssl s_client -connect app.agencyos.ai:443 -servername app.agencyos.ai | openssl x509 -noout -dates
  ```
- **Remediation Steps**:
  1. Trigger manual Let's Encrypt / AWS ACM certificate renewal:
     ```bash
     aws acm request-certificate --domain-name app.agencyos.ai --validation-method DNS
     ```
  2. Update Vercel / Railway custom domain SSL binding configuration.
  3. Verify HTTPS connection in browser.
