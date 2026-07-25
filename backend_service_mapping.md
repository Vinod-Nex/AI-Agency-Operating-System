# Backend Service & Domain Layer Mapping Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Layered Architecture

The Spring Boot 3.2+ backend follows a clean, DDD-inspired layered architecture:

```
[ REST Controller Layer ] (@RestController, @PreAuthorize)
           │
           ▼ (DTO Validation & Transformation)
[ Service Business Layer ] (@Service, @Transactional)
           │
           ▼ (Domain Logic & Event Publishing)
[ Spring Data JPA Repository ] (@Repository, PostgreSQL)
```

---

## 2. Controller-Service-Repository Flow Directory

### Proposal Generation Subsystem

```
ProposalController
  ├── POST /api/v1/proposals/generate (@Valid ProposalCreateDTO)
  └── ProposalService.generateProposal(dto, tenantId)
        ├── ProposalRepository.save(draftEntity)
        ├── AISynthesisEngine.invokePromptChain(dto)
        ├── ProposalRepository.save(generatedEntity)
        └── EventPublisher.publishEvent(ProposalGeneratedEvent)
```

---

## 3. Transactional & Audit Isolation Rules

1. **Transaction Scoping**: All mutation service methods annotated with `@Transactional(rollbackFor = Exception.class)`.
2. **Tenant Scoping**: All repository queries include `WHERE organizationId = :orgId AND isDeleted = false`.
3. **Audit Logging**: Spring Data JPA `@EntityListeners(AuditingEntityListener.class)` populates `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
