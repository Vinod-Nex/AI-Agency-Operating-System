# Enterprise Structured Logging & Correlation Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Log Levels & Standard Attributes

- `TRACE`: Fine-grained internal framework execution details (Disabled in Production).
- `DEBUG`: System diagnostics, SQL query execution parameters (Staging only).
- `INFO`: Normal operational events (User login, proposal generated, invoice sent).
- `WARN`: Recoverable failures (Circuit breaker fallback, API retry triggered).
- `ERROR`: Unhandled exceptions, HTTP 5xx responses, DB timeouts.
- `FATAL`: System-wide failure forcing application context termination.

---

## 2. Standard JSON Log Schema

```json
{
  "timestamp": "2026-07-25T12:00:00.123Z",
  "correlation_id": "c891f01a-9921-4f81-a201-9012a9bc0412",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
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
