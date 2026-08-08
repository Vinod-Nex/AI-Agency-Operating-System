# Billing Operational Runbook & Incident Response Standard Operating Procedures
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides step-by-step Standard Operating Procedures (SOPs) for On-call Engineers, Customer Support Leads, and Finance Operations to triage and resolve billing incidents, manual refunds, webhook failures, and subscription synchronization bugs.

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Triage & Replay Failed Stripe Webhooks
- **Symptom**: Customer completed payment on Stripe Checkout, but workspace status remains `inactive` or trial mode.
- **Root Cause**: Webhook request failed due to network timeout or transient backend error (`status = 'FAILED'` in `webhook_events`).
- **Resolution Procedure**:
  1. Query database for failed webhooks:
     ```sql
     SELECT id, stripe_event_id, event_type, error_message 
     FROM webhook_events 
     WHERE status = 'FAILED' ORDER BY created_at DESC;
     ```
  2. Inspect error stack trace in Grafana Loki: `{app="agencyos-backend"} |= "evt_..."`
  3. Execute manual replay endpoint:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/admin/webhooks/evt_1Qx.../replay \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN"
     ```
  4. Verify local `subscriptions` table is updated to `status = 'active'`.

---

### SOP-02: Execute Manual Refund & Adjust AI Token Balance
- **Symptom**: Customer requests a refund for mistaken duplicate charge or unused enterprise addon.
- **Resolution Procedure**:
  1. Locate `stripe_payment_intent_id` from Customer Profile or `payments` table.
  2. Trigger partial/full refund via Stripe Dashboard or API:
     ```bash
     curl https://api.stripe.com/v1/refunds \
          -u sk_live_...: \
          -d payment_intent=pi_3Qx... \
          -d amount=4900
     ```
  3. Deduct associated prorated AI credits in PostgreSQL:
     ```sql
     UPDATE credits 
     SET balance_tokens = GREATEST(0, balance_tokens - 100000) 
     WHERE org_id = 'org_uuid_here';
     ```
  4. Log administrative action in `billing_events` audit table.

---

### SOP-03: Resolve Past_Due Dunning Lockout Escalations
- **Symptom**: Customer account downgraded to `unpaid` / locked out, but customer claims credit card has been updated.
- **Resolution Procedure**:
  1. Open Stripe Dashboard -> Customers -> Find Customer (`cus_...`).
  2. Verify active payment method is on file.
  3. Navigate to latest Open Invoice -> Click "Attempt Payment Now".
  4. Once invoice status changes to `paid`, `invoice.paid` webhook automatically fires to unlock tenant access.
  5. If webhook fails to fire, run manual synchronization job:
     ```bash
     curl -X POST https://api.agencyos.ai/api/v1/admin/customers/cus_.../sync-subscription \
          -H "Authorization: Bearer ADMIN_JWT_TOKEN"
     ```
