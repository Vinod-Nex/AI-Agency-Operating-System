# Prompt Versioning, Evaluation & Rollback Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the prompt version control lifecycle, semantic versioning rules (`v1.2.0`), LLM-as-a-Judge evaluation pipelines, A/B prompt testing framework, and instant prompt rollback mechanics.

---

## 2. Prompt Lifecycle & Versioning Architecture

```mermaid
graph TD
    Dev[Prompt Engineer / Developer] -->|1. Commit Prompt v1.3.0-draft| Registry[PostgreSQL prompt_templates Table]
    Registry -->|2. Run Test Suite| Eval[Prompt Evaluation Engine]
    
    subgraph Automated Evaluation Suite
        Eval -->|Check JSON Validity| V1[JSON Schema Validator]
        Eval -->|Measure ROUGE / BLEU| V2[Similarity Scorer]
        Eval -->|Run GPT-4o Evaluation| V3[LLM-as-a-Judge]
    end

    V1 & V2 & V3 -->|Pass Score >= 92%| Publish[Mark Status: PUBLISHED]
    Publish -->|3. Deploy A/B Traffic Split| Router[AI Gateway Router]
    
    Router -->|90% Traffic| V12[Prompt v1.2.0 (Stable)]
    Router -->|10% Traffic| V13[Prompt v1.3.0 (Canary)]

    V13 -->|Detect Error / Quality Drop| Rollback[Instant Rollback to v1.2.0]
```

---

## 3. Business Rules & Versioning Convention

1. **Semantic Versioning (`MAJOR.MINOR.PATCH`)**:
   - `MAJOR`: Breaking changes to output schema (e.g. JSON structural modification).
   - `MINOR`: System prompt tuning or formatting enhancement.
   - `PATCH`: Typo fix or minor constraint adjustment.
2. **Immutable Published Versions**: Once a prompt version is marked `PUBLISHED`, it becomes read-only in the database. Any edits require creating a new version.
3. **Rollback SLA**: Reverting a prompt version takes effect instantly across all backend API nodes without service restarts (< 5 seconds via Redis pub/sub cache eviction).
