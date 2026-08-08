# Google Workspace Integration Observability Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies telemetry indicators, Prometheus metrics, Grafana dashboard panels, and Alertmanager rules for Google Workspace API integrations, OAuth token refresh health, Pub/Sub webhook delivery, and Gmail delivery success rates.

---

## 2. Key Prometheus Metrics Dictionary

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `google_api_requests_total` | Counter | Requests | Total Google Workspace API calls | `service`, `method`, `status` |
| `google_api_latency_seconds` | Histogram | Seconds | Google API response duration | `service`, `method` |
| `google_oauth_failures_total` | Counter | Integer | Failed OAuth token refresh attempts | `reason`, `google_account_id` |
| `google_pubsub_webhooks_total` | Counter | Events | Received Pub/Sub push webhooks | `service`, `status` |
| `google_gmail_emails_sent_total` | Counter | Emails | Total emails sent via Gmail API | `org_id`, `status` |
| `google_rate_limit_hits_total` | Counter | Hits | Google API 429 QuotaExceeded errors | `service` |

---

## 3. Alertmanager Rules Catalog (`workspace_alerts.yml`)

```yaml
groups:
  - name: google_workspace_alerts
    rules:
      - alert: GoogleOAuthTokenRefreshFailed
        expr: rate(google_oauth_failures_total[5m]) > 0
        for: 2m
        labels:
          severity: CRITICAL
        annotations:
          summary: "Google Workspace OAuth Token Refresh Failed"
          description: "OAuth refresh token rotation failed. Account connection requires re-authentication."

      - alert: GoogleApiQuotaExceededSpike
        expr: rate(google_rate_limit_hits_total[5m]) > 5
        for: 5m
        labels:
          severity: HIGH
        annotations:
          summary: "Google API Quota Limit Spike"
          description: "Google Workspace API rate limits hit repeatedly. Exponential backoff engaged."
```
