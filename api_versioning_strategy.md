# API Versioning, Deprecation & Sunset Policy
## AI Agency Operating System (AgencyOS)

---

## 1. URI Path Versioning Standard

All public and internal endpoints follow strict URI Path Versioning:
- **Format**: `/api/v{major_version}/{resource}` (e.g. `/api/v1/proposals`).
- **Minor / Patch Updates**: Non-breaking changes (adding optional fields to response DTOs) do NOT increment the major version.
- **Major Version Increment (`v2`)**: Triggered strictly when breaking changes occur (removing fields, changing field types, breaking authentication mechanics).

---

## 2. Deprecation & Sunset Header Protocol

When an endpoint or field is marked for deprecation:
1. **Response Headers Included**:
   ```http
   Deprecation: true
   Sunset: Sun, 01 Aug 2027 23:59:59 GMT
   Link: <https://api.agencyos.io/docs/migration/v2>; rel="successor-version"
   ```
2. **Grace Period**: Deprecated endpoints remain operational for a minimum of 12 months prior to removal.
