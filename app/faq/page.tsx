// faqItems 汇总用户在上传、AI 处理、credits 和合规前的关键问题。
const faqItems = [
  {
    question: 'What does Remove Matcha Filter do?',
    answer: 'It reduces greenish, yellowish, or matcha-style color casts from uploaded photos and aims to produce a more balanced, natural-looking result.'
  },
  {
    question: 'Can it restore the exact original photo?',
    answer: 'No. The AI can improve color balance, but it cannot guarantee recreating the untouched source file or pixel-pixel-level reconstruction.'
  },
  {
    question: 'What image formats are supported?',
    answer: 'The MVP upload flow supports JPG, PNG, and WEBP images under the configured size limit.'
  },
  {
    question: 'What happens to uploaded images?',
    answer: 'Uploaded images may be stored temporarily and processed by an AI provider so the service can create previews and downloadable results.'
  },
  {
    question: 'How do credits work?',
    answer: 'There is no subscription and no free generation. Buy credits only when you need them; 1 credit creates 1 matcha filter removal, and credits are valid for 12 months.'
  },
  {
    question: 'What if the result is not good enough?',
    answer: 'Some photos may not improve much because of lighting, compression, or heavy filters. A result that differs from the original is not automatically a failed job.'
  }
];

// FaqPage 解释 AI 恢复能力、上传数据和 credits 预期。
export default function FaqPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-matcha-700">FAQ</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Questions before you upload.</h1>
      <p className="mt-4 leading-7 text-slate-600">
        These answers set the right expectations for matcha filter removal, credits, uploaded images, and natural-looking outputs.
      </p>

      <section className="mt-10 space-y-5">
        {faqItems.map((item) => (
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5" key={item.question}>
            <h2 className="text-xl font-semibold text-slate-950">{item.question}</h2>
            <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
