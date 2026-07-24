import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agency Operating System | Automate Your Entire Agency Workflow",
  description: "Enterprise SaaS platform empowering agencies with AI Proposals, SOWs, Contracts, Invoices, Meeting Minutes, and Jira Stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
