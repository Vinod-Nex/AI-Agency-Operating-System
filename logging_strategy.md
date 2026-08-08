# Enterprise Logging Strategy & Standards
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & JSON Schema Standard

All log events across AgencyOS components must be produced in **Structured JSON Lines format**. Human-readable plain text logging is strictly prohibited in non-local environments to allow deterministic indexing by Grafana Loki and AWS CloudWatch Logs.

### Core Log Schema Definition (`agencyos-log-v1.json`)

```json
{
  "@timestamp": "2026-07-25T21:15:30.124Z",
  "log.level": "INFO",
  "service.name": "agencyos-backend-api",
  "service.version": "1.4.2",
  "environment": "production",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "request_id": "req-98b42c12-32fa-400a-bdf8-921312389a",
  "tenant": {
    "org_id": "org_99182371-2391-4a11-82bf-112233445566",
    "workspace_id": "ws_77112233-4455-6677-8899-aabbccddeeff",
    "user_id": "usr_33445566-7788-9900-aabb-ccddeeff0011"
  },
  "log.category": "AI_GATEWAY",
  "message": "AI generation request completed successfully",
  "http": {
    "method": "POST",
    "url": "/api/v1/proposals/generate",
    "status_code": 200,
    "client_ip": "198.51.100.45",
    "user_agent": "Mozilla/5.0..."
  },
  "ai": {
    "provider": "Anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "prompt_tokens": 1250,
    "completion_tokens": 480,
    "total_tokens": 1730,
    "latency_ms": 842.50,
    "cost_usd": 0.01095
  },
  "exception": null
}
```

---

## 2. Log Severity Levels Hierarchy

AgencyOS defines strict semantics for the six standard log levels:

| Log Level | Operational Definition | Production Usage Guidelines | Paging Action |
| :--- | :--- | :--- | :--- |
| **FATAL** | System-wide failure; process cannot continue running (e.g., Unrecoverable DB connection loss, KMS key loss). | Immediate application crash or daemon exit. | Triggers P1 PagerDuty Page |
| **ERROR** | Operation or request failed; customer impact occurred but service process remains active. | Exceptions, 5xx HTTP responses, DB transaction rollbacks, AI provider timeouts after retries. | Triggers P2 Alert if rate threshold breached |
| **WARN** | Unexpected condition handled gracefully; high risk of future error if ignored. | Rate-limit approaching (85%), fallback AI provider triggered, slow query detected (>500ms), circuit breaker opened. | Logged to Loki, Slack notification |
| **INFO** | Business-significant state transition or lifecycle milestone. | User authenticated, proposal generated, invoice paid, background job started/completed. | Logged to Loki for audit & analytics |
| **DEBUG** | Detailed diagnostic data required during development or active troubleshooting. | SQL parameter binding, HTTP request payload metadata, intermediate state calculations. | Disabled in Production (Enabled via actuator flag) |
| **TRACE** | Fine-grained internal flow inspection. | Individual byte transfers, raw socket events, token streaming chunks. | Strictly prohibited in Production |

---

## 3. Mandatory Context & Correlation IDs

Every log entry must carry context variables injected via SLF4J MDC (Mapped Diagnostic Context) in Spring Boot or AsyncLocalStorage in Next.js:

1. **`trace_id`**: OpenTelemetry 32-character hex trace identifier.
2. **`span_id`**: OpenTelemetry 16-character hex span identifier.
3. **`request_id`**: Ingress API Gateway unique HTTP request ID (`X-Request-ID`).
4. **`user_id`**: UUID of the authenticated actor (`sub` claim).
5. **`org_id`**: Organization UUID enforcing multi-tenant isolation.
6. **`workspace_id`**: Active workspace scope ID.

---

## 4. Comprehensive Log Categories (15 Domains)

AgencyOS segregates operational logs into 15 specific categories via `"log.category"`:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      AGENCYOS LOG CATEGORIES (15)                       │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ 1. Application    │ 6. Database       │ 11. Webhook                     │
│ 2. API Ingress    │ 7. Migration      │ 12. Third-Party Integration     │
│ 3. Authentication │ 8. AI Engine      │ 13. Background Worker           │
│ 4. Audit Trail    │ 9. Billing        │ 14. Infrastructure              │
│ 5. Security       │ 10. Payment       │ 15. Deployment & Release        │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

### Detailed Category Definitions

#### 1. Application Logs (`APPLICATION`)
- **Purpose**: Internal business logic execution, component lifecycle, domain event emission.
- **Key Fields**: `component`, `event_name`, `domain_entity_id`, `execution_time_ms`.

