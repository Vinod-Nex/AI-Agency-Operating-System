# Option A Deployment Specification: Vercel + Railway + AWS S3
## AI Agency Operating System (AgencyOS)

---

## 1. Deployment Topology & Architecture Overview

Option A provides a streamlined, cost-efficient, high-performance deployment topology suitable for rapid scaling:
- **Frontend App**: Deployed on **Vercel** with Global Edge CDN caching.
- **Backend Service**: Deployed on **Railway** (Spring Boot 3.2 Java 21 container).
- **Relational Database**: **Railway PostgreSQL 16** (Managed Instance with Automated Backups).
- **Cache & Queue**: **Railway Redis 7** (Managed Redis Cluster).
- **Document & Asset Storage**: **Amazon Web Services (AWS) S3** (S3 Bucket with AES-256 server-side encryption).

---

## 2. Infrastructure Setup & Step-by-Step Configuration

### Step 1: Provision Railway PostgreSQL & Redis Services

1. Log into Railway Console and create project `agencyos-production`.
2. Provision **PostgreSQL 16**:
   - RAM: 4GB, CPU: 2 vCPU
   - Set Connection String variable `DATABASE_URL`.
3. Provision **Redis 7**:
   - RAM: 1GB, CPU: 1 vCPU
   - Set Connection String variable `REDIS_URL`.

### Step 2: Deploy Spring Boot Backend on Railway

1. Connect GitHub Repository `Vinod-Nex/AI-Agency-Operating-System`.
2. Set Build & Start Commands:
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/ai-agency-operating-system-0.1.0.jar`
3. Configure Environment Variables in Railway Console:
   ```env
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}
   SPRING_DATASOURCE_USERNAME=${PGUSER}
   SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}
   SPRING_REDIS_HOST=${REDISHOST}
   SPRING_REDIS_PORT=${REDISPORT}
   SPRING_REDIS_PASSWORD=${REDISPASSWORD}
   JWT_SECRET=super_secret_jwt_key_minimum_256_bits_length_here_12345
   AWS_S3_BUCKET=agencyos-production-contracts-s3
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   AWS_REGION=us-east-1
   ```

### Step 3: Deploy Next.js 15 Frontend on Vercel

1. Log into Vercel Dashboard and import `Vinod-Nex/AI-Agency-Operating-System`.
2. Framework Preset: `Next.js`
3. Set Build & Output Settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Set Environment Variables in Vercel Console:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://backend-production-agencyos.up.railway.app/api/v1
   NEXT_PUBLIC_APP_URL=https://agencyos.io
   ```
5. Attach Custom Domain: `agencyos.io` with SSL auto-provisioning.

---

## 3. Flyway Migration & Database Readiness

Flyway executes automatically during backend container startup via Spring Boot configuration:
```yaml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
```

---

## 4. Scaling & Health Verification

- **Railway Auto-Scaling**: Set memory alert threshold at $80\%$ usage to add instances.
- **Health Check Endpoint**: Vercel and Railway ping `GET /actuator/health` every 30 seconds.
