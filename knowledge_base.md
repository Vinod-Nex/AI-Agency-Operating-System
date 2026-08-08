# Vector RAG Knowledge Base & Retrieval Architecture
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details document ingestion pipelines, chunking strategies, vector store abstractions (RedisSearch / pgvector), hybrid keyword+vector search pipelines, and citation attribution mechanisms.

---

## 2. Ingestion & Retrieval Sequence Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Agency User
    participant Upload as Document Ingestion Controller
    participant Chunk as Chunking Engine (Recursive 512 Tokens)
    participant Embed as Embedding Generator (OpenAI text-embedding-3-small)
    participant VectorDB as Vector Store (RedisSearch / pgvector)
    participant Query as AI Query Pipeline

    Admin->>Upload: Upload Client PDF / SOW Document
    Upload->>Chunk: Parse Text & Split into Chunks (512 Tokens, 50 Overlap)
    
    loop For Each Chunk
        Chunk->>Embed: Generate Embedding Vector (1536 Dimensions)
        Embed-->>Chunk: Return Dense Vector Float Array
        Chunk->>VectorDB: Store Vector + Metadata (org_id, doc_id, page_num, chunk_id)
    end

    Note over Query: Query Retrieval Execution
    Admin->>Query: Ask AI: "What are the payment terms for Acquired Corp?"
    Query->>Embed: Embed Query String
    Query->>VectorDB: Hybrid Search (BM25 + Cosine Similarity)
    VectorDB-->>Query: Return Top-5 Ranked Chunks + Citation Offsets
    Query-->>Admin: Return AI Answer with Inline Citations [Doc: SOW_Acquired.pdf, Page 4]
```

---

## 3. Chunking Strategy & Metadata Schema

- **Strategy**: Recursive Character Text Splitter configured with chunk size of 512 tokens and 50-token overlap.
- **Chunk Metadata Record**:
```json
{
  "chunk_id": "chk_99182371-2391-4a11-82bf-112233445566",
  "document_id": "doc_77112233-4455-6677",
  "org_id": "org_55443322-1100",
  "project_id": "proj_112233",
  "file_name": "Agency_SOW_2026.pdf",
  "page_number": 4,
  "start_char": 1024,
  "end_char": 1536
}
```
