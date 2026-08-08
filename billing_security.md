# Billing Security Architecture & PCI Compliance Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details security controls, PCI DSS compliance scope, webhook signature HMAC validation, KMS secret management, Spring Security RBAC rules, and Stripe Radar fraud protection for AgencyOS.

---

## 2. Security & PCI Compliance Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PCI DSS COMPLIANCE SCOPE (SAQ A)                   │
├─────────────────────────────────────────────────────────────────────────┤
│ • Cardholder Data Environment (CDE): 100% Outsourced to Stripe.        │
│ • AgencyOS Servers: Zero raw PAN, CVV, or card expiration data stored.   │
│ • Integration Method: Stripe Hosted Checkout & Customer Portal.         │
│ • Compliance Standard: Self-Assessment Questionnaire A (SAQ A).         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Security Controls

1. **HMAC Signature Verification**: Every incoming webhook request is validated using `Webhook.constructEvent(payload, sigHeader, secret)`. Requests with invalid signatures return HTTP 400 Bad Request and trigger a security alert.
2. **Secrets Management**: Stripe Private Keys (`sk_live_...`) and Webhook Signing Secrets (`whsec_...`) are stored in AWS Secrets Manager or Railway Encrypted Variables and injected via environment variables.
3. **Role-Based Access Control (RBAC)**:
   - `ROLE_ORG_ADMIN`: Full access to billing settings, checkout, plan modifications, customer portal, and invoice downloads.
   - `ROLE_BILLING_MANAGER`: Access to billing settings and invoices.
   - `ROLE_STANDARD_USER`: Read-only quota indicators.
4. **Audit Logging**: Every subscription state mutation or seat change is logged to the immutable `billing_events` table with actor UUID, IP address, and timestamp.
5. **Stripe Radar Fraud Prevention**: Radar evaluates every payment against machine learning models. High-risk charges trigger automated block rules or require 3D Secure / SCA step-up authentication.
