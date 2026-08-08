# Billing Observability & Financial Metrics Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the financial metrics, Prometheus telemetry indicators, Grafana dashboards, and Alertmanager rules for monitoring SaaS billing operations.

---

## 2. Key Financial Telemetry & SRE Metrics

1. **Monthly Recurring Revenue (MRR)**: Sum of all active subscription values normalized to 30 days (`sum(agencyos_mrr_usd)`).
2. **Annual Run Rate (ARR)**: `MRR * 12`.
3. **Churn Rate**: Percentage of subscriptions transitioning to `canceled` status over 30 days.
4. **Payment Failure Rate**: Ratio of `invoice.payment_failed` to total processed invoices.
5. **Webhook Error Counter**: `rate(stripe_webhook_failures_total[5m])`.

---

## 3. Grafana Billing Dashboard Widgets & PromQL Queries

1. **Stat Panel**: Total Active MRR ($) - Query: `sum(agencyos_subscription_mrr_cents) / 100`
2. **Time Series Chart**: Subscription Count by Tier - Query: `sum(agencyos_subscriptions_active_count) by (plan_id)`
3. **Bar Chart**: Monthly Payment Success vs Failure - Query: `sum(increase(billing_payment_success_total[1d]))` vs `sum(increase(billing_payment_failed_total[1d]))`
4. **Time Series Chart**: Stripe Webhook Processing Latency P95 - Query: `histogram_quantile(0.95, sum(rate(stripe_webhook_duration_seconds_bucket[5m])) by (le))`

---

## 4. Alertmanager Rules (`billing_alerts.yml`)

```yaml
groups:
  - name: billing_alerts
    rules:
      - alert: StripeWebhookFailuresHigh
        expr: rate(stripe_webhook_failures_total[5m]) > 0
        for: 1m
        labels:
          severity: CRITICAL
        annotations:
          summary: "Stripe Webhook Processing Failures Detected"
          description: "Stripe webhook endpoint is failing to process events. Check logs and DLQ."

      - alert: PaymentFailureRateSpike
        expr: (increase(billing_payment_failed_total[1h]) / increase(billing_payment_attempts_total[1h])) * 100 > 10
        for: 15m
        labels:
          severity: HIGH
        annotations:
          summary: "High Payment Failure Rate Spike (>10%)"
          description: "Recurring payment failure rate exceeded 10% in the last hour."
```
