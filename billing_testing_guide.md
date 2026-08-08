# Billing Testing Strategy & Sandbox Verification Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides a comprehensive testing guide for validating Stripe Billing integration, subscription state transitions, webhook execution, seat proration math, and metered AI usage ingestion.

---

## 2. Testing Environments & Test Credentials

- **Environment**: Stripe Sandbox Mode (`pk_test_...` / `sk_test_...`).
- **Standard Test Cards**:
  - `4242 4242 4242 4242` (Success / Visa)
  - `4000 0024 0000 0005` (3D Secure Required)
  - `4000 0000 0000 0002` (Insufficient Funds / Card Declined)

---

## 3. Stripe CLI Webhook Testing Workflows

To forward live test webhooks to a local backend API instance during development:

```bash
# 1. Authenticate Stripe CLI
stripe login

# 2. Forward Webhooks to Local Spring Boot Backend
stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe

# 3. Trigger Specific Webhook Events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
stripe trigger invoice.paid
```

---

## 4. Test Suite Matrix (10 Domain Test Cases)

| Test Category | Target Scenario | Verification Criteria | CLI Trigger / Script |
| :--- | :--- | :--- | :--- |
| **1. Checkout Test** | Free Trial & Paid Checkout | `customers` & `subscriptions` created in DB; Status `active` | `stripe trigger checkout.session.completed` |
| **2. Renewal Test** | Recurring Monthly Payment | `current_period_end` extended +1 month; AI credits refilled | `stripe trigger invoice.paid` |
| **3. Failed Payment** | Card Declined Dunning | Subscription enters `past_due`; Dunning notification email sent | `stripe trigger invoice.payment_failed` |
| **4. Upgrade Test** | Starter -> Business Plan | Prorated invoice issued; Seat & AI credit limits increased immediately | Integration Test: `postUpgradePlan()` |
| **5. Downgrade Test** | Business -> Starter Plan | Pending update set for `current_period_end`; No immediate refund | Integration Test: `postDowngradePlan()` |
| **6. Cancel Test** | User Cancels Subscription | `cancel_at_period_end = true`; Full access remains until end date | Integration Test: `postCancelSub()` |
| **7. Reactivate Test** | User Resumes Cancellation | `cancel_at_period_end` set back to `false` | Integration Test: `postResumeSub()` |
| **8. Seat Allocation** | Add Team Member (+1 Seat) | Stripe subscription item quantity updated to N+1; Prorated invoice generated | Integration Test: `postAddSeat()` |
| **9. Metered AI Usage**| Overage AI Token Ingestion | Usage records pushed via `stripe.subscriptionItems.createUsageRecord()` | Integration Test: `syncMeteredUsage()` |
| **10. Refund Test** | Admin Issues Partial Refund | Refund record logged in DB; Token balance adjusted | `stripe trigger charge.refunded` |

---

## 5. Automated Testing Integration (JUnit 5 & Testcontainers)

Integration tests spin up a PostgreSQL instance using **Testcontainers** and mock Stripe API calls using Mockito or Stripe-Mock:

```java
@SpringBootTest
@Testcontainers
class BillingIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void testWebhookIdempotency() {
        // Submit identical webhook payload twice
        // Verify only 1 subscription row exists in PostgreSQL
    }
}
```
