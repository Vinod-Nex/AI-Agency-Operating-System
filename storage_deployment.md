# Storage & S3 Asset Deployment Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Cloud Storage Infrastructure (AWS S3 / Cloudflare R2)

- **Primary Bucket**: `agencyos-production-contracts-s3`
- **Region**: `us-east-1`
- **Encryption**: AES-256 Server-Side Encryption (`SSE-S3`) enabled by default
- **Versioning**: Enabled (Retains document history)
- **CDN Distribution**: Amazon CloudFront distribution `assets.agencyos.io`

---

## 2. Directory Structure & Pre-Signed URL Strategy

```
s3://agencyos-production-contracts-s3/
├── contracts/
│   └── {tenant_id}/
│       └── {contract_id}.pdf
├── proposals/
│   └── {tenant_id}/
│       └── {proposal_id}.pdf
└── avatars/
    └── {user_id}.jpg
```

### Pre-Signed URL Expiry Policy
- **Contract Signature Downloads**: Pre-Signed GET URL generated with 15-minute expiration (`expiresIn: 900`).
- **Direct Asset Uploads**: Pre-Signed PUT URL generated with 5-minute expiration (`expiresIn: 300`).
