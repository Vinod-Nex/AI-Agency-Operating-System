# Log Retention, Archiving & PII Redaction Policy
## AI Agency Operating System (AgencyOS)

---

## 1. Multi-Environment Retention Matrix

| Environment | Active Log Storage (Loki/CloudWatch) | Archived Storage (AWS S3 Glacier) | Total Retention |
| :--- | :--- | :--- | :--- |
| **Development** | 3 Days | None | 3 Days |
| **QA / Testing** | 7 Days | None | 7 Days |
| **Staging** | 14 Days | 30 Days | 44 Days |
| **Production** | 30 Days | 7 Years (Audit & Compliance) | 7 Years |

---

## 2. Automatic PII Masking Rules

Logging frameworks automatically mask sensitive fields (`password`, `creditCardNumber`, `ssn`, `jwtSecret`) with `[REDACTED]` prior to emission.
