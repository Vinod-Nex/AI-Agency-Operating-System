# Security Deployment Architecture & Network Controls
## AI Agency Operating System (AgencyOS)

---

## 1. Network & Infrastructure Security Controls

1. **HTTPS Everywhere & TLS 1.3**: TLS 1.3 enforced on AWS ALB and Vercel CDN; weak ciphers disabled.
2. **AWS WAF (Web Application Firewall)**: Attached to ALB with rules for SQL Injection (SQLi), Cross-Site Scripting (XSS), and Rate Limiting.
3. **Strict CORS Policy**: API Gateway restricts allowed origins strictly to `https://agencyos.io`.
4. **Content Security Policy (CSP)**: `default-src 'self'` header prevents unauthorized script execution.
5. **IAM Principle of Least Privilege**: Task roles restrict ECS tasks to specific S3 bucket prefixes and Secrets Manager secret ARNs.
