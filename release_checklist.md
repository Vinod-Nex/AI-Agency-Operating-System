# Release Management & Deployment Verification Checklist
## AI Agency Operating System (AgencyOS)

---

## 1. Pre-Release Steps (T-minus 24 Hours)

1. **Code Freeze**: Freeze non-critical feature commits on `main` branch.
2. **Run Full Test Suite**:
   ```bash
   npm run test
   mvn clean test
   npx playwright test
   ```
3. **Verify Flyway Migration Integrity**:
   ```bash
   mvn flyway:validate
   ```
4. **Bump Semantic Version**: Update `package.json` and `pom.xml` to release version `v1.0.0`.
5. **Generate Release Tag**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Initial Enterprise Production Launch"
   git push origin v1.0.0
   ```

---

## 2. Deployment Execution Steps (T-Zero)

1. Trigger production GitHub Actions workflow `.github/workflows/ci-cd.yml`.
2. Monitor Flyway database migration execution on production PostgreSQL database.
3. Verify zero-downtime rolling update on AWS ECS / Railway.
4. Verify Vercel production frontend deployment completion.

---

## 3. Post-Deployment Smoke Test Verification (T-plus 15 Minutes)

- [x] Test Landing Page HTTP 200 response (`curl -I https://agencyos.io`).
- [x] Test User Authentication & JWT Login (`POST /api/v1/auth/login`).
- [x] Test Executive Dashboard metric fetch (`GET /api/v1/dashboard/metrics`).
- [x] Test AI Proposal Generation (`POST /api/v1/proposals/generate`).
- [x] Test Invoice Builder total calculations and status update to `Sent`.
- [x] Verify zero 5xx error spikes on Grafana / CloudWatch dashboards.
