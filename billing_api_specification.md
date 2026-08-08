# Production Billing REST API Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides the complete API specification for the AgencyOS Billing Microservice. All endpoints require HTTPS, JWT authentication, and tenant organization scoping.

---

## 2. API Catalog & Endpoint Definitions

### 1. Create Checkout Session
- **Endpoint**: `POST /api/v1/billing/checkout-session`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "plan_id": "plan_business_annual",
  "seats": 5,
  "coupon_code": "SUMMER20",
  "success_url": "https://app.agencyos.ai/billing/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://app.agencyos.ai/billing/plans"
}
```
- **Response Payload (200 OK)**:
```json
{
  "checkout_session_id": "cs_test_a1b2c3d4e5f6",
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6"
}
```
- **Validation**: `plan_id` must match active plans; `seats` >= 1.
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden.

---

### 2. Get Subscription Plans
- **Endpoint**: `GET /api/v1/billing/plans`
- **Method**: `GET`
- **Auth**: Public / Authenticated
- **Response Payload (200 OK)**:
```json
{
  "plans": [
    {
      "id": "starter",
      "name": "Starter Plan",
      "monthly_price_usd": 49.00,
      "annual_price_usd": 470.00,
      "included_seats": 2,
      "included_ai_credits": 100000,
      "storage_gb": 10
    },
    {
      "id": "business",
      "name": "Business Plan",
      "monthly_price_usd": 199.00,
      "annual_price_usd": 1900.00,
      "included_seats": 10,
      "included_ai_credits": 1000000,
      "storage_gb": 100
    }
  ]
}
```

---

### 3. Get Active Subscription State
- **Endpoint**: `GET /api/v1/billing/subscription`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Response Payload (200 OK)**:
```json
{
  "subscription_id": "sub_1Qx8...21",
  "plan_id": "business",
  "status": "active",
  "current_period_start": "2026-07-01T00:00:00Z",
  "current_period_end": "2026-08-01T00:00:00Z",
  "cancel_at_period_end": false,
  "allocated_seats": 7,
  "max_seats": 10,
  "ai_credits_remaining": 642100
}
```

---

### 4. Create Customer Portal Session
- **Endpoint**: `POST /api/v1/billing/portal-session`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "return_url": "https://app.agencyos.ai/settings/billing"
}
```
- **Response Payload (200 OK)**:
```json
{
  "portal_url": "https://billing.stripe.com/p/session/test_123456"
}
```

---

### 5. Upgrade Subscription Plan
- **Endpoint**: `POST /api/v1/billing/subscription/upgrade`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "target_plan_id": "enterprise",
  "proration_behavior": "always_invoice"
}
```
- **Response Payload (200 OK)**:
```json
{
  "status": "UPGRADED",
  "invoice_id": "in_1Qx9...",
  "amount_due_cents": 35000
}
```

---

### 6. Cancel Subscription
- **Endpoint**: `POST /api/v1/billing/subscription/cancel`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Request Payload**:
```json
{
  "feedback_reason": "TOO_EXPENSIVE",
  "cancel_immediately": false
}
```
- **Response Payload (200 OK)**:
```json
{
  "status": "active",
  "cancel_at_period_end": true,
  "access_until": "2026-08-01T00:00:00Z"
}
```

---

### 7. Resume Subscription
- **Endpoint**: `POST /api/v1/billing/subscription/resume`
- **Method**: `POST`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Response Payload (200 OK)**:
```json
{
  "status": "active",
  "cancel_at_period_end": false
}
```

---

### 8. Get Invoice History
- **Endpoint**: `GET /api/v1/billing/invoices`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Response Payload (200 OK)**:
```json
{
  "invoices": [
    {
      "id": "in_12345",
      "number": "INV-2026-001",
      "amount_paid_usd": 199.00,
      "status": "paid",
      "pdf_url": "https://pay.stripe.com/invoice/acct_123/invst_456/pdf"
    }
  ]
}
```

---

### 9. Get Usage Summary
- **Endpoint**: `GET /api/v1/billing/usage`
- **Method**: `GET`
- **Auth**: Bearer JWT
- **Response Payload (200 OK)**:
```json
{
  "ai_tokens_used": 357900,
  "ai_credits_quota": 1000000,
  "storage_bytes_used": 14200000000,
  "active_seat_count": 7
}
```

---

### 10. Get Billing Dashboard Metrics
- **Endpoint**: `GET /api/v1/billing/dashboard`
- **Method**: `GET`
- **Auth**: Bearer JWT (`ROLE_ORG_ADMIN`)
- **Response Payload (200 OK)**:
```json
{
  "current_mrr_usd": 199.00,
  "next_billing_date": "2026-08-01T00:00:00Z",
  "payment_method": {
    "brand": "visa",
    "last4": "4242",
    "exp_month": 12,
    "exp_year": 2028
  }
}
```
