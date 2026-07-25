# Option B Deployment Specification: Vercel + AWS ECS Fargate + RDS + ElastiCache + S3
## AI Agency Operating System (AgencyOS)

---

## 1. Enterprise AWS Architecture Overview

Option B provides an enterprise-grade, SOC 2 compliant, multi-AZ cloud architecture on Amazon Web Services:
- **Frontend App**: Deployed on **Vercel** with custom domain `agencyos.io` and DNS routed via Amazon Route 53.
- **Backend Service**: Deployed on **AWS ECS Fargate** behind an AWS Application Load Balancer (ALB).
- **Relational Database**: **Amazon RDS PostgreSQL 16** (Multi-AZ Deployment with Read Replicas).
- **Cache**: **Amazon ElastiCache Redis 7** (Multi-AZ Replication Group).
- **Document & File Storage**: **AWS S3** with CloudFront CDN distribution.
- **Secrets & IAM**: AWS Secrets Manager & IAM Task Roles.

---

## 2. Infrastructure Setup & Configuration

### AWS VPC & Network Topology

```
VPC (10.0.0.0/16)
├── Public Subnets (10.0.1.0/24, 10.0.2.0/24)
│   ├── Application Load Balancer (ALB)
│   └── NAT Gateways
├── Private App Subnets (10.0.10.0/24, 10.0.11.0/24)
│   └── AWS ECS Fargate Tasks (Spring Boot Containers)
└── Private Isolated DB Subnets (10.0.20.0/24, 10.0.21.0/24)
    ├── Amazon RDS PostgreSQL 16 (Multi-AZ Primary & Secondary)
    └── Amazon ElastiCache Redis Cluster
```

### ECS Fargate Task Definition Snippet (`task-definition.json`)

```json
{
  "family": "agencyos-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "agencyos-backend-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/agencyos-backend:latest",
      "essential": true,
      "portMappings": [
        { "containerPort": 8080, "protocol": "tcp" }
      ],
      "environment": [
        { "name": "SPRING_PROFILES_ACTIVE", "value": "prod" },
        { "name": "SPRING_DATASOURCE_URL", "value": "jdbc:postgresql://agencyos-db.cluster-xxxx.us-east-1.rds.amazonaws.com:5432/agencyos" }
      ],
      "secrets": [
        { "name": "SPRING_DATASOURCE_PASSWORD", "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:agencyos/prod/db-password" },
        { "name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:agencyos/prod/jwt-secret" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

---

## 3. Route 53 & CloudFront Setup

1. **Route 53 Hosted Zone**: Create `agencyos.io`.
2. **ALB Alias Record**: Point `api.agencyos.io` to AWS ALB DNS name with ACM TLS Certificate.
3. **Vercel DNS CNAME**: Point `@` and `www` to `cname.vercel-dns.com`.
