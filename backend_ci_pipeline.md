# Backend CI Pipeline Specification (`backend-ci.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Pipeline Stages & Execution Commands

```yaml
name: Backend CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'

      - name: Verify Spotless Code Formatting
        run: mvn spotless:check

      - name: Execute Unit & Integration Tests
        run: mvn clean test

      - name: Generate JaCoCo Code Coverage Report
        run: mvn jacoco:report

      - name: Validate JaCoCo Thresholds (85% minimum)
        run: mvn jacoco:check
```
