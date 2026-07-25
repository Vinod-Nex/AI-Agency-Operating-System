# Production Go-Live & Verification Checklist
## AI Agency Operating System (AgencyOS)

---

## 1. Pre-Go-Live Infrastructure Verification

- [x] Production DNS records active (`agencyos.io`, `api.agencyos.io`) in Amazon Route 53.
- [x] TLS 1.3 SSL Certificates verified on CloudFront and Application Load Balancer.
- [x] PostgreSQL RDS Multi-AZ instance verified with Flyway migration up to `V4__seed_initial_data.sql`.
- [x] ElastiCache Redis 7 cluster online with connection test passing.
- [x] AWS S3 contract bucket encryption (AES-256) and CORS configured.

---

## 2. Post-Go-Live Smoke Test Suite

- [x] Landing Page HTTP 200 check: `curl -I https://agencyos.io`
- [x] Backend Health check: `curl https://api.agencyos.io/actuator/health` -> `{"status": "UP"}`
- [x] User Login & JWT Token issuance test.
- [x] Proposal generation synthesis smoke test.
- [x] Invoice status update to `Sent` with persistent alert banner verification.
- [x] Zero 5xx error spikes observed on Grafana / CloudWatch dashboards.
