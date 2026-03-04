import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

export const metadata: Metadata = {
  title: "Terms of Service — CX Mate",
  description: "The terms governing your use of CX Mate.",
};

const LAST_UPDATED = "March 2026";
const CONTACT_EMAIL = "hello@cxmate.io";

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="text-base text-slate-600 leading-relaxed mb-8">
          <p>
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using CX Mate.
            By accessing or using our services, you agree to be bound by these Terms.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or using CX Mate in any way, you agree to these Terms and our{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
            If you do not agree, do not use our services.
          </p>
          <p>
            If you are using CX Mate on behalf of a company or organization, you represent that you have
            the authority to bind that entity to these Terms.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            CX Mate is an AI-powered customer experience intelligence platform. Our service helps B2B companies:
          </p>
          <ul>
            <li>Map their customer journey and identify meaningful moments</li>
            <li>Generate CX intelligence reports with impact projections</li>
            <li>Receive prioritized action playbooks</li>
          </ul>
          <p>
            <strong>AI-generated content:</strong> CX Mate uses artificial intelligence to generate journey maps,
            reports, and recommendations. AI output is for informational purposes only and should not be
            treated as professional legal, financial, or business advice. Always apply your own judgment.
          </p>
        </Section>

        <Section title="3. Account Registration">
          <p>You must create an account to save your results. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Keep your password secure and confidential</li>
            <li>Notify us immediately of any unauthorized access to your account</li>
            <li>Be responsible for all activity that occurs under your account</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You may not use CX Mate to:</p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Attempt to gain unauthorized access to our systems or other users&rsquo; accounts</li>
            <li>Transmit malicious code, spam, or other harmful content</li>
            <li>Resell, sublicense, or commercially exploit our services without written permission</li>
            <li>Reverse engineer, decompile, or extract our AI models or proprietary methodology</li>
            <li>Use our services for any unlawful or fraudulent purpose</li>
          </ul>
        </Section>

        <Section title="5. Subscriptions and Billing">
          <p>
            Certain features of CX Mate require a paid subscription. By subscribing, you agree to pay
            the applicable fees as described on our{" "}
            <Link href="/pricing" className="text-teal-600 hover:underline">pricing page</Link>.
          </p>
          <ul>
            <li><strong>Billing cycle:</strong> Subscriptions are billed monthly or annually, depending on your plan.</li>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time. Access continues until the end of your billing period.</li>
            <li><strong>Refunds:</strong> We offer a 7-day refund for new subscriptions if you are not satisfied. Contact us at {CONTACT_EMAIL} within 7 days of your first charge.</li>
            <li><strong>Price changes:</strong> We will provide 30 days&rsquo; notice of any price changes.</li>
          </ul>
          <p>
            Payments are processed by Stripe. By providing payment information, you agree to{" "}
            <a href="https://stripe.com/legal/ssa" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              Stripe&rsquo;s terms
            </a>.
          </p>
        </Section>

        <Section title="6. Your Content">
          <p>
            You retain ownership of all content and data you provide to CX Mate (&ldquo;Your Content&rdquo;).
            By using our services, you grant us a limited license to use, store, and process Your Content
            solely to provide and improve our services.
          </p>
          <p>
            You are responsible for ensuring you have the right to share any business information you input.
            Do not input sensitive personal data about individuals (such as customer PII) into CX Mate.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            CX Mate, including our AI methodology, software, design, and generated framework content,
            is protected by intellectual property laws. You may not copy, reproduce, or create derivative
            works from our proprietary systems without written permission.
          </p>
          <p>
            AI-generated output (your journey maps, reports, and playbooks) belongs to you.
            You may use, share, and publish your generated results without restriction.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            CX Mate is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that:
          </p>
          <ul>
            <li>Our services will be uninterrupted or error-free</li>
            <li>AI-generated recommendations will achieve any specific business outcome</li>
            <li>Revenue impact projections will be accurate for your specific situation</li>
          </ul>
          <p>
            AI projections and benchmarks are estimates based on industry data and should be used as
            directional guidance only.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, CX Mate shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of our services.
            Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </Section>

        <Section title="10. Indemnification">
          <p>
            You agree to indemnify and hold harmless CX Mate from any claims, losses, or expenses arising
            from your use of our services, violation of these Terms, or infringement of any third-party rights.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We may suspend or terminate your account if you violate these Terms or engage in activity that
            harms our services or other users. You may delete your account at any time from your account settings.
          </p>
          <p>
            Upon termination, your right to use CX Mate ends immediately. We will retain your data for
            30 days post-termination before deletion, unless required by law to retain it longer.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material changes via email
            or by posting a notice in the product. Continued use of CX Mate after changes constitutes
            acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms are governed by the laws of the jurisdiction in which CX Mate is incorporated,
            without regard to its conflict of law provisions.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            If you have questions about these Terms, contact us at:
          </p>
          <address className="not-italic text-sm text-slate-600">
            <strong>CX Mate</strong><br />
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">{CONTACT_EMAIL}</a>
          </address>
        </Section>

        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link href="/privacy" className="text-sm text-teal-600 hover:underline">
            View Privacy Policy →
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
