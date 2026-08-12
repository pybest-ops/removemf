// refundSections 描述 credits 模式下的退款边界。
const refundSections = [
  {
    title: '1. Paid credit packs',
    body: 'Remove Matcha Filter sells prepaid credit packs through PayPal Checkout. There is no subscription and no free image generation in the production payment flow.'
  },
  {
    title: '2. Unused credits',
    body: 'A paid credit pack may be eligible for review within 7 days of purchase only when none of the credits from that pack have been used.'
  },
  {
    title: '3. Used credits',
    body: 'Once a credit has been used to create an AI processing job, it is non-refundable because model and infrastructure costs can be incurred immediately.'
  },
  {
    title: '4. Failed jobs',
    body: 'If a restoration job fails due to a service error and produces no result, the used credit is returned automatically. This credit return is the default remedy for failed processing.'
  },
  {
    title: '5. Output expectations',
    body: 'A result that looks different from the exact original is not automatically a failed job. The service aims for a more balanced, natural-looking image and does not guarantee recreating the untouched source file.'
  },
  {
    title: '6. Contact and review',
    body: 'Refund requests require the PayPal order information and the Google email used for purchase. A production support email should be configured before public launch.'
  }
];

// RefundPage 展示 credits 模式下的退款政策草案。
export default function RefundPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Legal draft</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Refund Policy</h1>
      <p className="mt-4 leading-7 text-slate-600">
        This Refund Policy covers prepaid credits for matcha filter removal and should be reviewed before public launch.
      </p>

      <div className="mt-10 space-y-5">
        {refundSections.map((section) => (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5" key={section.title}>
            <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
