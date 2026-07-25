# Security Event Monitoring & Audit Trail Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Security Event Monitoring Catalog

| Security Event | Detection Logic | Alert Action |
| :--- | :--- | :--- |
| **Brute Force Login Attack** | $> 10$ failed logins from single IP in 60s | Block IP via AWS WAF & trigger SEV-2 alert |
| **RBAC Authorization Violation** | Any HTTP 403 response on admin endpoints | Log security event & notify `#security-alerts` |
| **JWT Tampering / Signature Failure** | Invalid HMAC signature or expired token attempt | Log security event & increment metric counter |
| **Prompt Injection Attempt** | Input string contains forbidden delimiter pattern | Abort synthesis request & log audit entry |
