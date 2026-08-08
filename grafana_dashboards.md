# Production Grafana Dashboards Specification
## AI Agency Operating System (AgencyOS)

---

## Overview

AgencyOS provides 8 standardized production Grafana dashboards. All dashboards are defined using Grafana JSON model schemas and query Prometheus, Grafana Loki, and Grafana Tempo data sources.

---

## 1. Executive Dashboard

- **Purpose**: High-level platform health, revenue metrics, active tenants, and AI operational spend for C-level executives and Engineering VP.
- **Metrics Collected**: `agencyos_active_orgs`, `agencyos_mrr_usd`, `agencyos_dau`, `ai_cost_usd_total`, `http_server_requests_seconds_count`.
- **Alert Thresholds**: Platform Availability < 99.9% (P1), Daily AI Cost > $500 (P2).
- **Dashboard Widgets**:
  1. **Stat Panel**: Monthly Recurring Revenue (MRR) - Query: `sum(agencyos_mrr_usd)`
  2. **Stat Panel**: Daily Active Users (DAU) - Query: `sum(agencyos_dau)`
  3. **Gauge Panel**: Overall Platform Availability % - Query: `(sum(rate(http_server_requests_seconds_count{status!~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))) * 100`
  4. **Time Series Chart**: AI Expenditure Trend (USD) - Query: `sum(increase(ai_cost_usd_total[1d])) by (provider)`
  5. **Bar Chart**: Generated Assets (Proposals, Contracts, Invoices) - Query: `sum(increase(agencyos_generated_assets_total[1d])) by (asset_type)`
- **Log Fields**: `log.category="BILLING"`, `log.category="APPLICATION"`.
- **Trace Attributes**: `tenant.org_id`, `http.status_code`.
- **Retention Policy**: Prometheus 90 days.
- **Escalation Rules**: Availability drops below 99.9% -> Alertmanager P1 to On-Call & VP Eng.
- **Dependencies**: Spring Boot Business Metrics Collector, Stripe API Sync Daemon.

---

## 2. Operations Dashboard

- **Purpose**: Real-time SRE platform overview, container CPU/RAM, thread counts, JVM garbage collection, and pod statuses.
- **Metrics Collected**: `jvm_memory_used_bytes`, `jvm_threads_live_threads`, `process_cpu_usage`, `container_memory_working_set_bytes`.
- **Alert Thresholds**: CPU Utilization > 85% for 10m (P2), Memory Usage > 90% (P1).
- **Dashboard Widgets**:
  1. **Time Series Chart**: CPU Utilization per Microservice Container - Query: `sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)`
  2. **Time Series Chart**: JVM Heap Memory Usage - Query: `jvm_memory_used_bytes{area="heap"}`
  3. **Heatmap**: JVM GC Pause Duration - Query: `rate(jvm_gc_pause_seconds_sum[5m])`
  4. **Stat Panel**: Total Active Threads - Query: `sum(jvm_threads_live_threads)`
- **Log Fields**: `log.level="ERROR"`, `service.name`, `environment="production"`.
- **Trace Attributes**: `thread.id`, `thread.name`.
- **Retention Policy**: Prometheus 30 days.
- **Escalation Rules**: Memory > 90% -> Alertmanager P1 to Infrastructure On-call.
- **Dependencies**: cAdvisor / Railway Container Metrics, Spring Boot Actuator JVM.

---

## 3. API Dashboard

