# Prometheus & Grafana Alerting Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Alert Severity Matrix & Notification Escalation

| Severity | Incident Level | Response Time SLA | Primary Channel | PagerDuty Escalation |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Entire API down, DB un-reachable, Data Corruption | $< 5$ Minutes | PagerDuty Phone Call & Slack `#ops-critical` | Auto-escalate after 5m |
| **SEV-2 (High)** | High Error Rate ($> 2\%$), AI Provider Outage, High Latency ($P_{95} > 2.5\text{s}$) | $< 15$ Minutes | Slack `#ops-high` & PagerDuty SMS | Auto-escalate after 15m |
| **SEV-3 (Moderate)**| Elevated Disk Usage ($> 80\%$), Non-critical job failure | $< 2$ Hours | Slack `#ops-warnings` | None |
| **SEV-4 (Low)** | Non-blocking warning, minor rate limit spike | $< 24$ Hours | Slack `#ops-info` | None |

---

## 2. Prometheus Alerting Rules (`prometheus-alerts.yml`)

```yaml
groups:
  - name: AgencyOS-Alerts
    rules:
      - alert: APIHighErrorRate
        expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100 > 1.0
        for: 2m
        labels:
          severity: SEV-2
        annotations:
          summary: "High HTTP 5xx error rate detected (> 1.0%)"
          description: "API 5xx error rate is currently {{ $value }}% on production."
```