#### 2. API Logs (`API`)
- **Purpose**: Ingress and egress HTTP request/response tracking.
- **Key Fields**: `http.method`, `http.url`, `http.status_code`, `http.latency_ms`, `http.response_size_bytes`.

#### 3. Authentication Logs (`AUTHENTICATION`)
- **Purpose**: User login attempts, MFA challenges, token refreshes, OAuth callbacks.
- **Key Fields**: `auth.method`, `auth.status`, `auth.fail_reason`, `user_email_hash`, `client_ip`.

#### 4. Audit Logs (`AUDIT`)
- **Purpose**: Compliance tracking of resource mutations (Create, Update, Delete).
- **Key Fields**: `action`, `resource_type`, `resource_id`, `changes_diff`, `actor_id`.

#### 5. Security Logs (`SECURITY`)
- **Purpose**: Threat events, RBAC authorization denials, rate limit violations, SQL injection attempts.
- **Key Fields**: `threat_type`, `rule_id`, `signature`, `client_ip`, `target_endpoint`.

#### 6. Database Logs (`DATABASE`)
- **Purpose**: Relational query performance, connection pool state, deadlocks, slow queries.
- **Key Fields**: `db.query_template`, `db.duration_ms`, `db.rows_affected`, `db.pool_active_connections`.

#### 7. Migration Logs (`MIGRATION`)
- **Purpose**: Flyway database schema evolution execution.
- **Key Fields**: `flyway.version`, `flyway.script_name`, `flyway.execution_time_ms`, `flyway.status`.

#### 8. AI Logs (`AI_ENGINE`)
- **Purpose**: Prompt execution, token usage, LLM cost, response latency, provider fallbacks.
- **Key Fields**: `ai.provider`, `ai.model`, `ai.prompt_tokens`, `ai.completion_tokens`, `ai.cost_usd`, `ai.fallback_used`.

#### 9. Billing Logs (`BILLING`)
- **Purpose**: Subscription changes, quota consumption, plan upgrades/downgrades.
- **Key Fields**: `billing.plan_id`, `billing.cycle`, `quota.used`, `quota.limit`.

#### 10. Payment Logs (`PAYMENT`)
- **Purpose**: Stripe payment intent lifecycle, invoice processing, payout events.
- **Key Fields**: `payment.gateway`, `payment.transaction_id`, `payment.amount_cents`, `payment.currency`, `payment.status`.

#### 11. Webhook Logs (`WEBHOOK`)
- **Purpose**: Inbound and outbound webhook delivery attempts, retries, and payloads.
- **Key Fields**: `webhook.id`, `webhook.event_type`, `webhook.target_url`, `webhook.response_code`, `webhook.attempt`.

#### 12. Integration Logs (`INTEGRATION`)
- **Purpose**: Third-party external API communication (Slack, Hubspot, Google Calendar).
- **Key Fields**: `integration.partner`, `integration.endpoint`, `integration.latency_ms`, `integration.status`.

#### 13. Background Job Logs (`BACKGROUND_JOB`)
- **Purpose**: Queue processing via BullMQ / Spring `@Scheduled` / Redis Streams.
- **Key Fields**: `job.id`, `job.queue_name`, `job.handler`, `job.duration_ms`, `job.retry_count`.

#### 14. Infrastructure Logs (`INFRASTRUCTURE`)
- **Purpose**: Container runtime, AWS S3 object storage events, OS resource warnings.
- **Key Fields**: `infra.provider`, `infra.resource_id`, `infra.region`, `infra.event`.

#### 15. Deployment Logs (`DEPLOYMENT`)
- **Purpose**: Railway build pipelines, Vercel edge deployments, rolling updates.
- **Key Fields**: `deploy.id`, `deploy.commit_sha`, `deploy.environment`, `deploy.status`.

---

## 5. Log Component Telemetry Specification Standard

For every component emitting logs, SRE teams enforce the following standard schema properties:

```yaml
standard_log_component_definition:
  purpose: "Provide structured, searchable, contextual event streams for troubleshooting and security auditing."
  log_fields:
    - timestamp (ISO-8601 UTC)
    - log.level (TRACE..FATAL)
    - service.name & version
    - environment (production|staging|qa|dev)
    - trace_id, span_id, request_id
    - tenant.org_id, workspace_id, user_id
    - log.category (1 of 15)
    - message (human readable summary)
    - contextual payload object (HTTP, AI, DB, Auth)
  retention_policy:
    dev_qa: 7 days
    staging: 14 days
    production_app: 30 days hot Loki
    production_audit: 7 years AWS S3 Glacier Object Lock
  dependencies:
    - Logback Logstash Encoder / Winston JSON Formatter
    - OpenTelemetry MDC Context Adapter
    - Grafana Promtail / Loki Ingestion Gateway
