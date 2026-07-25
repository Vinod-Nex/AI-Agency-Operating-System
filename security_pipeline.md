# DevSecOps & Security Pipeline Specification (`security-pipeline.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Security Tools & Scanning Matrix

| Security Scanner | Inspection Target | Execution Frequency | Failure Threshold |
| :--- | :--- | :--- | :--- |
| **CodeQL** | Static Application Security Testing (SAST) | On every PR & nightly | Any High / Critical alert |
| **Snyk** | Frontend & Backend third-party dependencies | On every PR | High / Critical CVSS $> 7.0$ |
| **Trivy** | Production Docker Container Base Images | On ECR Image Push | Critical Vulnerabilities |
| **OWASP Dependency-Check** | Java Maven POM dependencies | Weekly Scheduled Build | CVE Score $> 7.0$ |

---

## 2. Software Bill of Materials (SBOM) Generation

Generated during build using `cyclonedx-maven-plugin` and uploaded as workflow artifact `sbom-cyclonedx.json`.
