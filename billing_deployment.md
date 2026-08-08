# Stripe Billing Production Deployment Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides environment variable specifications, deployment steps, pre-launch checklists, go-live checklists, and rollback strategies for launching Stripe Billing in production across Next.js (Vercel) and Spring Boot (Railway / AWS ECS).

---

## 2. Environment Variables Matrix

| Variable Name | Required Scope | Secret / Public | Description / Format |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Next.js Frontend | Public | Stripe Live Publishable Key (`pk_live_...`) |
| `STRIPE_SECRET_KEY` | Spring Boot Backend | Secret | Stripe Live Secret Key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Spring Boot Backend | Secret | Live Webhook Endpoint Signing Secret (`whsec_...`) |
| `STRIPE_PRICE_STARTER_MONTHLY` | Spring Boot / Next.js | Public Configuration | Starter Monthly Stripe Price ID |
| `STRIPE_PRICE_PRO_MONTHLY` | Spring Boot / Next.js | Public Configuration | Pro Monthly Stripe Price ID |
| `STRIPE_PRICE_BUSINESS_MONTHLY` | Spring Boot / Next.js | Public Configuration | Business Monthly Stripe Price ID |
| `STRIPE_PRICE_EXTRA_SEAT` | Spring Boot Backend | Public Configuration | Extra Seat Recurring Price ID |

---

## 3. Production Go-Live Checklist

1. [ ] **Verify Stripe Account Activation**: Confirm business identity verification, bank account payouts, and tax details are active in Stripe Dashboard.
2. [ ] **Configure Live Webhook Endpoint**: Add `https://api.agencyos.ai/api/v1/webhooks/stripe` in Stripe Dashboard under Developers -> Webhooks. Enable all 15 required events.
3. [ ] **Set Live Environment Keys**: Update AWS Secrets Manager / Railway Environment Variables with production `sk_live_...` and `whsec_...`.
4. [ ] **Enable Stripe Tax**: Configure origin address and jurisdiction tax registrations in Stripe Dashboard.
5. [ ] **Configure Customer Portal**: Set allowed portal actions (card update, cancellation, plan switching) in Stripe Dashboard Settings.
6. [ ] **Execute End-to-End Live Test**: Run a $1 live card transaction using a real card; verify database sync, credit allocation, and subsequent full refund.
7. [ ] **Verify Webhook Signature Enforcement**: Confirm HTTP 400 rejection when spoofed signature requests are sent to `/api/v1/webhooks/stripe`.

---

## 4. Emergency Rollback Strategy

In the event of a critical regression during a billing deployment:

1. **Feature Flag Kill Switch**: Set `BILLING_ENABLED=false` via Spring Boot Actuator dynamic configuration to disable new checkout session creation while maintaining webhook listener health.
2. **Backend Service Rollback**: Revert Railway / AWS ECS Fargate deployment to the previous Docker image tag (`v1.4.1`).
3. **Stripe API Key Preservations**: Do NOT revoke Stripe API keys unless credentials were compromised.
4. **Database Rollback Guard**: Flyway migration scripts maintain backward compatibility. Column removals are restricted to blue-green rollout phases.
