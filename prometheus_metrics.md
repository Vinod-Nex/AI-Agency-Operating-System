# Prometheus Metrics Catalog & PromQL Query Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Metric Catalog & PromQL Specifications

### A. HTTP API Request Metrics
- `http_server_requests_seconds_count`: Total API HTTP request counter.
  - **PromQL (RPS Throughput)**: `sum(rate(http_server_requests_seconds_count[5m])) by (uri)`
- `http_server_requests_seconds_bucket`: Latency histogram.
  - **PromQL (P95 Latency)**: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))`
- **PromQL (5xx Error Rate %)**: `sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100`

### B. Database Pool Metrics (`HikariCP`)
- `hikaricp_connections_active`: Active connections.
  - **PromQL**: `hikaricp_connections_active{pool="HikariPool-1"}`
- `hikaricp_connections_pending`: Waiting connection requests.
  - **PromQL**: `hikaricp_connections_pending{pool="HikariPool-1"}`

### C. AI Token & Usage Metrics
- `agencyos_ai_tokens_consumed_total`: Custom counter tracking tokens used.
  - **PromQL**: `sum(increase(agencyos_ai_tokens_consumed_total[1h])) by (model)`
