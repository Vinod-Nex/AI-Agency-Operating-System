// AI Service Module - Integrates OpenAI API & Gemini API Keys for Quotation and Invoice Synthesis

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export interface CompanyDetails {
  companyName: string;
  registrationId: string;
  taxId: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  bankName: string;
  bankAccount: string;
  swiftIban: string;
}

export const DEFAULT_AGENCY_COMPANY: CompanyDetails = {
  companyName: "Apex Digital Studio LLC (AI Agency OS)",
  registrationId: "REG-US-9918237",
  taxId: "EIN: 98-4521098",
  address: "100 Innovation Way, Suite 400, San Francisco, CA 94107",
  email: "billing@agencyos.ai",
  phone: "+1 (800) 555-0199",
  website: "https://agencyos.ai",
  bankName: "Silicon Valley Business Bank",
  bankAccount: "9988-7766-5544-3321",
  swiftIban: "SVBBUS66XXX / US99SVBB9988776655443321"
};

export async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt || "You are an enterprise AI financial & proposal strategist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices[0]?.message?.content || "";
    }
  } catch (e) {
    console.warn("OpenAI API call error, falling back to local AI engine:", e);
  }
  return "";
}

export async function generateRichQuotationAI(params: {
  clientName: string;
  clientEmail?: string;
  projectBudget: string;
  timeline: string;
  industry: string;
  techStack: string;
  requirements: string;
  company?: CompanyDetails;
}): Promise<string> {
  const company = params.company || DEFAULT_AGENCY_COMPANY;

  const prompt = `
Generate an extremely detailed, professional enterprise Quotation / SOW Proposal Document for ${params.clientName}.
Company Issuing: ${company.companyName}, ${company.address}, ${company.taxId}, ${company.email}.
Budget: ${params.projectBudget}, Timeline: ${params.timeline}, Industry: ${params.industry}.
Tech Stack: ${params.techStack}.
Scope: ${params.requirements}.

Include:
1. Executive Summary & Company Profile
2. Detailed Technical Architecture & Technology Stack
3. Scope of Work (Phased Breakdown)
4. Milestone Payment Schedule & Tax Calculations
5. Terms & Legal Conditions (SLA Warranty, IP Ownership, Confidentiality)
6. Bank Wire Transfer Details & Acceptance Signatures.
  `;

  // Attempt real AI call first
  const aiResult = await callOpenAI(prompt);
  if (aiResult && aiResult.length > 200) {
    return aiResult;
  }

  // Fallback to rich, company-detailed document template
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return `# OFFICIAL ENTERPRISE COMMERCIAL QUOTATION
**Document Reference**: QUO-2026-${Math.floor(100000 + Math.random() * 900000)}
**Date of Issuance**: ${dateStr}
**Validity Period**: Valid until ${validUntil}

---

## 1. ISSUING COMPANY & CONTRACTOR INFORMATION
- **Company Name**: ${company.companyName}
- **Registration / TAX ID**: ${company.registrationId} | ${company.taxId}
- **Corporate Address**: ${company.address}
- **Official Contact**: ${company.email} | Phone: ${company.phone}
- **Website**: ${company.website}

## 2. CLIENT ORGANIZATION INFORMATION
- **Client Organization**: ${params.clientName}
- **Client Contact Email**: ${params.clientEmail || `contact@${params.clientName.toLowerCase().replace(/[^a-z]/g, "")}.com`}
- **Industry Vertical**: ${params.industry}
- **Project Target Timeline**: ${params.timeline}
- **Total Commercial Investment**: ${params.projectBudget} (USD)

---

## 3. EXECUTIVE SUMMARY & ARCHITECTURAL APPROACH
${company.companyName} is pleased to present this formal commercial quotation to **${params.clientName}**. 
Our engineering team will architect and deliver a high-availability, multi-tenant digital application designed to automate business operations, reduce manual throughput friction by over 80%, and enforce enterprise SOC 2 compliance.

### Recommended Technology Stack
- **Frontend Architecture**: ${params.techStack.split(",")[0] || "Next.js 15, React 19, TypeScript, Tailwind CSS"}
- **Backend Service Layer**: ${params.techStack.split(",")[1] || "Spring Boot (Java 21), REST API Engine"}
- **Data & Persistence**: ${params.techStack.split(",")[2] || "PostgreSQL 16 Multi-tenant DB with Redis 7.2 Caching"}
- **AI & Integrations**: ${params.techStack.split(",")[3] || "OpenAI GPT-4o, Google Gemini 2.0 Flash, Stripe Billing"}

---

## 4. DETAILED SCOPE OF WORK & DELIVERABLE BREAKDOWN
${params.requirements.split("\n").map((r) => `> - ${r}`).join("\n")}

### Phase Breakdown
1. **Phase 1: Discovery, Architecture & DB Schema** (Weeks 1-2)
   - Requirements blueprint, Flyway DB schema migration, API specification.
2. **Phase 2: Core Platform & Feature Build** (Weeks 3-6)
   - Microservices development, responsive frontend dashboards, Stripe payment gateway.
3. **Phase 3: Security Hardening & Integration Audit** (Weeks 7-8)
   - SOC 2 compliance audits, SAST/DAST vulnerability scans, third-party API sync.
4. **Phase 4: Production Launch & 90-Day Hypercare** (Weeks 9-10)
   - Production cutover, 24/7 SLA war room support, end-user documentation.

---

## 5. COMMERCIAL INVESTMENT & PAYMENT SCHEDULE
The total fixed commercial investment is **${params.projectBudget}** (+ 8% Tax where applicable).

| Payment Milestone | Deliverable Scope | Invoice % | Amount |
| :--- | :--- | :---: | :--- |
| **Milestone 1: Project Mobilization** | Discovery & DB Blueprint | 25% | Included in Schedule |
| **Milestone 2: Beta Platform Release** | Functional Microservices & UI | 35% | Included in Schedule |
| **Milestone 3: Integration & Security** | QA & Pen-test Sign-off | 25% | Included in Schedule |
| **Milestone 4: Final Production Cutover**| Production Launch & Hand-off | 15% | Included in Schedule |

---

## 6. BANK PAYMENT & WIRE TRANSFER DETAILS
Payments should be remitted via Wire Transfer / ACH to the following official company account:
- **Bank Name**: ${company.bankName}
- **Account Number**: ${company.bankAccount}
- **SWIFT / IBAN Code**: ${company.swiftIban}

---

## 7. TERMS, CONDITIONS & FORMAL ACCEPTANCE
1. **Intellectual Property**: Upon full payment, all custom source code, documentation, and IP rights transfer 100% to **${params.clientName}**.
2. **Confidentiality**: Both parties agree to maintain strict NDA non-disclosure compliance.
3. **SLA Warranty**: Includes 90-day post-launch warranty for bug fixes and performance tuning.

**Issued By (${company.companyName})**: ___________________________  
**Client Acceptance (${params.clientName})**: ___________________________  
**Date**: ${dateStr}
  `;
}

