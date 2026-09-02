export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-bb-cream" aria-hidden>
      {/* Hero skeleton */}
      <div className="relative h-[480px] w-full bg-bb-espresso">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-bb-espresso via-bb-espresso/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:px-12">
          <div className="mx-auto max-w-[1280px] space-y-4">
            <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-12 w-72 max-w-full animate-pulse rounded-xl bg-white/10" />
            <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex gap-1 rounded-2xl bg-bb-cream p-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-11 flex-1 animate-pulse rounded-xl bg-bb-cream-border" />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="size-10 animate-pulse rounded-full bg-bb-cream-border" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-bb-cream-border" />
                    <div className="h-3 w-24 animate-pulse rounded bg-bb-cream-border" />
                  </div>
                </div>
                <div className="h-9 w-24 animate-pulse rounded-full bg-bb-cream-border" />
              </div>
            ))}
          </div>
          <aside className="w-full lg:w-[360px] shrink-0">
            <div className="h-[420px] animate-pulse rounded-[1.75rem] border border-bb-cream-border bg-white" />
          </aside>
        </div>
      </div>
    </main>
  );
}