- **Purpose**: API Gateway and REST endpoint throughput, latency breakdown, status code distribution, and rate-limiting metrics.
- **Metrics Collected**: `http_server_requests_seconds_count`, `http_server_requests_seconds_sum`, `rate_limit_rejected_total`.
- **Alert Thresholds**: 5xx HTTP Error Rate > 1% (P1), P95 Latency > 300ms (P2).
- **Dashboard Widgets**:
  1. **Time Series Chart**: Ingress Request Throughput (RPS) by Endpoint - Query: `sum(rate(http_server_requests_seconds_count[1m])) by (uri)`
  2. **Time Series Chart**: P50, P95, P99 Latency - Query: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))`
  3. **Pie Chart**: HTTP Status Code Distribution (2xx vs 4xx vs 5xx) - Query: `sum(rate(http_server_requests_seconds_count[5m])) by (status)`
  4. **Time Series Chart**: Rate Limit Rejections - Query: `sum(rate(rate_limit_rejected_total[1m])) by (tenant_id)`
- **Log Fields**: `http.method`, `http.url`, `http.status_code`, `http.latency_ms`.
- **Trace Attributes**: `http.target`, `http.status_code`, `http.route`.
- **Retention Policy**: Prometheus 30 days; Loki 30 days.
- **Escalation Rules**: 5xx > 1% -> Alertmanager P1 to Backend On-call.
- **Dependencies**: Spring Boot Micrometer Web MVC Filters, Spring Security.

---

## 4. Database Dashboard

- **Purpose**: PostgreSQL query performance, connection pool saturation, deadlocks, and disk space tracking.
- **Metrics Collected**: `pg_stat_database_xact_commit`, `hikaricp_connections_active`, `pg_slow_queries_total`, `pg_stat_database_deadlocks`.
- **Alert Thresholds**: HikariCP Pool Saturation > 90% (P1), Deadlocks > 0 (P2).
- **Dashboard Widgets**:
  1. **Time Series Chart**: Active vs Idle HikariCP Connections - Query: `hikaricp_connections_active` vs `hikaricp_connections_idle`
  2. **Time Series Chart**: Transaction Commit & Rollback Rate - Query: `rate(pg_stat_database_xact_commit[5m])`
  3. **Table Panel**: Slowest Executing SQL Queries - Query: `topk(10, rate(pg_slow_queries_duration_sum[15m]))`
  4. **Stat Panel**: Database Deadlock Count - Query: `increase(pg_stat_database_deadlocks[1h])`
- **Log Fields**: `log.category="DATABASE"`, `db.statement`, `db.query_time_ms`.
- **Trace Attributes**: `db.system=postgresql`, `db.statement`.
- **Retention Policy**: Prometheus 30 days.
- **Escalation Rules**: Active Connections > 90% -> Alertmanager P1 to Database Administrator.
- **Dependencies**: PostgreSQL Exporter, HikariCP Micrometer Exporter.

---

## 5. AI Engine Dashboard

- **Purpose**: Monitor multi-model AI requests (OpenAI, Claude, Gemini), latency, token consumption, cost, and fallback rates.
- **Metrics Collected**: `ai_requests_total`, `ai_token_usage_total`, `ai_cost_usd_total`, `ai_fallback_trigger_total`, `ai_request_duration_seconds`.
- **Alert Thresholds**: AI Provider Error Rate > 5% (P1), P95 AI Latency > 8s (P2).
- **Dashboard Widgets**:
  1. **Time Series Chart**: Request RPS by AI Provider (OpenAI vs Claude vs Gemini) - Query: `sum(rate(ai_requests_total[5m])) by (provider)`
  2. **Stacked Bar Chart**: Token Consumption (Prompt vs Completion) - Query: `sum(increase(ai_token_usage_total[1h])) by (type, provider)`
  3. **Time Series Chart**: P95 Time-to-First-Token (TTFT) Latency - Query: `histogram_quantile(0.95, sum(rate(ai_request_duration_seconds_bucket[5m])) by (le, provider))`
  4. **Stat Panel**: Real-Time AI Expenditure Today (USD) - Query: `sum(increase(ai_cost_usd_total[24h]))`
  5. **Time Series Chart**: Automatic Provider Fallback Triggers - Query: `sum(rate(ai_fallback_trigger_total[5m])) by (from_provider, to_provider)`
- **Log Fields**: `log.category="AI_ENGINE"`, `ai.provider`, `ai.model`, `ai.prompt_tokens`, `ai.cost_usd`.
- **Trace Attributes**: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.total_tokens`.
- **Retention Policy**: Prometheus 90 days.
- **Escalation Rules**: Error Rate > 5% -> P1 to AI Gateway Engineer.
- **Dependencies**: Custom AI Gateway Micrometer Metrics.

---

## 6. Billing Dashboard

