# Database CI & Schema Drift Pipeline (`database-ci.yml`)
## AI Agency Operating System (AgencyOS)

---

## 1. Database CI Verification Steps

```yaml
name: Database CI Pipeline

on:
  push:
    paths:
      - 'src/main/resources/db/migration/**'

jobs:
  validate-migrations:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: agencyos_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Validate Flyway Checksums
        run: mvn flyway:validate -Dflyway.url=jdbc:postgresql://localhost:5432/agencyos_test -Dflyway.user=postgres -Dflyway.password=postgrespassword

      - name: Test Migration Dry Run
        run: mvn flyway:migrate -Dflyway.url=jdbc:postgresql://localhost:5432/agencyos_test -Dflyway.user=postgres -Dflyway.password=postgrespassword
```
