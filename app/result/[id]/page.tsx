export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Result</h1>
      <p className="mt-2 text-slate-600">Job ID: {params.id}</p>
    </main>
  );
}
