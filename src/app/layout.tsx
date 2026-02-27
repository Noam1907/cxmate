import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CompanyProfileProvider } from "@/contexts/company-profile-context";
import { AppShell } from "@/components/layout/app-shell";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CX Mate - AI-Powered Customer Experience",
  description:
    "Transform your customer journey with AI-powered CX orchestration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <PostHogProvider>
          <CompanyProfileProvider>
            <AppShell>{children}</AppShell>
          </CompanyProfileProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
