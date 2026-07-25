# Enterprise Monitoring Strategy & Metrics Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Architecture

**AgencyOS** uses a unified observability and metrics stack combining **Spring Boot Actuator**, **Micrometer**, **Prometheus**, and **Grafana Dashboards**:

```
[ Next.js 15 Frontend ] ──> PostHog / Sentry Client SDKs
                                   │
[ Spring Boot Backend ] ──> Micrometer / Actuator (/actuator/prometheus)
                                   │
[ Prometheus Server ]   ──> Scrapes /actuator/prometheus every 15s
                                   │
[ Grafana Dashboards ]  ──> Visualizes System, API, DB & AI Token Metrics
```

---

## 2. Metric Categories & Key Performance Indicators

### A. Health Check Endpoints
- `GET /actuator/health` -> System health (`UP` / `DOWN`)
- `GET /actuator/health/liveness` -> Kubernetes / ECS Liveness Probe
- `GET /actuator/health/readiness` -> Readiness Probe (DB & Redis connection check)

### B. Application Metrics (`micrometer`)
- `http_server_requests_seconds_count` -> Total API HTTP request throughput
- `http_server_requests_seconds_sum` -> Aggregate response latency
- `jvm_memory_used_bytes` -> Heap & Non-Heap JVM memory consumption
- `system_cpu_usage` -> Host CPU percentage

### C. Database Metrics (`HikariCP`)
- `hikaricp_connections_active` -> Active PostgreSQL JDBC connections
- `hikaricp_connections_idle` -> Available idle connections
- `hikaricp_connections_pending` -> Threads waiting for connection ($> 5$ triggers PagerDuty alert)

### D. AI Token & Usage Metrics (Custom Micrometer Counters)
- `agencyos_ai_tokens_consumed_total{model="claude-3-5-sonnet"}` -> Tokens consumed by Claude
- `agencyos_ai_tokens_consumed_total{model="gpt-4o"}` -> Tokens consumed by GPT-4o
- `agencyos_ai_synthesis_duration_seconds` -> Latency for proposal and contract synthesis

---

## 3. Prometheus Alerting Rules (`alerts.yml`)

```yaml
groups:
  - name: agencyos-production-alerts
    rules:
      - alert: HighAPIErrorRate
        expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100 > 2
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "API Error Rate exceeds 2% on {{ $labels.instance }}"

      - alert: HighLatencyP95
        expr: histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le)) > 2.5
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "P95 Latency is higher than 2.5 seconds"

      - alert: DatabaseConnectionExhaustion
        expr: hikaricp_connections_pending > 5
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "HikariCP pending connection pool exhaustion detected"
```
