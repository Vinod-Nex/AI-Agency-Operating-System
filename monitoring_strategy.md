# Production Monitoring Strategy & Metrics Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Production Monitoring Stack Matrix

AgencyOS leverages a multi-tool observability architecture configured for instant alerting, deep diagnostics, and real-time operational transparency.

| Tool Name | Tool Purpose & Functionality | Scope & Target Tier | Primary Observability Domain |
| :--- | :--- | :--- | :--- |
| **OpenTelemetry (OTel)** | Standardized vendor-neutral instrumentation & collection | All Tiers (Frontend, Backend, DB, AI) | Unified Metrics, Traces, Logs pipeline |
| **Prometheus** | High-performance Time-Series Database (TSDB) | Infrastructure, Backend, DB, Redis | Operational Metrics & Alerting Engine |
| **Grafana** | Unified Visualization & Dashboarding Engine | Operations, Executive, SRE Teams | Cross-pillar Dashboarding & Paging |
| **Sentry.io** | Error Tracking, Client Crash Reporting & Stack Traces | Frontend Next.js & Edge API Routes | Real-time JS Error Aggregation |
| **Grafana Loki** | Log Aggregation Engine with Prometheus-style indexing | All Container & Application Logs | Centralized Log Search & LogQL |
| **Grafana Tempo** | High-scale Distributed Tracing Backend | Backend, Database, AI Calls | Distributed Trace Lookup & Latency Trees |
| **AWS CloudWatch** | Cloud Infrastructure & Native Managed Service Monitoring | AWS RDS, ElastiCache, S3, IAM | Cloud Health, Storage & Network I/O |
| **Railway Metrics** | Container CPU, RAM, Network I/O metrics | Spring Boot API & Background Workers | Host Container Resource Utilization |
| **Vercel Analytics** | Edge network analytics & Core Web Vitals | Next.js Frontend App | Web Vitals (LCP, CLS, INP) & TTFB |
| **PostHog** | Product Analytics, Feature Flags & User Session Replays | Frontend Client Application | User Experience, Conversion & Session Replays |
| **Google Analytics (GA4)**| Top-of-funnel traffic & marketing funnel telemetry | Public Marketing Site & Landing Pages | Acquisition & Conversion Funnels |

---

## 2. Application Monitoring Domains (10 Components)

### 1. Frontend Component Telemetry Specification
- **Purpose**: Monitor Next.js client performance, JS error rates, and user experience.
- **Metrics Collected**: `nextjs_page_load_time_seconds`, `sentry_error_count_total`, `web_vitals_lcp_ms`, `web_vitals_inp_ms`, `web_vitals_cls_score`.
- **Alert Thresholds**: LCP > 2.5s (P3), INP > 200ms (P3), Unhandled JS Error Rate > 1% (P2).
- **Dashboard Widgets**: Web Vitals gauge panel, JS Error Rate graph, Active User Sessions heatmap.
- **Log Fields**: `browser.name`, `browser.version`, `os.name`, `url.path`, `user_agent`.
- **Trace Attributes**: `http.url`, `http.status_code`, `http.user_agent`, `next.route`.
- **Retention Policy**: Prometheus metrics 30d; Sentry errors 90d.
- **Escalation Rules**: P2 error spike -> Slack #frontend-alerts; P1 site down -> On-call PagerDuty.
- **Dependencies**: Vercel Edge Network, Sentry Browser SDK, PostHog JS SDK.

### 2. Backend Component Telemetry Specification
- **Purpose**: Track Spring Boot Java 21 microservice execution, JVM health, and application throughput.
- **Metrics Collected**: `jvm_memory_used_bytes`, `jvm_gc_pause_seconds_sum`, `http_server_requests_seconds_count`, `http_server_requests_seconds_bucket`.
- **Alert Thresholds**: JVM Heap Usage > 85% for 5m (P2), GC Pause > 500ms (P3), 5xx HTTP Rate > 1% (P1).
- **Dashboard Widgets**: JVM Heap & Non-Heap Memory usage, Thread Count graph, HTTP Throughput RPS counter.
- **Log Fields**: `logger_name`, `thread_name`, `spring.profile`, `exception.class`.
- **Trace Attributes**: `code.namespace`, `code.function`, `thread.id`, `thread.name`.
- **Retention Policy**: Prometheus 30d; Loki logs 30d.
- **Escalation Rules**: P1 5xx spike -> On-call PagerDuty; P2 JVM memory -> Dev Slack.
- **Dependencies**: Micrometer, Spring Boot Actuator, OTel Java Agent.