- **Purpose**: Track Stripe webhook processing, subscription state, invoice generation, and revenue collection.
- **Metrics Collected**: `billing_payment_success_total`, `billing_payment_failed_total`, `billing_stripe_webhook_latency_seconds`.
- **Alert Thresholds**: Failed Payments > 5 in 1h (P2), Stripe Webhook Failures > 0 (P1).
- **Dashboard Widgets**:
  1. **Stat Panel**: Successful Payments Today - Query: `sum(increase(billing_payment_success_total[24h]))`
  2. **Time Series Chart**: Payment Failures by Reason - Query: `sum(increase(billing_payment_failed_total[1h])) by (failure_reason)`
  3. **Time Series Chart**: Stripe Webhook Processing Latency P95 - Query: `histogram_quantile(0.95, sum(rate(billing_stripe_webhook_latency_seconds_bucket[5m])) by (le))`
- **Log Fields**: `log.category="BILLING"`, `log.category="PAYMENT"`, `payment.transaction_id`.
- **Trace Attributes**: `billing.stripe_event_id`, `payment.amount_cents`.
- **Retention Policy**: Prometheus 90 days; Loki logs 7 years.
- **Escalation Rules**: Webhook failure > 0 -> P1 to Billing Team Lead.
- **Dependencies**: Stripe Webhook Listener, Spring Boot Micrometer.

---

## 7. Security Dashboard

- **Purpose**: Real-time security incident response, authentication failure spikes, RBAC violations, and rate-limiting abuse.
- **Metrics Collected**: `auth_login_failure_total`, `security_rbac_violations_total`, `jwt_validation_failures_total`.
- **Alert Thresholds**: Failed Logins > 20/min from single IP (P1), RBAC Violations > 10/min (P1).
- **Dashboard Widgets**:
  1. **Time Series Chart**: Failed Login Attempts by IP / Country - Query: `sum(rate(auth_login_failure_total[5m])) by (client_ip)`
  2. **Time Series Chart**: Invalid JWT / Unauthorized Tokens - Query: `sum(rate(jwt_validation_failures_total[5m]))`
  3. **Table Panel**: Recent RBAC Access Violation Log Stream (Loki Query) - Query: `{app="agencyos-backend"} |= "RBAC_VIOLATION"`
- **Log Fields**: `log.category="SECURITY"`, `threat_type`, `client_ip`, `user_email_hash`.
- **Trace Attributes**: `security.rule_id`, `security.actor_id`.
- **Retention Policy**: Prometheus 90 days; Loki audit logs 7 years.
- **Escalation Rules**: Brute-force trigger -> P1 to Security Operations Center (SOC).
- **Dependencies**: Spring Security, Web Application Firewall (WAF), Loki.

---

## 8. Infrastructure Dashboard

- **Purpose**: Physical infrastructure resource health (AWS ECS, S3, Redis ElastiCache, PostgreSQL RDS).
- **Metrics Collected**: `aws_rds_cpuutilization`, `aws_elasticache_cpuutilization`, `aws_s3_bucket_size_bytes`, `container_network_receive_bytes_total`.
- **Alert Thresholds**: RDS CPU > 80% (P2), ElastiCache Memory > 85% (P2), S3 5xx Errors > 5/min (P1).
- **Dashboard Widgets**:
  1. **Time Series Chart**: AWS RDS PostgreSQL CPU & IOPS Utilization - Query: `aws_rds_cpuutilization`
  2. **Time Series Chart**: AWS ElastiCache Redis Memory Utilization - Query: `aws_elasticache_database_memory_usage_percentage`
  3. **Time Series Chart**: AWS S3 Storage Growth (GB) - Query: `aws_s3_bucket_size_bytes / 1024 / 1024 / 1024`
  4. **Time Series Chart**: Network Ingress/Egress Throughput - Query: `sum(rate(container_network_receive_bytes_total[5m])) by (pod)`
- **Log Fields**: `log.category="INFRASTRUCTURE"`, `infra.provider="AWS"`.
- **Trace Attributes**: `aws.service`, `rpc.system`.
- **Retention Policy**: Prometheus 90 days; CloudWatch 90 days.
- **Escalation Rules**: Storage/CPU breach -> P2 to DevOps Lead.
- **Dependencies**: AWS CloudWatch Exporter, Prometheus Container Exporter.
