export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-white/40 text-sm mb-2">Legal</p>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: 1 June 2026</p>

      <div className="space-y-8 text-white/70 leading-relaxed text-sm">

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">1. Who we are</h2>
          <p>PhotoInstant is operated by Vianney Dubourg (ABN: <strong className="text-white">[YOUR ABN]</strong>). This Privacy Policy explains how we collect, use, and protect your personal information in accordance with the <strong className="text-white">Australian Privacy Act 1988</strong> and the Australian Privacy Principles (APPs).</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">2. What information we collect</h2>
          <ul className="space-y-2 list-none">
            {[
              ['Email address', 'Provided voluntarily when downloading our brochure or via Stripe at checkout. Used to send your download link and order confirmation.'],
              ['Payment information', 'Handled entirely by Stripe. We never see or store your card number, expiry date or CVV.'],
              ['Stripe data', 'Stripe may share your email address with us after a successful payment so we can send your download link.'],
              ['Usage data', 'Standard server logs (IP address, browser type, pages visited). Not linked to personal identity.'],
            ].map(([title, desc]) => (
              <li key={title as string} className="flex gap-3">
                <span className="text-accent-light mt-0.5">→</span>
                <span><strong className="text-white">{title as string}:</strong> {desc as string}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">We do not collect names, phone numbers, or physical addresses unless you voluntarily provide them (e.g. in an email inquiry).</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">3. How we use your information</h2>
          <ul className="space-y-1 list-none">
            {[
              'To deliver your purchased photo download link',
              'To send the requested brochure PDF (if you submitted the brochure form)',
              'To contact you about your order if there is an issue',
              'To follow up on business inquiries (brochure leads only)',
              'To comply with legal obligations',
            ].map(item => (
              <li key={item} className="flex gap-3">
                <span className="text-accent-light">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">We do not sell, rent or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">4. Third-party services</h2>
          <ul className="space-y-2">
            <li><strong className="text-white">Stripe</strong> — payment processing. Your payment data is governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">Stripe's Privacy Policy</a>.</li>
            <li><strong className="text-white">Supabase</strong> — database and file storage, hosted on AWS infrastructure in the United States. Data is encrypted at rest and in transit.</li>
            <li><strong className="text-white">Resend</strong> — transactional email delivery (download links, brochure delivery).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">5. Data retention</h2>
          <ul className="space-y-2">
            <li><strong className="text-white">Preview photos:</strong> deleted automatically 10 hours after the event.</li>
            <li><strong className="text-white">HD photos:</strong> deleted from our servers after 10 hours. Originals retained by the photographer only.</li>
            <li><strong className="text-white">Order records:</strong> retained for 7 years as required by Australian tax law.</li>
            <li><strong className="text-white">Brochure leads:</strong> retained until you request deletion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">6. Your rights</h2>
          <p>Under the Australian Privacy Act, you have the right to:</p>
          <ul className="space-y-1 mt-2 list-none">
            {[
              'Access the personal information we hold about you',
              'Request correction of inaccurate information',
              'Request deletion of your personal information (subject to legal retention requirements)',
              'Complain about a privacy breach',
            ].map(item => (
              <li key={item} className="flex gap-3">
                <span className="text-accent-light">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a>. We will respond within 30 days.</p>
          <p className="mt-2">If you are not satisfied with our response, you may complain to the <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">Office of the Australian Information Commissioner (OAIC)</a>.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">7. Cookies</h2>
          <p>This website does not use tracking cookies or advertising cookies. Standard browser session data may be stored locally for technical functionality only.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">8. Photography and consent</h2>
          <p>Photos are taken in public or semi-public event spaces. If you appear in a photo published on this platform and wish it removed, contact us at <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a> and we will remove it within 48 hours.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">9. Contact</h2>
          <p>Privacy enquiries: <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a></p>
        </section>

      </div>
    </div>
  )
}
