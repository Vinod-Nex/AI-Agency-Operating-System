# Health Checks, Liveness & Readiness Probes Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the health check architecture, liveness and readiness probe configurations, database connection testing, Redis ping validation, AWS S3 probes, and synthetic AI provider availability probes for AgencyOS.

---

## 2. Health Endpoint Architecture Matrix

| Service Tier | Endpoint Path | Probe Type | Purpose & Verification Logic | HTTP Success Code |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | `/actuator/health/liveness` | Liveness Probe | Verifies Spring Boot JVM process is running and not deadlocked. | 200 OK (`{"status":"UP"}`) |
| **Backend API** | `/actuator/health/readiness` | Readiness Probe| Verifies PostgreSQL DB and Redis connectivity are established. | 200 OK (`{"status":"UP"}`) |
| **Frontend UI** | `/api/health` | Edge Probe | Verifies Next.js edge route rendering and API gateway proxy. | 200 OK (`{"status":"healthy"}`) |
| **Database** | Internal Ping | DB Check | Executes `SELECT 1` via HikariCP pool connection. | Status UP |
| **Redis** | Internal Ping | Cache Check | Executes `PING` -> `PONG` response check. | Status UP |
| **AWS S3** | Internal Probe | Storage Check| Executes `s3Client.headBucket()` validation. | Status UP |
| **AI Providers**| `/api/v1/health/ai-providers` | Synthetic Probe| Executes lightweight dummy token check across OpenAI, Claude, Gemini. | 200 OK |

---

## 3. Spring Boot Health Indicator Configuration (`application.yml`)

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "health,prometheus,info"
  endpoint:
    health:
      show-details: "always"
      probes:
        enabled: true
  health:
    db:
      enabled: true
    redis:
      enabled: true
```
