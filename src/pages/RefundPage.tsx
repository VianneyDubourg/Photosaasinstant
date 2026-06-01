export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-white/40 text-sm mb-2">Legal</p>
      <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: 1 June 2026</p>

      <div className="space-y-8 text-white/70 leading-relaxed text-sm">

        <section className="bg-night-800 border border-accent/20 rounded-xl p-5">
          <p className="text-white font-medium">Under the <strong>Australian Consumer Law</strong>, you are always entitled to a remedy if a product is faulty, not as described, or does not work as advertised. Nothing in this policy limits those rights.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">1. Digital products</h2>
          <p>PhotoInstant sells digital photographs as instant downloads. Because these are digital goods that are delivered immediately upon payment, we do not offer change-of-mind refunds once a download has been accessed.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">2. When you are entitled to a refund</h2>
          <ul className="space-y-3">
            {[
              ['The photo is not the one you purchased', 'Wrong photo delivered — full refund immediately.'],
              ['The file is corrupted or unusable', 'Download link broken or file fails to open — full refund or re-delivery.'],
              ['The photo is significantly different from the preview', 'e.g. different person, different event — full refund immediately.'],
              ['Technical failure on our side', 'Payment taken but download link not received within 1 hour — full refund or re-delivery.'],
            ].map(([title, desc]) => (
              <li key={title as string} className="flex gap-3 list-none">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                <span><strong className="text-white">{title as string}:</strong> {desc as string}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">3. Non-refundable situations</h2>
          <ul className="space-y-2">
            {[
              'You changed your mind after downloading the photo',
              'You purchased the wrong photo by mistake (contact us first — we will try to help)',
              'The photo has expired from the platform (photos are available for 10 hours — this is clearly stated before purchase)',
            ].map(item => (
              <li key={item} className="flex gap-3 list-none">
                <span className="text-white/30 mt-0.5 flex-shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">4. How to request a refund</h2>
          <p>Email us at <a href="mailto:contact@vlogo.fr" className="text-accent-light hover:underline">contact@vlogo.fr</a> with:</p>
          <ul className="mt-2 space-y-1">
            <li className="flex gap-3 list-none"><span className="text-accent-light">→</span> Your email address used at checkout</li>
            <li className="flex gap-3 list-none"><span className="text-accent-light">→</span> The date and event</li>
            <li className="flex gap-3 list-none"><span className="text-accent-light">→</span> A brief description of the issue</li>
          </ul>
          <p className="mt-3">We aim to respond within <strong className="text-white">24 hours</strong> and process valid refunds within <strong className="text-white">5 business days</strong> via the original payment method.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">5. Australian Consumer Law</h2>
          <p>Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.</p>
          <p className="mt-2">For more information visit the <a href="https://www.accc.gov.au" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">Australian Competition and Consumer Commission (ACCC)</a>.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">6. Contact</h2>
          <p>Refund requests and questions: <a href="mailto:contact@vlogo.fr" className="text-accent-light hover:underline">contact@vlogo.fr</a></p>
        </section>

      </div>
    </div>
  )
}
