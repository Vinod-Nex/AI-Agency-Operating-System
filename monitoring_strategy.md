# Application & Component Monitoring Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Subsystem Monitoring Directory

### A. Next.js 15 Frontend Monitoring
- **Tools**: Sentry Browser SDK + PostHog + Vercel Analytics
- **Metrics**: Core Web Vitals ($LCP < 2.2\text{s}$, $CLS < 0.05$, $INP < 90\text{ms}$), Unhandled React Exceptions, Client HTTP 4xx/5xx counts.

### B. Spring Boot 3.2 Backend Monitoring
- **Tools**: Micrometer + Prometheus + Spring Actuator (`/actuator/prometheus`)
- **Metrics**: HTTP Server Throughput (`http_server_requests_seconds_count`), Latency Histograms (`http_server_requests_seconds_bucket`), JVM Heap & Non-Heap Memory (`jvm_memory_used_bytes`), System CPU Usage.

### C. Database & Redis Monitoring
- **Tools**: HikariCP Micrometer Exporter + Amazon RDS CloudWatch / Redis Exporter
- **Metrics**: HikariCP Active & Pending Connections, PostgreSQL Slow Queries ($> 500\text{ms}$), Redis Cache Hit Ratio (`keyspace_hits / (keyspace_hits + keyspace_misses)`), Redis Memory Usage.

### D. AI Provider Monitoring
- **Tools**: Custom Micrometer Counters
- **Metrics**: Tokens Consumed per Provider (`claude-3-5-sonnet`, `gpt-4o`, `gemini-1.5-pro`), Prompt Latency, LLM Rate Limit 429 Errors, Fallback Trigger Frequency.
