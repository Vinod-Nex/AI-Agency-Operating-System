# Enterprise Google Chat API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details the Google Chat API integration for sending interactive space notifications, approval request cards (Proposal / SOW approval), deployment alerts, invoice alerts, and AI interactive support bot responses.

---

## 2. Interactive Card Message Payload Example

Google Chat interactive cards display rich metadata and actionable buttons:

```json
{
  "cardsV2": [
    {
      "cardId": "proposal_approval_101",
      "card": {
        "header": {
          "title": "New Proposal Requires Approval",
          "subtitle": "Acme Corp - $75,000 USD",
          "imageUrl": "https://app.agencyos.ai/icons/proposal.png"
        },
        "sections": [
          {
            "widgets": [
              {
                "textParagraph": {
                  "text": "Project Lead Jane Doe has finalized the AI proposal for Acme Corp."
                }
              },
              {
                "buttonList": {
                  "buttons": [
                    {
                      "text": "Approve Proposal",
                      "onClick": {
                        "openLink": {
                          "url": "https://app.agencyos.ai/proposals/prop_88776655/approve"
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```
