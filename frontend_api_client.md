# Frontend API Client & TanStack Query Architecture Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Architecture

The **Next.js 15 Frontend API Layer** is structured around **Axios** (HTTP Client with Interceptors) and **TanStack Query v5** (Server State Management & Caching).

```
[ UI React Component ]
          │
          ▼ (Custom React Hook)
[ TanStack Query Hook (e.g. useProposals) ]
          │
          ▼ (API Service Method)
[ ProposalService.ts ]
          │
          ▼ (Axios Intercepted Client)
[ apiClient.ts ] ──> HTTP Request with Bearer JWT Header
```

---

## 2. TanStack Query Key Factory (`lib/queryKeys.ts`)

```typescript
export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    metrics: () => [...queryKeys.dashboard.all, "metrics"] as const,
    activeProjects: () => [...queryKeys.dashboard.all, "projects"] as const,
  },
  proposals: {
    all: ["proposals"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.proposals.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.proposals.all, "detail", id] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.invoices.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.invoices.all, "detail", id] as const,
  },
};
```

---

## 3. Custom Query Hook Example (`hooks/useProposalGenerator.ts`)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";

interface GenerateProposalPayload {
  clientName: string;
  projectTitle: string;
  budget: number;
  timelineWeeks: number;
  scopeObjectives: string;
}

export function useGenerateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GenerateProposalPayload) => {
      const response = await apiClient.post("/proposals/generate", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proposals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
```