### 3. API Gateway Component Telemetry Specification
- **Purpose**: Ingress traffic management, rate limiting, request validation, and API routing.
- **Metrics Collected**: `http_requests_total`, `http_request_duration_seconds`, `rate_limit_rejected_total`, `jwt_auth_failures_total`.
- **Alert Thresholds**: P95 Latency > 200ms (P2), 5xx HTTP Error Rate > 0.5% (P1), Rate Limit Rejections > 100/min (P3).
- **Dashboard Widgets**: API Request Volume by Route, P95/P99 Latency Histogram, Error Rate by Status Code.
- **Log Fields**: `http.method`, `http.path`, `http.status_code`, `http.client_ip`, `http.latency_ms`.
- **Trace Attributes**: `http.request.header.x_request_id`, `http.response.status_code`.
- **Retention Policy**: Prometheus 30d; Loki logs 30d.
- **Escalation Rules**: P1 API Down -> On-call PagerDuty; P2 High Latency -> Lead Backend Engineer.
- **Dependencies**: Spring Cloud Gateway / Spring Security Filter Chain.

### 4. Database Component Telemetry Specification
- **Purpose**: PostgreSQL 16 performance monitoring, connection pool efficiency, and storage health.
- **Metrics Collected**: `pg_stat_database_xact_commit`, `pg_stat_database_xact_rollback`, `hikaricp_connections_active`, `hikaricp_connections_pending`, `pg_slow_queries_total`.
- **Alert Thresholds**: HikariCP Connection Pool Exhaustion > 90% (P1), Slow Queries (>1s) > 10/min (P2), Replication Lag > 10s (P1).
- **Dashboard Widgets**: Active vs Idle Connections gauge, Transaction Commit/Rollback RPS, Slow Query table.
- **Log Fields**: `db.statement`, `db.query_time_ms`, `db.rows_returned`, `db.connection_id`.
- **Trace Attributes**: `db.system=postgresql`, `db.name`, `db.statement.sanitized`.
- **Retention Policy**: Prometheus 30d; CloudWatch RDS metrics 90d.
- **Escalation Rules**: P1 Connection Loss -> On-call PagerDuty & Database Admin.
- **Dependencies**: PostgreSQL Exporter, HikariCP Micrometer integration.

### 5. Redis Cache Telemetry Specification
- **Purpose**: Cache performance, session state storage, and key eviction monitoring.
- **Metrics Collected**: `redis_keyspace_hits_total`, `redis_keyspace_misses_total`, `redis_memory_used_bytes`, `redis_connected_clients`, `redis_evicted_keys_total`.
- **Alert Thresholds**: Cache Hit Ratio < 75% (P3), Memory Usage > 85% (P2), Evicted Keys > 50/sec (P2).
- **Dashboard Widgets**: Cache Hit Ratio %, Memory Usage vs MaxMemory gauge, Client Connections count.
- **Log Fields**: `redis.command`, `redis.key_prefix`, `redis.latency_ms`.
- **Trace Attributes**: `db.system=redis`, `db.operation`, `db.redis.key`.
- **Retention Policy**: Prometheus 30d.
- **Escalation Rules**: P2 Memory High -> Slack #infra-alerts; P1 Redis Down -> On-call PagerDuty.
- **Dependencies**: Redis Exporter, Spring Data Redis.

### 6. Queues Telemetry Specification
- **Purpose**: BullMQ / Redis Streams async job queue tracking, backlog monitoring, and retry tracking.
- **Metrics Collected**: `queue_jobs_waiting_total`, `queue_jobs_active_total`, `queue_jobs_failed_total`, `queue_job_duration_seconds`.
- **Alert Thresholds**: Queue Backlog > 500 jobs for 10m (P2), Job Failure Rate > 5% (P1).
- **Dashboard Widgets**: Queue Backlog Depth graph, Job Execution Rate vs Processing Duration histogram.
- **Log Fields**: `queue.name`, `job.id`, `job.name`, `job.attempt`, `job.error`.
- **Trace Attributes**: `messaging.system=redis_streams`, `messaging.destination`, `messaging.message_id`.
- **Retention Policy**: Prometheus 30d; Loki logs 30d.
- **Escalation Rules**: P1 High Job Failure -> On-call Backend Engineer.
- **Dependencies**: BullMQ Prometheus Metrics, Spring AMQP / Redis listener.

### 7. Background Workers Telemetry Specification
- **Purpose**: Asynchronous task processing (proposal PDF rendering, contract PDF generation, meeting transcript processing).
- **Metrics Collected**: `worker_tasks_processed_total`, `worker_task_duration_seconds`, `worker_cpu_utilization_ratio`, `worker_memory_used_bytes`.
- **Alert Thresholds**: Worker CPU > 90% (P2), Worker Out-Of-Memory Error > 0 (P1).
- **Dashboard Widgets**: Active Worker Nodes count, Task Throughput by Type, Execution Latency P95.
- **Log Fields**: `worker.id`, `worker.task_type`, `worker.execution_time_ms`.
- **Trace Attributes**: `worker.job_type`, `worker.node_id`.
- **Retention Policy**: Prometheus 30d; Loki logs 30d.
- **Escalation Rules**: P1 Worker Crash Loop -> On-call PagerDuty.
- **Dependencies**: Railway Worker Instances / AWS ECS Tasks.

