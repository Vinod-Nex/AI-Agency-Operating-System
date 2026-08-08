# Distributed Tracing Architecture & OpenTelemetry Propagation Standard
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details distributed trace propagation, OpenTelemetry span naming conventions, W3C TraceContext standards, and end-to-end execution path instrumentation across AgencyOS.

---

## 2. Distributed Tracing Flow Across Boundaries

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Web Browser
    participant FE as Next.js 15 SSR / Edge
    participant BE as Spring Boot Backend API
    participant DB as PostgreSQL 16
    participant Redis as Redis Cache
    participant AI as OpenAI / Claude API

    User->>FE: Trigger Proposal Generation
    Note over FE: Injects W3C TraceParent: 00-4bf92f35...-00f067aa...-01
    FE->>BE: POST /api/v1/proposals/generate (HTTP Header: traceparent)
    
    Note over BE: OpenTelemetry Agent extracts TraceContext & Binds to SLF4J MDC
    
    BE->>Redis: GET cache:org:9918 (Child Span: redis.get)
    Redis-->>BE: Cache Miss
    
    BE->>DB: SELECT * FROM organizations WHERE id = ? (Child Span: db.query)
    DB-->>BE: Organization Data
    
    BE->>AI: POST /v1/chat/completions (Child Span: gen_ai.chat)
    Note over BE,AI: Custom Span Tags: gen_ai.system=openai, gen_ai.model=gpt-4o
    AI-->>BE: Streaming LLM Response
    
    BE-->>FE: HTTP 200 OK (Header: traceresponse)
    FE-->>User: Render Proposal Output
```

---

## 3. Span Naming Conventions

All OpenTelemetry spans generated within AgencyOS must follow standardized operation name patterns:

- **HTTP Requests (Server)**: `HTTP {METHOD} {route_template}` (e.g. `HTTP POST /api/v1/proposals/generate`)
- **HTTP Client (Egress)**: `HTTP {METHOD}` (e.g. `HTTP POST https://api.openai.com`)
- **Database Spans**: `DB {operation} {table_name}` (e.g. `DB SELECT proposals`)
- **Redis Cache Spans**: `REDIS {command} {key_prefix}` (e.g. `REDIS GET cache:org`)
- **AI LLM Spans**: `GEN_AI {provider} {model}` (e.g. `GEN_AI Anthropic claude-3-5-sonnet`)
- **Background Worker Spans**: `JOB {queue_name} {handler}` (e.g. `JOB proposals-queue ProposalRenderHandler`)

---

## 4. Sampling Strategy & Retention

- **Tail-Based Sampling Policy**:
  - 100% of Traces containing `ERROR` span statuses are retained.
  - 100% of Traces with duration > 1,000ms are retained.
  - 10% Probabilistic Sampling applied to standard 2xx HTTP requests under 200ms.
- **Backend Collector Exporter**: Exported via OTLP gRPC to **Grafana Tempo**.
- **Retention Period**: 7 Days in Grafana Tempo; 30 Days archived to AWS S3.
