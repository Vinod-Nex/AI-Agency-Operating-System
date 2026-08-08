# Jira Integration Observability & Metrics Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies telemetry indicators, Prometheus metrics, Grafana dashboard panels, and Alertmanager rules for monitoring Jira Cloud REST API integrations, OAuth token refresh cycles, sync job execution, and webhook processing.

---

## 2. Key Prometheus Metrics Dictionary

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `jira_api_requests_total` | Counter | Requests | Total HTTP calls to Jira REST API v3 | `endpoint`, `method`, `status` |
| `jira_api_latency_seconds` | Histogram | Seconds | Latency of Atlassian REST API calls | `endpoint`, `method` |
| `jira_oauth_failures_total` | Counter | Integer | Failed OAuth token refresh attempts | `reason`, `cloud_id` |
| `jira_webhook_events_total` | Counter | Events | Received Atlassian Webhooks | `event_type`, `status` |
| `jira_sync_job_duration_seconds` | Histogram | Seconds | Duration of project sync jobs | `job_type`, `status` |
| `jira_sync_items_processed_total` | Counter | Items | Total synced issues/epics | `direction`, `status` |
| `jira_rate_limit_hits_total` | Counter | Hits | HTTP 429 Rate Limit responses hit | `cloud_id` |

---

## 3. Grafana Jira Integration Dashboard Widgets

1. **Stat Panel**: Total Active Jira Connections - Query: `count(jira_connections_status{status="ACTIVE"})`
2. **Time Series Chart**: REST API Request Volume & Latency P95 - Query: `histogram_quantile(0.95, sum(rate(jira_api_latency_seconds_bucket[5m])) by (le))`
3. **Pie Chart**: Webhook Processing Status (2xx vs 4xx vs 5xx) - Query: `sum(rate(jira_webhook_events_total[5m])) by (status)`
4. **Time Series Chart**: Atlassian 429 Rate Limit Triggers - Query: `sum(rate(jira_rate_limit_hits_total[5m])) by (cloud_id)`
5. **Gauge Panel**: Active Sync Lag (Jobs > 5m) - Query: `count(jira_sync_job_duration_seconds > 300)`

---

## 4. Alertmanager Rules Catalog (`jira_alerts.yml`)

```yaml
groups:
  - name: jira_integration_alerts
    rules:
      - alert: JiraOAuthTokenRefreshFailed
        expr: rate(jira_oauth_failures_total[5m]) > 0
        for: 2m
        labels:
          severity: CRITICAL
        annotations:
          summary: "Jira OAuth Token Refresh Failed"
          description: "OAuth refresh token rotation failed. Site connection requires re-authentication."

      - alert: JiraRateLimitExceededSpike
        expr: rate(jira_rate_limit_hits_total[5m]) > 5
        for: 5m
        labels:
          severity: HIGH
        annotations:
          summary: "Atlassian API Rate Limit Spike"
          description: "Jira REST API v3 rate limits hit repeatedly. Exponential backoff engaged."
```
