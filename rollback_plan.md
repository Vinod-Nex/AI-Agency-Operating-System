# Production Rollback Plan & Failback Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document defines automated and manual rollback triggers, component-level rollback execution procedures (Database, Backend, Frontend, DNS), and post-rollback verification protocols.

---

## 2. Rollback Triggers & Decision Matrix

| Rollback Trigger Event | Detection Mechanism | Threshold | Action Required |
| :--- | :--- | :--- | :--- |
| **P0 Core Service Crash** | Health Probe / Prometheus | Backend API `up == 0` for > 2m | Trigger Full Rollback |
| **HTTP 5xx Error Rate Spike** | Prometheus Alert | 5xx Error Rate > 1% for > 3m | Trigger Full Rollback |
| **Failed DB Schema Migration** | Flyway Migration Logs | Script failure or constraint violation | Trigger DB & Backend Rollback |
| **Critical Security Breach** | WAF / SOC Detection | Zero-Day exploit active | Trigger Immediate Maintenance Mode |
| **Data Corruption Anomaly** | DB Integrity Monitor | Transaction corruption detected | Trigger RDS Point-In-Time Restore |

---

## 3. Step-by-Step Rollback Execution

### Step 1: Re-Enable Maintenance Banner (< 30 Seconds)
```bash
# Enable Maintenance Gateway
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

### Step 2: Roll Back Frontend Vercel Deployment (< 1 Minute)
```bash
# Revert Vercel alias to previous stable build
vercel alias set agencyos-frontend-v0-9-9.vercel.app app.agencyos.ai
```

### Step 3: Roll Back Backend Railway / AWS ECS Container (< 2 Minutes)
```bash
# Revert Railway container deployment to v0.9.9
railway rollback --service agencyos-backend --target v0.9.9
```

### Step 4: Undo Database Flyway Migrations (< 3 Minutes)
```bash
# Execute Flyway Undo Migration Script
mvn flyway:undo -Dflyway.target=6
```

### Step 5: Verify Rollback & Re-Open Platform (< 2 Minutes)
- Run health checks: `curl -f https://api.agencyos.ai/actuator/health/readiness`
- Disable Maintenance Mode: `NEXT_PUBLIC_MAINTENANCE_MODE=false`
