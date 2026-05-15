"use client";

import type { RefObject } from "react";

/* Visual end-of-list / loading-more sentinel.
   Attach the `sentinelRef` from useInfiniteList. Renders one of:
     · "Loading more…" with spinner when actively fetching
     · "Scroll for more" when more pages are available
     · "End of list" when everything has been loaded */
export function InfiniteScrollSentinel({
  shown,
  total,
  loading,
  hasMore,
  sentinelRef,
  unit,
}: {
  shown: number;
  total: number;
  loading: boolean;
  hasMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  unit: string;
}) {
  if (shown === 0 && !loading) return null;
  return (
    <div
      ref={sentinelRef}
      className="mt-12 md:mt-14 flex flex-col items-center justify-center gap-4 py-6"
    >
      {hasMore ? (
        <div className="flex items-center gap-3 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
              Loading more…
            </>
          ) : (
            <>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Scroll for more
            </>
          )}
          {total > 0 && (
            <span className="text-stone-400 normal-case tracking-normal">
              · {shown} / {total} {unit}
            </span>
          )}
        </div>
      ) : (
        <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
          End of list ·{" "}
          <span className="font-funnel text-[14px] text-stone-900 normal-case tracking-tight">
            {shown}
          </span>{" "}
          {unit} shown
        </p>
      )}
    </div>
  );
}
