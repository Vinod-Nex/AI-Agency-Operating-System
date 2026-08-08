# Global Infrastructure Scaling & Multi-Region Cloud Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the cloud infrastructure expansion roadmap across AWS, Vercel, Railway, multi-region database replication, CDN edge caching, auto-scaling policies, and disaster recovery.

---

## 2. Infrastructure Evolution Phases

```mermaid
graph TD
    subgraph Phase 1: Launch Stack (Single Region)
        FE1[Vercel Edge Network] --> API1[Railway Spring Boot Containers]
        API1 --> DB1[(AWS RDS PostgreSQL - US-East-1)]
        API1 --> RD1[(AWS ElastiCache Redis - US-East-1)]
    end

    subgraph Phase 2: Year 2 Multi-Region Architecture
        FE2[Vercel Edge Anycast CDN]
        FE2 --> GW_US[AWS ECS Fargate Gateway - US-East-1]
        FE2 --> GW_EU[AWS ECS Fargate Gateway - EU-Central-1]

        GW_US --> DB_PRIMARY[(AWS Aurora PostgreSQL - Primary US-East)]
        GW_EU --> DB_REPLICA[(AWS Aurora PostgreSQL - Read Replica EU-Central)]
        
        GW_US --> RD_GLOBAL[(Redis Global Datastore - Multi-Region)]
        GW_EU --> RD_GLOBAL
    end
```

---

## 3. Auto-Scaling Policies & Capacity Targets

| Infrastructure Tier | Scaling Indicator | Scaling Threshold | Min Replica Count | Max Replica Count |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API (ECS)** | CPU Utilization | > 70% for 2m | 3 Pods | 50 Pods |
| **Backend API (ECS)** | Memory Utilization | > 80% for 2m | 3 Pods | 50 Pods |
| **Worker Nodes** | Queue Backlog Depth | > 500 Jobs | 2 Instances | 30 Instances |
| **Redis Cache** | Memory Pressure | > 75% MaxMemory | 2 Nodes (Cluster) | 12 Nodes (Sharded) |
| **PostgreSQL RDS** | Active Connections | > 80% Pool Limit | Primary + 1 Replica | Primary + 5 Replicas |

---

## 4. Multi-Region Disaster Recovery (DR) SLA

- **Recovery Point Objective (RPO)**: < 1 Minute (Continuous Aurora Multi-Region Replication).
- **Recovery Time Objective (RTO)**: < 5 Minutes (Automated DNS Failover via Route 53 Health Checks).
- **Annual DR Drills**: Conducted semi-annually in QA and Staging environments.
