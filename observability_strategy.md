# OpenTelemetry Distributed Tracing & Observability Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. OpenTelemetry (OTel) Distributed Tracing Architecture

**AgencyOS** uses **OpenTelemetry 1.30+** for end-to-end distributed tracing across Next.js frontend, Spring Boot micro-services, PostgreSQL, and Redis:

```
[ Next.js 15 OTel SDK ]
        │ (W3C TraceContext Header: traceparent)
        ▼
[ Spring Boot OTel Agent ] ──> Generates Spans (Controller, Service, JPA, AI Client)
        │
        ▼
[ OpenTelemetry Collector ] ──> Exports Traces to Grafana Tempo / AWS X-Ray
```

---

## 2. W3C Trace Context Propagation

Every HTTP request initiated by Next.js passes standard W3C `traceparent` headers to Spring Boot:
```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

### Trace Span Hierarchy Example: Proposal Synthesis
```
Span: HTTP POST /api/v1/proposals/generate [2100ms]
 ├── Span: SpringSecurity.authenticate() [12ms]
 ├── Span: PostgreSQL.saveProposalDraft() [24ms]
 ├── Span: Redis.getPromptTemplate() [4ms]
 ├── Span: AIClient.invokeClaude35Sonnet() [1980ms]
 └── Span: PostgreSQL.updateProposalContent() [18ms]
```

---

## 3. Incident Response Playbook

### Scenario: High Latency Warning ($P_{95} > 2500\text{ms}$)
1. Open Grafana APM Dashboard and filter traces by `http.status_code=200` and `duration > 2.5s`.
2. Inspect trace span breakdown to identify if bottleneck is in Database, Redis, or External LLM API.
3. If LLM API (Claude/OpenAI) latency is high, trigger Resilience4j Circuit Breaker fallback to secondary LLM provider.
4. Notify engineering team via PagerDuty / Slack `#ops-alerts`.
