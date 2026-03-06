import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

export const metadata: Metadata = {
  title: "Privacy Policy — CX Mate",
  description: "How CX Mate collects, uses, and protects your data.",
};

const LAST_UPDATED = "March 2026";
const CONTACT_EMAIL = "hello@cxmate.io";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-bold tracking-tight text-slate-900">CX Mate</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            CX Mate (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and share information about you when you use our services.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect information you provide directly to us, such as:</p>
            <ul>
              <li><strong>Account information:</strong> Your name, email address, and password when you create an account.</li>
              <li><strong>Business information:</strong> Company name, website, industry, business stage, and other information you provide during onboarding.</li>
              <li><strong>Usage data:</strong> Information about how you interact with our services, including pages visited, features used, and actions taken.</li>
              <li><strong>Communications:</strong> Messages you send us, including support requests and feedback.</li>
            </ul>
            <p>We also collect information automatically when you use our services:</p>
            <ul>
              <li><strong>Log data:</strong> IP address, browser type, operating system, referring URLs, and pages viewed.</li>
              <li><strong>Cookies and similar technologies:</strong> We use cookies and local storage to maintain your session and preferences. See our Cookie section below.</li>
              <li><strong>Analytics:</strong> We use PostHog to understand how users interact with our product. PostHog may collect device information, usage patterns, and session recordings to help us improve CX Mate.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized CX journey maps and recommendations using AI</li>
              <li>Send transactional emails (account confirmation, password reset, results digest)</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyze trends, usage, and activity to improve our product</li>
              <li>Detect, investigate, and prevent security incidents and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              <strong>AI processing:</strong> Your business data is sent to Anthropic&rsquo;s Claude API to generate journey maps and recommendations.
              We do not use your data to train AI models. Anthropic&rsquo;s data handling is governed by their{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Privacy Policy</a>.
            </p>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>We do not sell your personal information. We share your information only in the following circumstances:</p>
            <ul>
              <li><strong>Service providers:</strong> We share data with third-party vendors who help us operate our services (Supabase for database, Resend for email, Anthropic for AI, PostHog for analytics, Freemius for payments). Each is bound by data processing agreements.</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
              <li><strong>Business transfers:</strong> If CX Mate is acquired or merged, your information may be transferred as part of that transaction.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your account information for as long as your account is active or as needed to provide our services.
              Journey maps, CX reports, and playbook data are retained until you delete your account.
              Anonymous preview data (stored in your browser only) is not retained on our servers.
            </p>
            <p>
              You can request deletion of your account and associated data by contacting us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="5. Cookies and Tracking">
            <p>We use the following types of cookies and storage:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for authentication and security. Cannot be disabled.</li>
              <li><strong>Analytics cookies:</strong> PostHog uses cookies to track usage and session recordings. You can opt out via our cookie banner.</li>
              <li><strong>Session storage:</strong> We temporarily store your journey data in your browser&rsquo;s session storage during the anonymous preview flow. This data is not sent to our servers unless you create an account.</li>
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format.</li>
              <li><strong>Opt-out:</strong> Opt out of analytics tracking via our cookie banner.</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We implement industry-standard security measures including encryption in transit (HTTPS/TLS),
              encryption at rest for database content, and row-level security on all user data.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              CX Mate is intended for business use and is not directed to children under 16.
              We do not knowingly collect personal information from children.
            </p>
          </Section>

          <Section title="9. International Transfers">
            <p>
              Your information may be transferred to and processed in countries other than your own.
              Our servers are located in the United States. If you are accessing CX Mate from outside the United States,
              please be aware that your information may be transferred to, stored, and processed in the U.S.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by
              posting the new policy on this page with an updated date, or by email if the changes significantly
              affect your rights.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <address className="not-italic">
              <strong>CX Mate</strong><br />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>
            </address>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link href="/terms" className="text-sm text-teal-600 hover:underline">
            View Terms of Service →
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
            Back to CX Mate
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_a]:text-teal-600 [&_a:hover]:underline">
        {children}
      </div>
    </section>
  );
}
