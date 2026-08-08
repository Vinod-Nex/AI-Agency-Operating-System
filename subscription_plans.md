# Subscription Plans & Pricing Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document outlines the product tiers, pricing matrices, entitlement limits, seat allocations, metered AI credit quotas, and Stripe Product/Price IDs for AgencyOS.

---

## 2. Comprehensive Subscription Matrix

| Feature / Limit | Free Tier | Starter Tier | Professional Tier | Business Tier | Enterprise Tier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Target Customer** | Freelancers | Small Agencies | Growing Agencies | Large Agencies | Global Enterprises |
| **Monthly Price (USD)** | $0 / mo | $49 / mo | $99 / mo | $199 / mo | Custom ($999+/mo) |
| **Annual Price (USD)** | $0 / yr | $470 / yr (20% off)| $950 / yr (20% off)| $1,900 / yr (20% off)| Custom Contract |
| **Included Seats** | 1 Seat | 2 Seats | 5 Seats | 10 Seats | Unlimited Seats |
| **Extra Seat Price** | N/A | $20 / seat / mo | $15 / seat / mo | $12 / seat / mo | Custom Tiered |
| **Monthly AI Credits** | 10,000 Credits | 100,000 Credits | 300,000 Credits | 1,000,000 Credits | Custom Dedicated |
| **Storage Capacity** | 1 GB | 10 GB | 50 GB | 200 GB | 2 TB+ Dedicated |
| **Active Projects** | 2 Projects | 10 Projects | 30 Projects | Unlimited | Unlimited |
| **API Call Quota** | Read-Only | 5,000 / mo | 50,000 / mo | 250,000 / mo | Unlimited |
| **Proposal Generator** | 3 / mo | 25 / mo | 100 / mo | Unlimited | Unlimited |
| **Contract Automation** | Basic Template | Standard Templates | Custom E-Sign | Custom Workflows | SOC2 Custom Rules |
| **Support SLA** | Community | Email (48h) | Priority Email (12h)| Chat & Phone (4h) | 24/7 Dedicated CSM |

---

## 3. Stripe Products & Price ID Architecture

### Product 1: Starter Plan (`prod_starter`)
- Monthly Price ID: `price_starter_monthly` ($49.00 USD / Month)
- Annual Price ID: `price_starter_annual` ($470.00 USD / Year)

### Product 2: Professional Plan (`prod_professional`)
- Monthly Price ID: `price_pro_monthly` ($99.00 USD / Month)
- Annual Price ID: `price_pro_annual` ($950.00 USD / Year)

### Product 3: Business Plan (`prod_business`)
- Monthly Price ID: `price_business_monthly` ($199.00 USD / Month)
- Annual Price ID: `price_business_annual` ($1,900.00 USD / Year)

### Product 4: Extra Team Seat (`prod_extra_seat`)
- Metered Quantity Price ID: `price_extra_seat_recurring` ($15.00 USD / Seat / Month)

### Product 5: AI Credit Top-Up Pack (`prod_ai_credits_pack`)
- One-Time Purchase Price ID: `price_ai_500k_credits` ($50.00 USD for 500,000 Credits)
