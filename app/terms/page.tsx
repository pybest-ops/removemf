// termsSections 描述用户协议草案的核心服务规则。
const termsSections = [
  {
    title: '1. Service overview',
    body: 'Remove Matcha Filter provides an AI-assisted workflow for reducing greenish, yellowish, or matcha-style color casts in uploaded photos. The service is designed to create a more balanced image, not to recreate the exact original file.'
  },
  {
    title: '2. User responsibilities',
    body: 'You are responsible for the images you upload and must have the rights and permissions needed to process them. Do not upload illegal content, content that violates another person\'s privacy, or content you are not allowed to modify.'
  },
  {
    title: '3. AI output limits',
    body: 'AI results can vary based on the input image, lighting, compression, and color cast. We do not guarantee pixel-level reconstruction, recreating the untouched source file, or suitability for professional editing, legal, identity, medical, or archival use.'
  },
  {
    title: '4. Credits and paid use',
    body: 'The service sells prepaid credit packs through PayPal Checkout. There is no subscription. Browser cleanup preview is free, and 1 credit creates 1 AI Restore matcha filter removal. Purchased credits are valid for 12 months from purchase.'
  },
  {
    title: '5. Storage and downloads',
    body: 'Uploaded images and generated results may be stored temporarily so the service can process jobs, show previews, and provide downloads. Result availability can be limited by storage, provider availability, or operational issues.'
  },
  {
    title: '6. Prohibited use',
    body: 'You may not use the service to process illegal content, infringe intellectual property rights, harass others, bypass platform rules, misrepresent AI-generated results, or overload the service infrastructure.'
  },
  {
    title: '7. Changes and availability',
    body: 'The service may change during MVP development. Features, models, credits, pricing, storage periods, and availability may be updated as the product moves toward production.'
  }
];

// TermsPage 展示 MVP 服务条款草案正文。
export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Legal draft</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Terms of Service</h1>
      <p className="mt-4 leading-7 text-slate-600">
        These Terms are an MVP draft for the Remove Matcha Filter service and should be reviewed before public launch.
      </p>

      <div className="mt-10 space-y-5">
        {termsSections.map((section) => (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5" key={section.title}>
            <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
