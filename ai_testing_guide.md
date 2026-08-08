# AI Testing Strategy & Validation Framework
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document provides the testing framework for validating OpenAI and Google Gemini provider integrations, mock provider test fixtures, prompt regression tests, JSON schema validation, and fallback verification.

---

## 2. Test Suite Matrix (8 Domain Test Cases)

| Test Category | Target Scenario | Verification Criteria | Test Suite Class |
| :--- | :--- | :--- | :--- |
| **1. OpenAI Integration** | Proposal Generation (`gpt-4o`)| Valid Markdown response returned; Token usage logged | `OpenAiProviderIntegrationTest` |
| **2. Gemini Integration** | Document RAG (`gemini-1.5-pro`)| 1M token context processed without error | `GeminiProviderIntegrationTest` |
| **3. Fallback Trigger Test**| OpenAI HTTP 500 Injection | Failover switches to Gemini; `X-AI-Fallback-Triggered` present | `ProviderFallbackStrategyTest` |
| **4. JSON Validation Test**| Structured JSON Extraction | Output conforms strictly to target JSON Schema | `JsonSchemaOutputValidationTest` |
| **5. Prompt Injection Test**| Delimiter Override Injection| System prompt rules preserved; Injection neutralized | `PromptInjectionSecurityTest` |
| **6. Stream Latency Test**| SSE Streaming Generation | Time-to-First-Token (TTFT) < 200ms | `AiStreamPerformanceTest` |
| **7. Quota Enforcement** | Monthly Budget Breach | HTTP 429 "Monthly AI Budget Exceeded" returned | `AiQuotaEnforcementTest` |
| **8. Prompt Regression** | System Prompt v1.3 Evaluation | LLM-as-a-Judge quality score >= 92/100 | `PromptEvaluationSuite` |

---

## 3. Automated Integration Test Example (JUnit 5 & WireMock)

```java
@SpringBootTest
@AutoConfigureWireMock(port = 8089)
class AiGatewayIntegrationTest {

    @Autowired
    private LlmModelRouter modelRouter;

    @Test
    void testOpenAiFallbackToGeminiOnTimeout() {
        // Mock OpenAI HTTP 503 Service Unavailable
        stubFor(post(urlEqualTo("/v1/chat/completions"))
            .willReturn(aResponse().withStatus(503)));

        // Mock Gemini HTTP 200 OK
        stubFor(post(urlPathMatching("/v1beta/models/gemini-1.5-pro.*"))
            .willReturn(aResponse().withStatus(200).withBody("{\"candidates\":[...]}")));

        PromptResponse response = modelRouter.routeRequest(new PromptRequest("Generate Proposal"));
        assertEquals(ProviderType.GEMINI, response.getProviderUsed());
    }
}
```
