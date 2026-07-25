# Enterprise Structured Logging & Audit Trail Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Structured JSON Log Schema

All log outputs are rendered as single-line JSON objects with standard fields:

```json
{
  "timestamp": "2026-07-25T12:00:00.123Z",
  "correlation_id": "c891f01a-9921-4f81-a201-9012a9bc0412",
  "tenant_id": "00000000-0000-0000-0000-000000000001",
  "user_id": "00000000-0000-0000-0000-000000000002",
  "level": "INFO",
  "service": "agencyos-backend-api",
  "logger": "com.agencyos.invoice.service.InvoiceService",
  "message": "Invoice INV-2026-0042 created and sent to client Nexus Health Inc.",
  "invoice_id": "inv_0042891a",
  "amount": 24840.00
}
```

---

## 2. Retention Policies

- **Debug / Trace Logs**: 7 Days (Grafana Loki Hot Storage)
- **Application Logs**: 30 Days (AWS CloudWatch Logs)
- **Security & Audit Logs**: 7 Years (PostgreSQL `audit_logs` + S3 Glacier Flexible Retrieval)
