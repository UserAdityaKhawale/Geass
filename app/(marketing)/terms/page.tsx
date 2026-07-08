
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white mb-8 transition-colors">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="text-sm text-neutral-500 mb-12">Last updated: July 7, 2026</p>

        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>By accessing and using Geass, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">2. Description of Service</h2>
            <p>Geass is an AI-powered productivity workspace for planning, execution, and focus. Features include task management, project tracking, focus sessions, and AI assistance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You agree not to use the service for any illegal purpose</li>
              <li>You will not attempt to gain unauthorized access to any part of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>All content, features, and functionality of Geass are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">5. Termination</h2>
            <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach these Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">6. Disclaimer</h2>
            <p>The service is provided on an “as is” and “as available” basis without any warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p>In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages arising out of your use of the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">8. Changes to Terms</h2>
            <p>We may modify these Terms at any time. By continuing to use the service after changes are posted, you agree to be bound by the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">9. Contact Us</h2>
            <p>For any questions about these Terms, please contact us via our social links.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
