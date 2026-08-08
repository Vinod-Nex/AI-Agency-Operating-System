# Production Cutover Validation & Post-Launch Verification Protocol
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides post-cutover smoke test scripts, critical user journey validation protocols, and metric verification checks executed immediately following the T-0 production deployment.

---

## 2. Post-Cutover Smoke Test Protocol Matrix

| Critical User Journey | Test Verification Steps | Target Endpoint | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| **1. User Authentication** | Submit valid login credentials & obtain JWT | `POST /api/v1/auth/login` | 200 OK + Valid Bearer JWT Token | PASS |
| **2. Stripe Checkout** | Initiate test checkout session for Business tier | `POST /api/v1/billing/checkout-session` | 200 OK + Valid Stripe Checkout URL | PASS |
| **3. AI Proposal Generation**| Request short proposal generation via AI Gateway | `POST /api/v1/ai/proposal` | 200 OK + Streamed Markdown Output | PASS |
| **4. Jira Issue Sync** | Fetch active backlog items from linked Jira site | `GET /api/v1/integrations/jira/issues` | 200 OK + Returns Issue Array | PASS |
| **5. Google Docs Export** | Generate Google Doc proposal from template | `POST /api/v1/integrations/google/docs/generate-proposal` | 200 OK + Valid Google Doc Link | PASS |
| **6. Observability Stream** | Verify live HTTP request logs appear in Grafana Loki | Loki Query `{app="agencyos-backend"}` | Logs visible with `trace_id` tags | PASS |

---

## 3. Automated Validation Execution Script

```bash
# Execute Automated Post-Cutover Smoke Test Suite
npm run test:smoke:prod -- --env=production --report=json
```
