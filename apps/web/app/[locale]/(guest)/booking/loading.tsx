export default function BookingLoading() {
  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper skeleton */}
        <div className="mx-auto mb-12 flex max-w-2xl items-center justify-between" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="size-10 animate-pulse rounded-full bg-bb-cream-border" />
              <div className="h-3 w-16 animate-pulse rounded bg-bb-cream-border" />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6" aria-hidden>
            <div className="h-10 w-72 animate-pulse rounded-xl bg-bb-cream-border" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-bb-cream-border" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-bb-cream-border" />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-6 rounded-2xl border border-bb-cream-border bg-white p-6"
              >
                <div className="size-16 animate-pulse rounded-xl bg-bb-cream-border" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-bb-cream-border" />
                  <div className="h-3 w-full max-w-sm animate-pulse rounded bg-bb-cream-border" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded bg-bb-cream-border" />
              </div>
            ))}
          </div>
          <div className="w-full lg:w-[400px]" aria-hidden>
            <div className="h-96 animate-pulse rounded-[1.75rem] border border-bb-cream-border bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
