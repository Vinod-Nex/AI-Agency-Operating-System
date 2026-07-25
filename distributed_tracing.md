# Distributed Tracing & W3C Context Propagation
## AI Agency Operating System (AgencyOS)

---

## 1. Trace Propagation Standard (W3C Trace Context)

Distributed requests pass HTTP headers across all service boundaries:
- `traceparent`: `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`
- `tracestate`: `agencyos_tenant=00000000-0000-0000-0000-000000000001`

---

## 2. Span Hierarchy Standard

```
[ HTTP GET /api/v1/proposals/generate ] (Root Span - Next.js/Spring Gateway)
    ├── [ ProposalService.generateProposal ] (Child Span)
    │     ├── [ PostgreSQL SELECT client_info ] (DB Span - 12ms)
    │     ├── [ Claude API POST /v1/messages ] (External LLM Span - 840ms)
    │     └── [ PostgreSQL INSERT proposal ] (DB Span - 18ms)
    └── [ Redis SET cached_draft ] (Cache Span - 2ms)
```
