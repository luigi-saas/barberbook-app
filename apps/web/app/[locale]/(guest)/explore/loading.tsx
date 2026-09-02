export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-bb-cream">
      <section className="bg-bb-espresso px-6 py-16" aria-hidden>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-3 h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="mb-8 h-12 w-80 max-w-full animate-pulse rounded-xl bg-white/10" />
          <div className="h-14 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
        </div>
      </section>

      <section className="px-6 py-12" aria-hidden>
        <div className="mx-auto max-w-[1280px] flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="h-96 animate-pulse rounded-2xl bg-bb-cream-border" />
          </div>
          <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-bb-cream-border bg-white">
                <div className="h-48 animate-pulse bg-bb-cream-border" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-36 animate-pulse rounded bg-bb-cream-border" />
                  <div className="h-4 w-24 animate-pulse rounded bg-bb-cream-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
