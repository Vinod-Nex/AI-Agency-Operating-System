# Structured Logging & Audit Trail Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & JSON Logging Standard

All application logs across Next.js 15 frontend, Spring Boot backend, and worker services are structured as **JSON Line (JSONL)** formatted events and ingested by **Grafana Loki / ElasticSearch**.

### Mandatory Log Attributes
- `timestamp`: ISO 8601 UTC timestamp (`2026-07-25T12:00:00.123Z`)
- `correlation_id`: Unique HTTP request trace ID (`X-Correlation-ID`)
- `tenant_id`: Organization UUID (`organization_id`)
- `user_id`: Authenticated user UUID
- `level`: `INFO`, `WARN`, `ERROR`, `AUDIT`
- `service`: `agencyos-backend-api` / `agencyos-frontend`
- `logger`: Java class name / module path
- `message`: Human-readable log summary
- `exception`: Stack trace (present on `ERROR` level)

---

## 2. Structured JSON Log Example

```json
{
  "timestamp": "2026-07-25T12:34:56.789Z",
  "correlation_id": "c891f01a-9921-4f81-a201-9012a9bc0412",
  "tenant_id": "00000000-0000-0000-0000-000000000001",
  "user_id": "00000000-0000-0000-0000-000000000002",
  "level": "INFO",
  "service": "agencyos-backend-api",
  "logger": "com.agencyos.proposal.service.ProposalService",
  "message": "AI Proposal generated successfully for client Nexus Health Inc.",
  "payload": {
    "proposal_id": "prop_8923f01a",
    "ai_model": "claude-3-5-sonnet",
    "tokens_consumed": 3420,
    "synthesis_time_ms": 842
  }
}
```

---

## 3. Log Retention & Archival Policies

| Log Type | Retention Period | Storage Target | Compliance Requirement |
| :--- | :--- | :--- | :--- |
| **Application Debug Logs** | 7 Days | Grafana Loki Hot Storage | Developer Diagnostics |
| **HTTP Access Logs** | 30 Days | AWS CloudWatch Logs | Operational Audit |
| **Security & Authentication Logs** | 90 Days | S3 Glacier Flexible Retrieval | SOC 2 Type II / ISO 27001 |
| **Tenant Audit Logs** | 7 Years | PostgreSQL `audit_logs` + S3 Glacier | Enterprise Legal Compliance |
