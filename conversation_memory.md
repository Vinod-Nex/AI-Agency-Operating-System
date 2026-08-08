# Conversation Memory & Context Window Management Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details the multi-tier conversation memory architecture, token context window management algorithms, sliding window truncation, and long-term memory summarization across AgencyOS.

---

## 2. Multi-Tier Conversation Memory Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONVERSATION MEMORY HIERARCHY                        │
├─────────────────┬───────────────────┬───────────────────────────────────┤
│ Tier Level      │ Scope & Lifetime  │ Storage Engine & Truncation       │
├─────────────────┼───────────────────┼───────────────────────────────────┤
│ 1. Short-Term   │ In-flight Chat    │ Redis RAM (Sliding 10 Turns)      │
│ 2. Project      │ Specific Project  │ PostgreSQL `ai_conversations`     │
│ 3. Workspace    │ Active Workspace  │ Vector RAG + Summaries            │
│ 4. Organization │ Multi-Workspace   │ Long-Term Knowledge Index (S3)    │
└─────────────────┴───────────────────┴───────────────────────────────────┘
```

---

## 3. Sliding Window Context Truncation Algorithm

When a conversation history exceeds the target model's context budget (e.g. 128k tokens for OpenAI GPT-4o or 1M tokens for Gemini 1.5 Pro):

1. **System Prompt Reservation**: Always reserve 100% of System Prompt tokens.
2. **Recent Window Preservation**: Retain the last 6 messages (`user` + `assistant` turns) in full raw format.
3. **Older History Summarization**: Older messages beyond the last 6 turns are passed to a background worker using `gemini-2.0-flash` to compile a dense 200-token summary: `[SUMMARY OF PAST TURNS: User approved proposal budget of $50k...]`.
4. **Token Budget Assembly**:
   $$\text{Total Tokens} = \text{Tokens}(\text{SystemPrompt}) + \text{Tokens}(\text{PastSummary}) + \text{Tokens}(\text{RAGContext}) + \text{Tokens}(\text{Recent6Turns})$$
