// privacySections 描述 MVP 阶段隐私政策需要覆盖的数据处理主题。
const privacySections = [
  {
    title: '1. What this policy covers',
    body: 'Remove Matcha Filter is a matcha filter removal tool. This draft Privacy Policy explains how the MVP handles uploaded images, job metadata, paid credits, PayPal checkout records, Google login data, and service operations. It is provided for transparency and is not legal advice.'
  },
  {
    title: '2. Information we process',
    body: 'We process images you upload, technical metadata about the restoration job, basic device or request information, Google account profile data used for login, and credit/order metadata. PayPal handles payment details rather than storing card or PayPal account credentials on this site.'
  },
  {
    title: '3. How uploaded images are used',
    body: 'Uploaded images are used to create a color correction job, send the image to an AI provider when configured, show a before / after preview, and make the result available for download. The service aims to produce a more natural result and does not promise recreating the untouched source file.'
  },
  {
    title: '4. Third-party processing',
    body: 'The MVP may use Replicate or another AI provider for image processing, Cloudflare infrastructure for hosting and API routes, and R2-compatible storage for uploaded or generated image files. These services may process data only as needed to provide the restoration flow.'
  },
  {
    title: '5. Retention',
    body: 'Uploaded images, generated results, and job records should be retained only for a limited period needed to provide previews, downloads, troubleshooting, abuse prevention, and cost review. The exact production retention window is still pending confirmation before launch.'
  },
  {
    title: '6. Your choices',
    body: 'Do not upload images you do not have the right to process. Do not upload sensitive, illegal, or private images if you do not want them processed by AI infrastructure. For deletion or privacy requests, contact details must be finalized before production launch.'
  }
];

// PrivacyPage 展示 MVP 隐私政策草案正文。
export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">Legal draft</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Privacy Policy</h1>
      <p className="mt-4 leading-7 text-slate-600">
        This MVP draft describes the data handling expected for Remove Matcha Filter. Final production wording should be reviewed before launch.
      </p>

      <div className="mt-10 space-y-5">
        {privacySections.map((section) => (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5" key={section.title}>
            <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
