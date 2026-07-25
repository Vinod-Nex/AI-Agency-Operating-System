# Webhook Integration & Event Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Signature Security

**AgencyOS** supports inbound and outbound webhooks for real-time external event processing:
- **Inbound Webhook Verification**: All incoming webhooks (e.g. Stripe, Slack, GitHub) must verify cryptographic HMAC signatures (`X-Stripe-Signature`, `X-Hub-Signature-256`).
- **Outbound Webhook Delivery**: Outbound webhooks to client systems are signed using HMAC-SHA256 (`X-AgencyOS-Signature: t=timestamp,v1=signature`).

---

## 2. Inbound Webhook: Stripe Payment Events

### `POST /api/v1/webhooks/stripe`

```json
{
  "id": "evt_1Nxxxxxxxxxxxx",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3d4",
      "amount_total": 2484000,
      "currency": "usd",
      "metadata": {
        "invoice_id": "inv_0042891a",
        "organization_id": "00000000-0000-0000-0000-000000000001"
      },
      "payment_status": "paid"
    }
  }
}
```

#### Processing Actions
1. Verify `X-Stripe-Signature` using Stripe Webhook Secret.
2. Locate `Invoice` entity by `invoice_id` in metadata.
3. Update `Invoice` status to `PAID`, populate `paid_at` timestamp.
4. Emit real-time WebSocket notification to agency frontend.

---

## 3. Outbound Webhook: Contract Signed Event

### Payload (`event: contract.signed`)

```json
{
  "eventId": "evt_9912ab",
  "event": "contract.signed",
  "timestamp": "2026-07-25T12:00:00Z",
  "organizationId": "00000000-0000-0000-0000-000000000001",
  "data": {
    "contractId": "ctr_9921ab4c",
    "clientName": "Nexus Health Inc.",
    "agreementType": "STATEMENT_OF_WORK",
    "signedAt": "2026-07-25T11:58:20Z",
    "documentPdfUrl": "https://s3.amazonaws.com/agencyos-contracts/ctr_9921ab4c.pdf"
  }
}
```
