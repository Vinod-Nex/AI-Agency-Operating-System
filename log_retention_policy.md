# Log Retention Policy, Archival & PII Masking Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document outlines log retention tiers across development, staging, and production environments, AWS S3 Lifecycle lifecycle policies, automated PII redaction rules, and compliance data preservation frameworks.

---

## 2. Environment Retention Matrix

| Environment | Log Category | Primary Storage | Retention Period | Archival Storage | WORM Compliance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Development** | All Logs | Console / Local File | 7 Days | None | No |
| **QA / Testing** | All Logs | Ephemeral Loki | 14 Days | None | No |
| **Staging** | All Logs | Grafana Loki | 30 Days | None | No |
| **Production** | Application & API | Grafana Loki | 30 Days Hot | AWS S3 Standard (1 Year) | No |
| **Production** | Security & Audit | AWS CloudWatch Logs | 90 Days Hot | AWS S3 Glacier (7 Years) | Yes (Object Lock) |
| **Production** | Billing & Payment | AWS CloudWatch Logs | 90 Days Hot | AWS S3 Glacier (7 Years) | Yes (Object Lock) |

---

## 3. PII Masking & Redaction Rules

All log appenders enforce regex filter patterns (`logstash-logback-encoder` patterns) before log bytes leave memory:

1. **Credit Cards (PAN)**: `(?:\d[ -]*?){13,16}` -> Replace with `[REDACTED_PAN]`
2. **Social Security Numbers**: `\b\d{3}-\d{2}-\d{4}\b` -> Replace with `[REDACTED_SSN]`
3. **JWT Bearer Tokens**: `Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*` -> Replace with `Bearer [REDACTED_TOKEN]`
4. **Email Addresses (in debug logs)**: `([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})` -> Hash via SHA-256 (`[HASH_83a1b4...]`)

---

## 4. AWS S3 Lifecycle Configuration (`s3-log-retention-policy.json`)

```json
{
  "Rules": [
    {
      "ID": "ArchiveAuditLogsToGlacier",
      "Status": "Enabled",
      "Filter": { "Prefix": "audit-logs/" },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
```