export async function generateRichInvoiceAI(params: {
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  dueDate: string;
  items: Array<{ description: string; quantity: number; rate: number }>;
  taxRate?: number;
  company?: CompanyDetails;
}): Promise<string> {
  const company = params.company || DEFAULT_AGENCY_COMPANY;
  const taxRate = params.taxRate || 0.08;
  const subtotal = params.items.reduce((acc, i) => acc + i.quantity * i.rate, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const prompt = `
Generate a complete, official commercial Invoice document for ${params.clientName}.
Invoice Number: ${params.invoiceNumber}, Date: ${dateStr}, Due Date: ${params.dueDate}.
Company Billed From: ${company.companyName}, ${company.taxId}, ${company.address}.
Line Items: ${JSON.stringify(params.items)}.
Subtotal: $${subtotal}, Tax (8%): $${tax}, Total: $${total}.
Include Bank details (${company.bankName}, ${company.bankAccount}) and Payment Terms.
  `;

  // Attempt real AI call first
  const aiResult = await callOpenAI(prompt);
  if (aiResult && aiResult.length > 200) {
    return aiResult;
  }

  // Fallback to rich structured invoice document
  return `# OFFICIAL INVOICE & PAYMENT RECEIPT
**Invoice Number**: ${params.invoiceNumber}
**Date of Issuance**: ${dateStr}
**Payment Due Date**: ${params.dueDate}
**Payment Status**: PENDING / DUE

---

## 1. ISSUER & CONTRACTOR INFORMATION
- **Company Name**: ${company.companyName}
- **Tax Registration / EIN**: ${company.taxId} | ${company.registrationId}
- **Corporate Address**: ${company.address}
- **Billing Inquiry Email**: ${company.email} | Phone: ${company.phone}

## 2. BILLED TO (CLIENT DETAILS)
- **Client Organization**: ${params.clientName}
- **Client Email**: ${params.clientEmail || `billing@${params.clientName.toLowerCase().replace(/[^a-z]/g, "")}.com`}
- **Payment Method**: Stripe ACH / Credit Card / Wire Transfer

---

## 3. ITEMIZED INVOICE LINE ITEMS

| Item # | Description of Services / Deliverable | Qty | Rate (USD) | Total Amount |
| :--- | :--- | :---: | :---: | :---: |
${params.items.map((item, idx) => `| ${idx + 1} | ${item.description} | ${item.quantity} | $${item.rate.toLocaleString()} | $${(item.quantity * item.rate).toLocaleString()} |`).join("\n")}

---

## 4. FINANCIAL SUMMARY & TAX BREAKDOWN
- **Subtotal**: $${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
- **Tax (8.00% VAT/Sales Tax)**: $${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
- **TOTAL BALANCE DUE**: **$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD**

---

## 5. REMITTANCE & BANK WIRE TRANSFER DETAILS
Please remit payment by the due date (${params.dueDate}) using one of the following methods:

### Option A: Online Stripe Payment
Pay instantly via credit card or bank ACH using our secure gateway:  
` + "`https://pay.stripe.com/invoice/" + params.invoiceNumber.toLowerCase() + "`" + `

### Option B: Bank Wire Transfer
- **Bank Name**: ${company.bankName}
- **Account Number**: ${company.bankAccount}
- **SWIFT / IBAN**: ${company.swiftIban}
- **Beneficiary**: ${company.companyName}

---

## 6. PAYMENT TERMS & AUDIT NOTE
- Late payments are subject to a 1.5% monthly service fee.
- Thank you for your business! For billing questions, contact ${company.email}.
  `;
}
