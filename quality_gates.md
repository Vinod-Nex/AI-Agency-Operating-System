# Quality Gates & Automated Validation Thresholds
## AI Agency Operating System (AgencyOS)

---

## 1. Automated Quality Gate Matrix

| Quality Parameter | Metric Target | Blocking Threshold |
| :--- | :--- | :--- |
| **Backend Code Coverage (JaCoCo)** | $\ge 85\%$ Branch & Line | $< 80\%$ fails build |
| **Frontend Code Coverage (Jest)** | $\ge 80\%$ Line Coverage | $< 75\%$ fails build |
| **Playwright E2E Test Suite** | $100\%$ Pass Rate | Any failing E2E test blocks PR |
| **Accessibility Audit (axe-core)** | $100\%$ WCAG 2.1 AA Compliant | Any Critical/Serious a11y violation blocks PR |
| **Core Web Vitals Performance** | $LCP < 2.2\text{s}$, $INP < 90\text{ms}$ | $LCP > 2.5\text{s}$ fails Lighthouse check |
