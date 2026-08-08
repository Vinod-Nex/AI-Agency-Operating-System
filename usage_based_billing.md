# Metered Usage-Based Billing & AI Credit Ledger Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the metered usage ingestion pipeline, credit depletion ledger, storage overage tracking, and integration with the Stripe Usage Records API for usage-based billing.

---

## 2. Usage Ingestion & Synchronization Architecture

```mermaid
graph TD
    UserApp[User Operation - AI Generation] -->|1. Request Prompt| Gateway[AI Gateway Filter]
    Gateway -->|2. Execute LLM Call| LLM[OpenAI / Claude / Gemini]
    LLM -->|3. Return Token Usage| Gateway
    
    Gateway -->|4. Decrement Local Balance| CreditLedger[(PostgreSQL credits Table)]
    Gateway -->|5. Insert Log Event| UsageTable[(PostgreSQL usage_records Table)]
    
    subgraph Periodic Metered Synchronization Daemon
        SyncCron[Spring @Scheduled Usage Meter Sync - Every 1 Hour]
        SyncCron -->|Fetch Unsynced Aggregates| UsageTable
        SyncCron -->|stripe.subscriptionItems.createUsageRecord()| StripeMeter[Stripe Metered Subscription API]
        StripeMeter -->|Update Status to SYNCED| UsageTable
    end
```

---

## 3. Business Rules & Credit Conversion Ratios

1. **Credit Conversion Standard**: 
   - 1 Prompt Token (GPT-4o) = 1 AI Credit.
   - 1 Completion Token (GPT-4o) = 3 AI Credits.
   - 1 Claude 3.5 Sonnet Token = 1.5 AI Credits.
2. **Quota Replenishment**: Monthly credit allowances (e.g., 1,000,000 credits for Business Tier) reset automatically on the subscription renewal billing date (`invoice.paid`).
3. **Credit Depletion Sequence**:
   - First: Plan Monthly Included Credits.
   - Second: Purchased Credit Top-Up Packs (never expire).
   - Third: Overage Metered Charge (Billed at end of cycle via Stripe Usage Records).

---

## 4. Stripe Usage Records API Integration Code

```java
public void reportUsageToStripe(String subscriptionItemId, long quantity) throws StripeException {
    com.stripe.param.UsageRecordCreateParams params =
            com.stripe.param.UsageRecordCreateParams.builder()
                    .setQuantity(quantity)
                    .setTimestamp(System.currentTimeMillis() / 1000L)
                    .setAction(com.stripe.param.UsageRecordCreateParams.Action.SET)
                    .build();

    com.stripe.model.UsageRecord.createOnSubscriptionItem(subscriptionItemId, params, null);
}
```
