# Standardized API Error Handling Specification (RFC 7807)
## AI Agency Operating System (AgencyOS)

---

## 1. RFC 7807 Problem Details Standard

All error responses returned by **AgencyOS** conform strictly to **RFC 7807 (Problem Details for HTTP APIs)** format with `Content-Type: application/problem+json`.

```json
{
  "type": "https://api.agencyos.io/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Validation Error: Client Name is required.",
  "instance": "/api/v1/proposals/generate",
  "timestamp": "2026-07-25T12:00:00Z",
  "invalidParams": [
    {
      "name": "clientName",
      "reason": "Client Name must not be blank"
    }
  ]
}
```

---

## 2. Business Error Code Catalog

| Error Code | HTTP Status | Description & User Resolution | Retryable |
| :--- | :---: | :--- | :---: |
| `VALIDATION_FAILED` | `400` | Input payload validation failed. Check request body attributes. | No |
| `UNAUTHORIZED` | `401` | Missing, expired, or invalid JWT token. Refresh token. | No |
| `FORBIDDEN` | `403` | User lacks sufficient RBAC privileges. Contact tenant admin. | No |
| `RESOURCE_NOT_FOUND` | `404` | Requested client, proposal, contract, or invoice ID does not exist. | No |
| `AI_SYNTHESIS_TIMEOUT` | `504` | External LLM provider timeout. Retry with exponential backoff. | Yes |
| `RATE_LIMIT_EXCEEDED` | `429` | API rate limit bucket exhausted. Retry after `Retry-After` seconds. | Yes |
