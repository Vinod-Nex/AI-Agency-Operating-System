# API Testing, Automation & Contract Verification Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Test Automation Strategy

Testing across the **AgencyOS** API ecosystem spans four distinct automated testing layers:
1. **Backend Integration Tests**: REST Assured + Testcontainers (PostgreSQL & Redis).
2. **Frontend Mock APIs**: Mock Service Worker (MSW) for offline & isolated UI testing.
3. **End-to-End Contract Tests**: Playwright API Request Context & TestSprite AI MCP engine.
4. **Postman / Newman Collections**: Automated API regression testing in CI/CD.

---

## 2. REST Assured Backend Test Example (`ProposalControllerTest.java`)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ProposalControllerTest {

    @LocalServerPort
    private int port;

    @Test
    void shouldGenerateProposalSuccessfully() {
        String requestPayload = """
            {
                "clientName": "Nexus Health Inc.",
                "projectTitle": "Patient Portal",
                "budget": 65000.00,
                "timelineWeeks": 12,
                "scopeObjectives": "Build secure HIPAA portal"
            }
        """;

        given()
            .port(port)
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + getValidJwtToken())
            .body(requestPayload)
        .when()
            .post("/api/v1/proposals/generate")
        .then()
            .statusCode(201)
            .body("status", equalTo("GENERATED"))
            .body("clientName", equalTo("Nexus Health Inc."));
    }
}
```
