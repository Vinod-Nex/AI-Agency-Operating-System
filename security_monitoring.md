# Security Telemetry, Audit Logging & Threat Detection Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details security threat detection rules, automated audit log specifications, authentication failure tracking, privilege escalation detection, RBAC violation alerts, API abuse monitoring, and JWT validation audit standards for AgencyOS.

---

## 2. Threat Detection Rules Matrix

| Security Threat Category | Detection Mechanism | Log Pattern / Metric | Severity | Automated Action |
| :--- | :--- | :--- | :--- | :--- |
| **Brute-Force Authentication** | Rate limit breach on `/api/v1/auth/login` | `auth_login_failure_total > 20/min` | P1 - CRITICAL | IP auto-blocked by WAF for 1 hour |
| **Privilege Escalation Attempt**| User attempts access to unassigned tenant resource | `security_rbac_violations_total > 5/min` | P1 - CRITICAL | Session revoked, Audit log emitted |
| **JWT Signature Failure** | Invalid/tampered JWT token submitted | `jwt_validation_failures_total > 10/min` | P2 - HIGH | Token rejected (HTTP 401), IP logged |
| **API Rate Limit Abuse** | Ingress rate limit exceeded by client IP | `rate_limit_rejected_total > 100/min` | P2 - HIGH | Client throttled (HTTP 429) |
| **Suspicious IP Geolocation** | Login from new country within 5m of previous session | Audit event `GEO_ANOMALY` | P2 - HIGH | Force MFA verification |
| **KMS / Secret Access Abuse**| Excessive AWS KMS key decrypt calls | `aws_kms_decrypt_calls > 500/min` | P1 - CRITICAL | Alert SOC team immediately |

---

## 3. Audit Log Schema & Specification

All security-sensitive operations (user creation, role modification, billing changes, data exports) emit immutable JSON audit logs:

```json
{
  "@timestamp": "2026-07-25T21:45:00.000Z",
  "log.category": "SECURITY_AUDIT",
  "event.type": "ROLE_MODIFICATION",
  "actor": {
    "user_id": "usr_11223344-5566-7788-9900-aabbccddeeff",
    "email": "admin@agency.com",
    "org_id": "org_99182371-2391-4a11-82bf-112233445566",
    "client_ip": "198.51.100.22"
  },
  "target": {
    "resource": "USER_ROLE",
    "target_user_id": "usr_99887766-5544-3322-1100-ffaaddeebbcc",
    "previous_role": "STANDARD_USER",
    "new_role": "ORG_ADMIN"
  },
  "status": "SUCCESS"
}
```

---

## 4. Compliance & Storage Standard

- **Audit Log Retention**: 7 Years in AWS S3 Glacier with Object Lock enabled (Compliance with SOC2 Type II, ISO 27001, and HIPAA).
- **Log Immutability**: Write-Once-Read-Many (WORM) storage policy prevents deletion or tampering by any user or administrator.
