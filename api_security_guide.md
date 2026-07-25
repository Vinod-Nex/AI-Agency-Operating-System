# API Security Architecture & Control Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Overview

Security is a foundational design constraint of the **AI Agency Operating System**. This document specifies authentication mechanisms, authorization (RBAC), tenant isolation, data protection, rate limiting, and AI prompt injection defenses.

---

## 2. Authentication & JWT Architecture

- **Token Standard**: JSON Web Tokens (JWT) signed using HMAC-SHA256 (`HS256`) with a minimum 256-bit secret.
- **Access Token Expiry**: 15 minutes ($900\text{s}$).
- **Refresh Token Expiry**: 7 days ($604,800\text{s}$).
- **Token Revocation**: Refresh tokens are stored in Redis (`refresh_token:user_id:token`). Logout or privilege revocation immediately deletes the Redis key.

### JWT Claims Payload Standard
```json
{
  "sub": "00000000-0000-0000-0000-000000000002",
  "iss": "https://api.agencyos.io",
  "aud": "https://agencyos.io",
  "org_id": "00000000-0000-0000-0000-000000000001",
  "roles": ["ROLE_ADMIN"],
  "email": "vinod@apexdigital.io",
  "iat": 1784950000,
  "exp": 1784950900
}
```

---

## 3. Rate Limiting & Denial of Service Protection

Implemented via Redis Fixed-Window Rate Limiter at the API Gateway:

| Route Pattern | Rate Limit | Action on Exceeded |
| :--- | :--- | :--- |
| `/api/v1/auth/login` | 10 requests / minute per IP | HTTP 429 Too Many Requests |
| `/api/v1/proposals/generate` | 10 requests / minute per Tenant | HTTP 429 Too Many Requests |
| Standard CRUD (`/api/v1/*`) | 300 requests / minute per User | HTTP 429 Too Many Requests |

---

## 4. AI Prompt Injection Defenses

1. **Input Sanitization**: Strip dangerous system instructions or delimiter characters (`### SYSTEM INSTRUCTION`, `[IGNORE PREVIOUS PROMPTS]`).
2. **Template Enclosure**: User inputs are strictly wrapped inside XML/JSON string fields within pre-compiled system prompts.
3. **Output Validation**: AI-generated responses are validated against expected schemas before rendering or saving.
