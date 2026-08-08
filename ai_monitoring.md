# AI Observability, Telemetry & Dashboard Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies telemetry indicators, Prometheus metrics, Grafana AI Dashboard panel queries, and Alertmanager rules for OpenAI and Google Gemini integration health, token consumption, expenditure, and fallback events.

---

## 2. Key Prometheus Metrics Dictionary

| Metric Name | Type | Unit | Description | Labels |
| :--- | :--- | :--- | :--- | :--- |
| `ai_requests_total` | Counter | Requests | Total AI generation requests | `provider`, `model`, `status` |
| `ai_request_duration_seconds` | Histogram | Seconds | Total generation execution time | `provider`, `model` |
| `ai_ttft_seconds` | Histogram | Seconds | Time-To-First-Token stream latency | `provider`, `model` |
| `ai_token_usage_total` | Counter | Tokens | Tokens consumed | `provider`, `model`, `token_type` |
| `ai_cost_usd_total` | Counter | USD | Total expenditure incurred | `provider`, `model`, `org_id` |
| `ai_fallback_trigger_total` | Counter | Triggers | Provider fallback switches | `from_provider`, `to_provider` |
| `ai_rate_limit_hits_total` | Counter | Hits | HTTP 429 Rate Limit responses | `provider` |

---

## 3. Grafana AI Dashboard Panel Queries

1. **Stat Panel**: Real-Time AI Expenditure Today ($) - Query: `sum(increase(ai_cost_usd_total[24h]))`
2. **Time Series Chart**: Time-To-First-Token (TTFT) P95 Latency - Query: `histogram_quantile(0.95, sum(rate(ai_ttft_seconds_bucket[5m])) by (le, provider))`
3. **Stacked Bar Chart**: Token Usage by Provider (OpenAI vs Gemini) - Query: `sum(increase(ai_token_usage_total[1h])) by (provider, token_type)`
4. **Time Series Chart**: Fallback Triggers Count - Query: `sum(rate(ai_fallback_trigger_total[5m])) by (from_provider, to_provider)`

---

## 4. Alertmanager Rules Catalog (`ai_alerts.yml`)

```yaml
groups:
  - name: ai_integration_alerts
    rules:
      - alert: PrimaryAIProviderOutage
        expr: (sum(rate(ai_requests_total{status="error"}[5m])) / sum(rate(ai_requests_total[5m]))) * 100 > 10
        for: 3m
        labels:
          severity: CRITICAL
        annotations:
          summary: "Primary AI Provider Error Rate High (>10%)"
          description: "High error rate detected on primary LLM provider. Circuit breaker engaging fallback."

      - alert: AICostAnomalyDetected
        expr: sum(increase(ai_cost_usd_total[1h])) > 100
        for: 5m
        labels:
          severity: HIGH
        annotations:
          summary: "AI Expenditure Anomaly Spike"
          description: "AI API costs exceeded $100 in the last hour. Inspect token usage ledger."
```
