# Frontend CI Pipeline Specification (`frontend-ci.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Pipeline Stages & Execution Commands

```yaml
name: Frontend CI Pipeline

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'app/**'
      - 'components/**'
      - 'package.json'
  pull_request:
    paths:
      - 'app/**'
      - 'components/**'

jobs:
  frontend-build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Code Formatting & ESLint Check
        run: npm run lint

      - name: TypeScript Type Verification
        run: npx tsc --noEmit

      - name: Run Component Unit Tests
        run: npm run test

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Execute Playwright E2E Tests
        run: npx playwright test

      - name: Build Next.js Production Bundle
        run: npm run build
```
