# Redis Cache, Queue & Session Deployment Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Redis 7 Deployment Topology

- **Managed Engine**: Amazon ElastiCache Redis 7.0 (Multi-AZ Cluster)
- **Node Type**: `cache.m6g.large` (2 vCPU, 6.38 GB RAM)
- **Replication**: 1 Primary + 2 Read Replicas across 3 Availability Zones
- **Eviction Policy**: `allkeys-lru` (Least Recently Used)

---

## 2. Redis Usage & TTL Matrix

| Storage Category | Key Pattern | TTL Duration | Purpose |
| :--- | :--- | :--- | :--- |
| **API Response L2 Cache** | `dashboard:org:{orgId}` | 60 Seconds | Caches expensive KPI aggregation metrics |
| **User Session / Refresh Tokens** | `refresh_token:{userId}:{token}` | 7 Days (604,800s) | Stores revocable refresh tokens |
| **Rate Limit Buckets** | `rate_limit:ip:{ipAddress}` | 60 Seconds | Fixed-window rate limiting counter |
| **AI Proposal Drafts** | `proposal:draft:{proposalId}` | 15 Minutes (900s) | Caches in-flight AI synthesis drafts |
| **Async Task Queue** | `queue:ai_synthesis_tasks` | Persistent / Stream | Job queue for background LLM processing |
