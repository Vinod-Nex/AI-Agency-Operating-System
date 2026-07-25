# Master Enterprise Monitoring, Logging & Observability Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Executive Summary & Telemetry Vision

The **AI Agency Operating System (AgencyOS)** employs a unified, end-to-end Observability & SRE Framework designed around the **Three Pillars of Observability**:
1. **Logs**: Structured JSON Line logs ingested into **Grafana Loki** with trace correlation.
2. **Metrics**: Real-time numerical metrics scraped by **Prometheus** and visualized in **Grafana**.
3. **Traces**: Distributed OpenTelemetry spans exported to **Grafana Tempo / AWS X-Ray**.

```mermaid
graph TD
    subgraph Instrumentation Layer
        FE[Next.js 15 Client - Sentry & OTel Browser SDK]
        BE[Spring Boot 3.2 - Micrometer & OTel Java Agent]
        DB[Amazon RDS PostgreSQL / ElastiCache Redis]
    end

    subgraph Collection Layer
        OTel[OpenTelemetry Collector]
    end

    subgraph Storage & Analytics Layer
        Prometheus[Prometheus Server - Metrics]
        Loki[Grafana Loki - Logs]
        Tempo[Grafana Tempo - Traces]
    end

    subgraph Visualization & Alerting
        Grafana[Grafana Unified Dashboards]
        PagerDuty[PagerDuty / Slack Alerting]
    end

    FE -->|W3C TraceContext| BE
    FE -->|Client Errors & Web Vitals| Sentry[Sentry Client SDK]
    BE -->|OTLP gRPC| OTel
    DB -->|Telemetry| OTel

    OTel -->|Prometheus Remote Write| Prometheus
    OTel -->|Loki Push API| Loki
    OTel -->|OTLP Traces| Tempo

    Grafana -->|Query| Prometheus
    Grafana -->|Query| Loki
    Grafana -->|Query| Tempo
    Grafana -->|Triggers| PagerDuty
```

---

## 2. Production Tooling Stack

- **Metrics Collection**: Prometheus 2.45+ (Scrapes `/actuator/prometheus` every 15s)
- **Log Aggregation**: Grafana Loki 2.9+ / AWS CloudWatch Logs
- **Distributed Tracing**: OpenTelemetry Collector 1.30+ & Grafana Tempo
- **Dashboarding**: Grafana 10.2+ (8 Custom Unified Dashboards)
- **Client APM & Errors**: Sentry.io & PostHog Analytics
- **Alerting Engine**: Grafana Alerting + Prometheus Alertmanager -> PagerDuty & Slack
