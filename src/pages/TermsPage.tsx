import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-white/40 text-sm mb-2">Legal</p>
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: 1 June 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">1. About PhotoInstant</h2>
          <p>PhotoInstant is operated by Vianney Dubourg (ABN: <strong className="text-white">[YOUR ABN]</strong>), trading as PhotoInstant, based in Australia. Website: <a href="https://vlogo.fr" className="text-accent-light hover:underline">vlogo.fr</a>. Contact: <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a>.</p>
          <p>By accessing or purchasing from this website, you agree to these Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">2. The Service</h2>
          <p>PhotoInstant provides a platform where event attendees can browse, preview and purchase digital HD photographs taken at live events. Photos are available for download for a limited period (typically 10 hours) following the event.</p>
          <p>Purchased photos are delivered as digital downloads. No physical product is shipped.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">3. Purchases and Payments</h2>
          <p>All prices are listed in Australian Dollars (AUD) and include GST where applicable. Payments are processed securely by Stripe. PhotoInstant does not store your payment card details.</p>
          <p>A purchase grants you a personal, non-exclusive, non-transferable licence to download and use the purchased photo for personal use only.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">4. Download Links</h2>
          <p>After successful payment, you will receive a secure download link. This link is valid for 10 hours from the time of purchase, in line with our photo availability window. It is your responsibility to download your photo within this period. If you experience a technical issue, contact us at <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a> or via Instagram.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">5. Photo Availability</h2>
          <p>Preview photos are available on the platform for approximately 10 hours following an event, after which they are automatically removed from our servers. The original files are retained by the photographer. If you cannot locate your photo, contact us via Instagram or email with a description of yourself and the event.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">6. Refunds and Consumer Rights</h2>
          <p>Under the Australian Consumer Law, you are entitled to a refund if the product is faulty, not as described, or fails to do what it was supposed to do. Please see our <Link to="/refund" className="text-accent-light hover:underline">Refund Policy</Link> for full details.</p>
          <p>Because our photos are digital downloads, we do not offer change-of-mind refunds once a download has been accessed. If you have not yet downloaded your photo and wish to cancel, contact us within 1 hour of purchase.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">7. Intellectual Property</h2>
          <p>All photographs remain the intellectual property of Vianney Dubourg. Purchasing a photo grants you a personal licence for non-commercial use (sharing on social media, printing for personal use). You may not sell, sublicense, or use the photos for commercial purposes without written permission.</p>
          <p>Photos may carry a small copyright notice. Removing, cropping or obscuring this notice is not permitted.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">8. Photography Consent</h2>
          <p>By attending an event where PhotoInstant is operating, attendees acknowledge that professional photography is taking place at that event. Photos are only published to our platform in low-resolution watermarked form. If you appear in a photo and wish it to be removed, contact us and we will remove it within 48 hours.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">9. Privacy</h2>
          <p>We collect minimal personal data. See our <Link to="/privacy" className="text-accent-light hover:underline">Privacy Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">10. Limitation of Liability</h2>
          <p>To the extent permitted by Australian law, PhotoInstant's liability is limited to the amount paid for the relevant purchase. We are not liable for indirect or consequential damages. Nothing in these terms excludes rights you have under the Australian Consumer Law that cannot be excluded.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">11. Governing Law</h2>
          <p>These terms are governed by the laws of the State of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">12. Contact</h2>
          <p>Questions about these terms: <a href="mailto:hello@vlogo.fr" className="text-accent-light hover:underline">hello@vlogo.fr</a></p>
        </section>

      </div>
    </div>
  )
}
