# Enterprise Prometheus Metrics Specification & Dictionary
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Standard Metric Naming Conventions

All Prometheus metrics in AgencyOS conform to OpenTelemetry metric naming conventions:
`<namespace>_<subsystem>_<name>_<unit>`

### Metric Types Standard
- **Counter (`_total`)**: Monotonically increasing values (e.g., HTTP request count, AI tokens spent).
- **Gauge**: Instantaneous numerical measurements (e.g., Active connections, Memory usage, Queue depth).
- **Histogram (`_seconds`, `_bytes`)**: Sampled observations categorized into configurable buckets (e.g., Latency, Payload size).

### Mandatory Global Metric Labels
- `environment`: `production` | `staging` | `qa` | `dev`
- `service`: `agencyos-backend-api` | `agencyos-frontend` | `agencyos-worker`
- `instance`: Host IP / Container Pod ID
- `org_id`: Multi-tenant organization UUID (where applicable)

---

## 2. Complete Metric Dictionary

### A. Frontend Next.js & Client Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `nextjs_page_load_seconds` | Histogram | Seconds | Client page render latency | `route`, `device_type` |
| `nextjs_web_vitals_lcp_seconds` | Histogram | Seconds | Largest Contentful Paint metric | `route` |
| `nextjs_web_vitals_inp_seconds` | Histogram | Seconds | Interaction to Next Paint metric | `route` |
| `nextjs_web_vitals_cls_score` | Gauge | Ratio | Cumulative Layout Shift score | `route` |
| `nextjs_client_errors_total` | Counter | Integer | Unhandled JavaScript client errors | `error_name`, `route` |

### B. Spring Boot Backend & API Gateway Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `http_server_requests_seconds` | Histogram | Seconds | HTTP request execution duration | `method`, `uri`, `status`, `outcome` |
| `http_server_requests_total` | Counter | Requests | Total HTTP request counter | `method`, `status` |
| `jvm_memory_used_bytes` | Gauge | Bytes | JVM memory pool utilization | `area` (heap/nonheap), `id` |
| `jvm_gc_pause_seconds` | Histogram | Seconds | JVM Garbage Collector pause time | `action`, `cause` |
| `jvm_threads_live_threads` | Gauge | Threads | Active JVM thread count | `state` |
| `rate_limit_rejected_total` | Counter | Integer | Requests rejected by rate limiter | `tenant_id`, `route` |

### C. PostgreSQL Database Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `pg_stat_database_xact_commit` | Counter | Integer | Database transaction commit count | `datname` |
| `pg_stat_database_xact_rollback` | Counter | Integer | Database transaction rollback count | `datname` |
| `hikaricp_connections_active` | Gauge | Connections| Active HikariCP connection pool count| `pool` |
| `hikaricp_connections_pending` | Gauge | Threads | Threads waiting for DB connection | `pool` |
| `hikaricp_connections_timeout_total` | Counter | Integer | Connection pool timeout occurrences | `pool` |
| `pg_slow_queries_total` | Counter | Queries | Executed queries exceeding 1000ms | `query_hash` |

### D. Redis Cache & Queue Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `redis_keyspace_hits_total` | Counter | Integer | Cache lookup hit count | `db` |
| `redis_keyspace_misses_total` | Counter | Integer | Cache lookup miss count | `db` |
| `redis_memory_used_bytes` | Gauge | Bytes | Redis process memory usage | `instance` |
| `redis_evicted_keys_total` | Counter | Integer | Keys evicted due to maxmemory | `db` |
| `queue_jobs_waiting_total` | Gauge | Jobs | Pending jobs in BullMQ queue | `queue_name` |
| `queue_jobs_failed_total` | Counter | Jobs | Failed queue execution tasks | `queue_name`, `error` |

### E. AI Services & Provider Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `ai_requests_total` | Counter | Requests | AI LLM generation request count | `provider`, `model`, `status` |
| `ai_request_duration_seconds` | Histogram | Seconds | Latency of AI response stream | `provider`, `model` |
| `ai_token_usage_total` | Counter | Tokens | Tokens consumed (Prompt/Completion)| `provider`, `model`, `token_type` |
| `ai_cost_usd_total` | Counter | USD | Cumulative expenditure incurred | `provider`, `model`, `org_id` |
| `ai_fallback_trigger_total` | Counter | Triggers | Provider fallback switch counter | `from_provider`, `to_provider` |
| `ai_rate_limit_hits_total` | Counter | Integer | HTTP 429 Rate Limit responses hit | `provider` |

### F. AWS S3 & Storage Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `aws_s3_bucket_size_bytes` | Gauge | Bytes | Total S3 bucket storage footprint | `bucket_name` |
| `aws_s3_number_of_objects` | Gauge | Objects | Count of stored blobs in S3 | `bucket_name` |
| `aws_s3_requests_5xx_errors` | Counter | Errors | AWS S3 5xx internal failure count | `bucket_name`, `operation` |

### G. Security & Billing Metrics

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `auth_login_failure_total` | Counter | Integer | Failed login attempt counter | `reason`, `client_ip` |
| `security_rbac_violations_total` | Counter | Integer | Unauthorized resource access | `user_id`, `resource` |
| `billing_payment_success_total` | Counter | Integer | Successful Stripe transactions | `plan_id` |
| `billing_payment_failed_total` | Counter | Integer | Failed Stripe transactions | `failure_code` |

---

## 3. Prometheus Server Configuration (`prometheus.yml`)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "/etc/prometheus/alert.rules.yml"

scrape_configs:
  - job_name: 'opentelemetry-collector'
    static_configs:
      - targets: ['otel-collector:8889']

  - job_name: 'spring-boot-backend'
    metrics_path: '/actuator/prometheus'
    scheme: 'http'
    static_configs:
      - targets: ['backend-service:8080']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']
```
