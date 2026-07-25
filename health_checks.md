# Health Check Probes & Service Readiness Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Spring Boot Actuator Health Endpoints

- **Liveness Probe**: `GET /actuator/health/liveness`
  - Purpose: Kubernetes / AWS ECS container restart probe.
  - Response: `{"status": "UP"}`
- **Readiness Probe**: `GET /actuator/health/readiness`
  - Purpose: ALB target group routing probe (checks PostgreSQL & Redis availability).
  - Response:
    ```json
    {
      "status": "UP",
      "components": {
        "db": { "status": "UP", "details": { "database": "PostgreSQL", "validationQuery": "isValid()" } },
        "redis": { "status": "UP", "details": { "version": "7.0.12" } }
      }
    }
    ```