### 8. AI Services Telemetry Specification
- **Purpose**: Monitoring OpenAI, Anthropic Claude, and Google Gemini API usage, latency, cost, and rate limits.
- **Metrics Collected**: `ai_requests_total`, `ai_request_duration_seconds`, `ai_token_usage_total`, `ai_cost_usd_total`, `ai_fallback_trigger_total`, `ai_rate_limit_hits_total`.
- **Alert Thresholds**: AI Provider Error Rate > 5% (P1), P95 AI Latency > 10s (P2), Monthly Cost > Budget Soft Limit (P2).
- **Dashboard Widgets**: AI Request Volume by Provider, Token Consumption Stacked Bar, Real-time Cost Tracker, Provider Latency Comparison.
- **Log Fields**: `ai.provider`, `ai.model`, `ai.prompt_tokens`, `ai.completion_tokens`, `ai.cost_usd`, `ai.fallback_used`.
- **Trace Attributes**: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.prompt_tokens`, `gen_ai.usage.completion_tokens`.
- **Retention Policy**: Prometheus 90d (Cost metrics preserved long-term); Loki logs 30d.
- **Escalation Rules**: P1 All AI Providers Down -> On-call PagerDuty; P2 Cost Anomaly -> Engineering Manager & Finance.
- **Dependencies**: Custom AI Gateway Client, Micrometer.

### 9. Storage (AWS S3) Telemetry Specification
- **Purpose**: S3 bucket object storage health, upload/download latency, and bucket size tracking.
- **Metrics Collected**: `aws_s3_bucket_size_bytes`, `aws_s3_number_of_objects`, `aws_s3_requests_4xx_errors`, `aws_s3_requests_5xx_errors`.
- **Alert Thresholds**: S3 5xx Error Count > 10/min (P1), S3 4xx Access Denied > 50/min (P2).
- **Dashboard Widgets**: Storage Volume Growth (GB), Object Count by Category, S3 API Latency P95.
- **Log Fields**: `s3.bucket`, `s3.key`, `s3.operation`, `s3.http_status`, `s3.error_code`.
- **Trace Attributes**: `aws.service=s3`, `aws.operation`, `rpc.method`.
- **Retention Policy**: CloudWatch metrics 90d.
- **Escalation Rules**: P1 Storage Outage -> On-call PagerDuty.
- **Dependencies**: AWS CloudWatch S3 Metrics exporter, AWS CloudTrail.

### 10. Authentication & Billing Telemetry Specification
- **Purpose**: User access security tracking and Stripe subscription billing health.
- **Metrics Collected**: `auth_login_success_total`, `auth_login_failure_total`, `billing_stripe_webhook_events_total`, `billing_payment_failed_total`.
- **Alert Thresholds**: Failed Logins > 50/min (P1 Security Alert), Stripe Webhook Failures > 0 (P1).
- **Dashboard Widgets**: Authentication Volume & Failure Rate, Stripe Webhook Status, Revenue Influx.
- **Log Fields**: `auth.method`, `auth.status`, `billing.event_type`, `payment.amount`.
- **Trace Attributes**: `auth.domain`, `billing.stripe_event_id`.
- **Retention Policy**: Prometheus 90d; Audit logs 7 years.
- **Escalation Rules**: P1 Webhook Failure -> On-call Billing Lead.
- **Dependencies**: Spring Security, Stripe Webhook Listener SDK.

---

## 3. Executive Business Metrics Dashboards (14 Core Dashboards)

AgencyOS translates technical metrics into 14 key business intelligence metrics:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AGENCYOS BUSINESS METRICS (14)                       │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ 1. DAU            │ 6. Invoices       │ 11. AI Requests                 │
│ 2. MAU            │ 7. Revenue (ARR)  │ 12. Token Usage                 │
│ 3. Organizations  │ 8. Proposals      │ 13. AI Cost Tracking            │
│ 4. Clients        │ 9. Contracts      │ 14. Subscription Usage          │
│ 5. Projects       │ 10. Meeting Mins  │                                 │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

1. **Daily Active Users (DAU)**: Unique authenticated user count within 24-hour windows (`count(distinct user_id)`).
2. **Monthly Active Users (MAU)**: Unique active users over rolling 30-day periods.
3. **Active Organizations**: Total active multi-tenant organization accounts (`count(org_id)` where status=ACTIVE).
4. **Client CRM Count**: Total client accounts managed across all agency workspaces.
5. **Active Projects**: Total agency projects actively producing deliverables.
6. **Invoices Generated**: Total invoices generated and dispatched via Stripe/Billing Engine.
7. **Gross Revenue (ARR/MRR)**: Monthly Recurring Revenue aggregated from active Stripe subscriptions.
8. **Proposal Generation Count**: Volume of AI-generated client proposals.
9. **Contract Generation Count**: Volume of legal contracts compiled and dispatched for signature.
10. **Meeting Minutes Processed**: Audio hours/minutes transcribed and summarized by the AI engine.
11. **Total AI Requests**: Total execution count of LLM prompts across all models.
12. **Token Usage Aggregation**: Sum of Prompt + Completion tokens across OpenAI, Anthropic, and Gemini.
13. **AI Cost Tracking**: USD expenditure incurred from third-party AI provider APIs.
14. **Subscription Quota Usage**: Percentage of plan quota consumed per tenant organization.
