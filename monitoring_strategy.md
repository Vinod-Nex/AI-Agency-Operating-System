# Observability, Prometheus & Grafana Monitoring Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Monitoring Stack Architecture

```
[ Frontend / Next.js ] ──> Sentry (Errors) / PostHog (Analytics)
                                 │
[ Backend / Spring Boot ] ──> Micrometer -> Prometheus (/actuator/prometheus)
                                 │
[ AWS CloudWatch ]       ──> ECS & RDS Infrastructure Metrics
                                 │
[ Grafana Dashboards ]   ──> Unified APM & PagerDuty Alerting
```

---

## 2. Key Monitoring Metric SLAs

| Category | Metric Name | Target SLA | Critical Threshold |
| :--- | :--- | :--- | :--- |
| **API Availability** | `http_server_requests_seconds_count` | $99.95\%$ Uptime | Error Rate $> 1.0\%$ |
| **P95 API Latency** | `http_server_requests_seconds_bucket` | $< 150\text{ms}$ | Latency $> 2.5\text{s}$ |
| **HikariCP Connections** | `hikaricp_connections_pending` | $0$ Pending | Pending Connections $> 5$ |
| **AI Token Usage** | `agencyos_ai_tokens_consumed_total` | Monitored | Usage $> 90\%$ quota |
