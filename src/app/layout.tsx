import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CompanyProfileProvider } from "@/contexts/company-profile-context";
import { AppShell } from "@/components/layout/app-shell";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { CookieConsent } from "@/components/providers/cookie-consent";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cxmate.io";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "CX Mate — Map Your Customer Journey in Minutes",
    template: "%s | CX Mate",
  },
  description:
    "AI-powered CX intelligence for B2B startups. Map your full customer lifecycle, find every risk, and get a prioritized playbook — grounded in CCXP methodology.",
  keywords: [
    "customer experience",
    "customer journey mapping",
    "B2B SaaS CX",
    "CX strategy",
    "customer success",
    "CCXP",
    "AI customer experience",
    "journey map",
    "customer retention",
  ],
  authors: [{ name: "CX Mate" }],
  creator: "CX Mate",
  publisher: "CX Mate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "CX Mate",
    title: "CX Mate — Map Your Customer Journey in Minutes",
    description:
      "AI-powered CX intelligence for B2B startups. Map your full customer lifecycle, find every risk, and get a prioritized playbook — in one conversation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CX Mate — AI-Powered Customer Experience Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CX Mate — Map Your Customer Journey in Minutes",
    description:
      "AI-powered CX intelligence for B2B startups. One conversation. 50+ moments mapped. Grounded in CCXP methodology.",
    images: ["/og-image.png"],
    creator: "@cxmate_io",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          <CookieConsent />
        </PostHogProvider>
      </body>
    </html>
  );
}
