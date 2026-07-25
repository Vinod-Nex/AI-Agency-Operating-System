# OpenAPI 3.1 Components, DTO Schemas & Swagger UI Specification
## AI Agency Operating System (AgencyOS)

---

## 1. OpenAPI 3.1 Security Schemes

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Enter HTTP Bearer JWT token issued by /api/v1/auth/login.
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-AgencyOS-API-Key
      description: API Key authentication for external webhook integrations.
```

---

## 2. Reusable Component DTO Schemas

```yaml
components:
  schemas:
    AuthResponseDTO:
      type: object
      required:
        - accessToken
        - refreshToken
        - tokenType
        - expiresIn
      properties:
        accessToken:
          type: string
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        refreshToken:
          type: string
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        tokenType:
          type: string
          example: "Bearer"
        expiresIn:
          type: integer
          example: 900

    ProposalDTO:
      type: object
      required:
        - id
        - clientName
        - projectTitle
        - status
        - generatedContentMarkdown
      properties:
        id:
          type: string
          format: uuid
          example: "prop_8923f01a-9921-4f81-a201-9012a9bc0412"
        clientName:
          type: string
          example: "Nexus Health Inc."
        projectTitle:
          type: string
          example: "HIPAA-Compliant Patient Portal"
        status:
          type: string
          enum: [DRAFT, GENERATED, SENT, ACCEPTED, REJECTED]
          example: "GENERATED"
        generatedContentMarkdown:
          type: string
          example: "# Executive Proposal\n\n## 1. Executive Summary..."
        tokensUsed:
          type: integer
          example: 3420
        createdAt:
          type: string
          format: date-time
          example: "2026-07-25T12:00:00Z"

    ProblemDetailsDTO:
      type: object
      required:
        - type
        - title
        - status
        - detail
        - instance
      properties:
        type:
          type: string
          example: "https://api.agencyos.io/errors/validation-error"
        title:
          type: string
          example: "Validation Error"
        status:
          type: integer
          example: 400
        detail:
          type: string
          example: "Validation Error: Client Name is required."
        instance:
          type: string
          example: "/api/v1/proposals/generate"
```

---

## 3. Swagger UI Integration Setup

SpringDoc OpenAPI 2.3+ configuration for Spring Boot:
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
    tags-sorter: alpha
    enabled: true
```
