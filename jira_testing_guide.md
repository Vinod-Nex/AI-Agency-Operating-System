# Jira Integration Testing Strategy & Validation Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides a testing guide for validating Jira Cloud REST API v3 integrations, OAuth 2.0 3LO token rotation, webhook HMAC signature verification, bi-directional sync conflict resolution, and performance limits.

---

## 2. Testing Environments & Mock Fixtures

- **Atlassian Developer Sandbox**: Dedicated test site (`agencyos-test.atlassian.net`) provisioned with test projects (`TEST`), mock boards, and synthetic users.
- **WireMock REST Server**: Used during unit/integration test runs to mock Atlassian Cloud REST API v3 responses without requiring external network connectivity.

---

## 3. Test Suite Matrix (8 Domain Test Cases)

| Test Category | Target Scenario | Verification Criteria | Execution Command / Class |
| :--- | :--- | :--- | :--- |
| **1. OAuth 3LO Test** | Authorization & Token Exchange | Code exchanged for access & refresh tokens; Tokens encrypted in DB | `OAuthFlowIntegrationTest` |
| **2. Refresh Token Test** | Expired Access Token Refresh | Automatic token refresh triggered; Rolling refresh token updated | `TokenRefreshServiceTest` |
| **3. API v3 Issue Test** | Create Epic / Story / Task | Issue created in Jira Cloud; Returns valid Issue Key (`AGENCY-101`) | `JiraIssueApiIntegrationTest` |
| **4. Webhook Test** | `jira:issue_updated` Ingestion | Local DB state updated; Idempotent processing verified | `JiraWebhookControllerTest` |
| **5. Sync Conflict Test** | Simultaneous Local & Remote Edits | Conflict resolution rules applied; Conflict logged in audit table | `JiraSyncConflictResolverTest` |
| **6. Rate Limit Test** | Atlassian HTTP 429 Response | `Resilience4j` backoff triggers; Retries succeed after `Retry-After` | `JiraRateLimitBackoffTest` |
| **7. Permission Test** | RBAC Enforcement (`ROLE_VIEWER`) | Attempt to create Jira issue yields HTTP 403 Forbidden | `JiraRbacSecurityTest` |
| **8. Performance Test** | 5,000 Issue Bulk Sync | Sync completes in < 30s using paginated batch requests | `JiraPerformanceBenchmarkTest` |

---

## 4. Automated Integration Test Example (JUnit 5 & WireMock)

```java
@SpringBootTest
@AutoConfigureWireMock(port = 8089)
class JiraIntegrationTest {

    @Autowired
    private JiraIssueService jiraIssueService;

    @Test
    void testCreateJiraStorySuccess() {
        stubFor(post(urlEqualTo("/ex/jira/cloud_123/rest/api/3/issue"))
            .willReturn(aResponse()
                .withStatus(201)
                .withHeader("Content-Type", "application/json")
                .withBody("{\"id\":\"10001\",\"key\":\"TEST-101\",\"self\":\"https://site.atlassian.net/...\"}")));

        JiraIssueResponse response = jiraIssueService.createStory(connectionId, "TEST", "Summary", "Description");
        assertEquals("TEST-101", response.getJiraIssueKey());
    }
}
```
