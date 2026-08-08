# Production Alerting Strategy & Rules Catalog
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Alert Severity Hierarchy

AgencyOS classifies alerts into four distinct severity levels to prevent alert fatigue and guarantee sub-5-minute Mean Time to Acknowledge (MTTA) for critical outages.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       ALERT SEVERITY HIERARCHY                          │
├──────────┬──────────────┬────────────────────────┬──────────────────────┤
│ Severity | Target SLA   │ Paging Destination     │ Operational Impact   │
├──────────┼──────────────┼────────────────────────┼──────────────────────┤
│ P1 - CRIT| MTTA < 5m    │ PagerDuty (Phone/SMS)  │ Complete Outage / DB │
│ P2 - HIGH| MTTA < 15m   │ PagerDuty + Slack      │ Partial Outage / AI  │
│ P3 - WARN| MTTA < 2h    │ Slack #ops-alerts      │ Capacity / Latency   │
│ P4 - INFO| MTTA < 24h   │ Slack #ops-activity    │ Maintenance / Deploy │
└──────────┴──────────────┴────────────────────────┴──────────────────────┤
```

---

## 2. Complete Production Alert Catalog (13 Core Alerts)

### 1. API Down (`APIDown`)
- **Purpose**: Detect total unreachability of the Spring Boot Backend API service.
- **Metrics Collected**: `up{job="spring-boot-backend"}`
- **Alert Threshold**: `up == 0` for 1 minute.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 call immediately to Backend On-call Engineer.

### 2. Database Down (`PostgreSQLDatabaseDown`)
- **Purpose**: Detect PostgreSQL database instance crash or connection termination.
- **Metrics Collected**: `pg_up`
- **Alert Threshold**: `pg_up == 0` for 1 minute.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to Database Administrator & Infrastructure Lead.

### 3. Redis Down (`RedisInstanceDown`)
- **Purpose**: Detect loss of Redis cache & queue engine.
- **Metrics Collected**: `redis_up`
- **Alert Threshold**: `redis_up == 0` for 1 minute.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to Infrastructure On-call.

### 4. High Error Rate (`HighHTTP5xxErrorRate`)
- **Purpose**: Detect widespread application error spikes.
- **Metrics Collected**: `http_server_requests_seconds_count`
- **Alert Threshold**: `(sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))) * 100 > 2%` for 3 minutes.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to Backend On-call.

### 5. High Latency (`HighAPIP95Latency`)
- **Purpose**: Detect degradation in API response times.
- **Metrics Collected**: `http_server_requests_seconds_bucket`
- **Alert Threshold**: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le)) > 0.5` (500ms) for 5 minutes.
- **Severity**: P2 - HIGH
- **Escalation Rule**: Trigger PagerDuty P2 & Slack #ops-alerts.

### 6. AI Provider Failure (`AIProviderOutage`)
- **Purpose**: Detect total failure or rate-limit exhaustion of OpenAI, Anthropic, or Gemini APIs.
- **Metrics Collected**: `ai_requests_total{status="error"}`
- **Alert Threshold**: `(sum(rate(ai_requests_total{status="error"}[5m])) / sum(rate(ai_requests_total[5m]))) * 100 > 10%` for 3 minutes.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to AI Gateway Engineer. Automatic fallback circuit breaker engage.

### 7. Payment Failure (`StripeWebhookFailure`)
- **Purpose**: Detect failed Stripe payment processing or webhook failures.
- **Metrics Collected**: `billing_payment_failed_total`
- **Alert Threshold**: `increase(billing_payment_failed_total[15m]) > 5`
- **Severity**: P2 - HIGH
- **Escalation Rule**: Slack #billing-alerts & notify Billing Operations Lead.

### 8. Storage Failure (`S3StorageErrorSpike`)
- **Purpose**: Detect AWS S3 read/write permission errors or outage.
- **Metrics Collected**: `aws_s3_requests_5xx_errors`
- **Alert Threshold**: `rate(aws_s3_requests_5xx_errors[5m]) > 5`
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to Infrastructure Engineer.

### 9. Authentication Failure (`BruteForceAuthSpike`)
- **Purpose**: Detect security brute-force attack or credential stuffing.
- **Metrics Collected**: `auth_login_failure_total`
- **Alert Threshold**: `rate(auth_login_failure_total[1m]) > 50` for 2 minutes.
- **Severity**: P1 - CRITICAL Security Event
- **Escalation Rule**: Trigger PagerDuty P1 Security Page & notify WAF auto-block.

### 10. High Disk Usage (`HostDiskSpaceCritical`)
- **Purpose**: Prevent disk exhaustion on database or log collector host.
- **Metrics Collected**: `node_filesystem_free_bytes`
- **Alert Threshold**: `(node_filesystem_free_bytes / node_filesystem_size_bytes) * 100 < 10%` for 5 minutes.
- **Severity**: P1 - CRITICAL
- **Escalation Rule**: Trigger PagerDuty P1 to Infrastructure On-call.

### 11. High CPU Usage (`HighContainerCPUUsage`)
- **Purpose**: Detect sustained CPU starvation in container instances.
- **Metrics Collected**: `container_cpu_usage_seconds_total`
- **Alert Threshold**: `sum(rate(container_cpu_usage_seconds_total[5m])) by (pod) > 0.85` for 10 minutes.
- **Severity**: P2 - HIGH
- **Escalation Rule**: Slack #ops-alerts & trigger container auto-scaling.

### 12. High Memory Usage (`JVMHeapMemoryExhaustion`)
- **Purpose**: Detect impending Out-Of-Memory (OOM) crash in Spring Boot.
- **Metrics Collected**: `jvm_memory_used_bytes`
- **Alert Threshold**: `(jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}) * 100 > 85%` for 5 minutes.
- **Severity**: P2 - HIGH
- **Escalation Rule**: Slack #ops-alerts & trigger thread dump capture.

### 13. Queue Backlog (`BullMQQueueBacklogHigh`)
- **Purpose**: Detect worker processing lag for proposals, contracts, and transcripts.
- **Metrics Collected**: `queue_jobs_waiting_total`
- **Alert Threshold**: `queue_jobs_waiting_total > 500` for 10 minutes.
- **Severity**: P2 - HIGH
- **Escalation Rule**: Slack #ops-alerts & auto-scale worker instances.

---

## 3. Production Alertmanager Configuration (`alertmanager.yml`)

```yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/T00/B00/X00'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-default'
  routes:
    - match:
        severity: CRITICAL
      receiver: 'pagerduty-high-priority'
      continue: true

    - match:
        severity: HIGH
      receiver: 'slack-high-priority'

receivers:
  - name: 'slack-default'
    slack_configs:
      - channel: '#ops-alerts'
        send_resolved: true
        title: '[{{ .Status | toUpper }}] {{ .CommonLabels.alertname }}'
        text: "{{ .CommonAnnotations.description }}"

  - name: 'pagerduty-high-priority'
    pagerduty_configs:
      - service_key: 'pd-agencyos-prod-key'
        severity: 'critical'

  - name: 'slack-high-priority'
    slack_configs:
      - channel: '#ops-high-priority'
        send_resolved: true
```
