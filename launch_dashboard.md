# Executive Launch Dashboard & Real-Time Telemetry Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the layout, panel configurations, PromQL/Loki queries, and refresh rates for the Grafana **Executive Launch Dashboard** used by leadership during the go-live window.

---

## 2. Dashboard Layout & Widget Panel Configurations

```
+-----------------------------------------------------------------------------------+
|                        AGENCYOS LAUNCH DASHBOARD LAYOUT                           |
+-----------------------------------------------------------------------------------+
| [Panel 1: Availability %]  [Panel 2: 5xx Error Rate]  [Panel 3: P95 Latency ms]  |
| [Query: 99.98%]            [Query: 0.002%]          [Query: 84ms]              |
+-----------------------------------------------------------------------------------+
| [Panel 4: Active Users]    [Panel 5: Stripe Revenue $] [Panel 6: AI Token Spend]  |
| [Query: 412 Online]        [Query: $14,250 MRR]      [Query: 1.2M Tokens]       |
+-----------------------------------------------------------------------------------+
| [Panel 7: API RPS Time Series]                        [Panel 8: Error Logs Loki] |
| (Live HTTP Requests per Second)                       (Real-time Error Log Stream)|
+-----------------------------------------------------------------------------------+
```

---

## 3. PromQL Queries Dictionary

1. **Platform Availability %**: `(sum(rate(http_server_requests_seconds_count{status!~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))) * 100`
2. **HTTP 5xx Error Rate %**: `(sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))) * 100`
3. **API P95 Latency (ms)**: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le)) * 1000`
4. **Real-time Active Users**: `sum(agencyos_active_user_sessions)`
5. **Stripe Revenue Influx ($)**: `sum(increase(billing_payment_success_total[24h]))`
