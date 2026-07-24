import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" className="light">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white light">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
