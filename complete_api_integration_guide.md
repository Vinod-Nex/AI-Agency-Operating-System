# Master Enterprise API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. API Architecture Overview

The **AI Agency Operating System (AgencyOS)** is designed as an API-First, contract-driven SaaS platform. It enforces strict separation between the Next.js 15 App Router frontend (Client & Edge SSR layer) and the enterprise Spring Boot 3.2+ / PostgreSQL 16 / Redis 7 backend micro-services.

### Key Architectural Pillars

```
[ Next.js 15 App Router (Frontend SPA / SSR) ]
                     │
                     ▼ (REST API / JSON / HTTPS / WSS)
[ NGINX / CloudFront API Gateway & Rate Limiter ]
                     │
                     ▼ (Spring Security & JWT Bearer Token)
[ Backend for Frontend (BFF) & Core Micro-Services ]
       │                      │                      │
       ▼                      ▼                      ▼
[ PostgreSQL 16 ]      [ Redis 7 Cache ]      [ AI Prompt Engine ]
 (Relational Store)     (Rate Limit & Queue)   (Claude / GPT-4 / Gemini)
```

1. **API-First & Contract-First Development**: OpenAPI 3.1 specifications serve as the single source of truth for all request/response models, validation rules, and client SDK generation.
2. **Backend for Frontend (BFF) Recommendation**: Next.js API Routes (`/app/api/...`) act as a lightweight BFF layer when aggregating multi-service responses or masking third-party API tokens, while heavy business logic resides in Spring Boot REST services.
3. **REST Principles & Statelessness**: All endpoints follow strict REST semantics (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), returning standard HTTP status codes and RFC 7807 Problem Details error formats.
4. **Service & Domain Boundaries**:
   - **Identity & Organization Domain**: Tenant provisioning, user access, RBAC, and subscription billing.
   - **AI Synthesis Domain**: Proposal generation, contract drafting, and Jira user story synthesis.
   - **Financial Domain**: Invoice generation, itemized tax calculations, and Stripe checkout webhooks.
   - **Agile & CRM Domain**: Client directories, project milestone tracking, and Atlassian Cloud synchronization.

---

## 2. API Lifecycle & Versioning Strategy

- **Current Production Version**: `v1` (`https://api.agencyos.io/api/v1`)
- **Versioning Mechanism**: URI Path Versioning (`/api/v1/...`). Major version increments (`v2`) indicate breaking changes.
- **Deprecation Policy**: Deprecated endpoints emit HTTP header `Sunset: Wed, 31 Dec 2026 23:59:59 GMT` alongside a `Deprecation: true` header.

---

## 3. Global REST Naming & Resource Design Standards

| Standard | Rule Specification | Example |
| :--- | :--- | :--- |
| **URI Case** | Kebab-case for paths, camelCase for JSON fields | `/api/v1/proposal-templates` |
| **Plural Nouns** | Use plural nouns for resource collections | `/api/v1/proposals`, `/api/v1/invoices` |
| **Sub-Resources** | Hierarchical relations represented as sub-paths | `/api/v1/clients/{clientId}/projects` |
| **Actions / Triggers** | Non-CRUD operations represented as verb suffixes | `/api/v1/invoices/{id}/send`, `/api/v1/jira/sync` |
| **HTTP Methods** | `GET` (Read), `POST` (Create/Trigger), `PUT` (Replace), `PATCH` (Update), `DELETE` (Remove) | `DELETE /api/v1/clients/{id}` |
