"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginationMetadata } from "./types";

/* ─── useInfiniteList ────────────────────────────────────────
   Generic infinite-scroll hook. Drives a paginated API endpoint,
   appending each page's results onto a single list, exposes a
   `sentinelRef` to attach to a div at the bottom of the rendered
   list — the IntersectionObserver triggers the next page when the
   sentinel enters the viewport.

   Usage:
     const { items, loading, loadingMore, sentinelRef, total, reset } =
       useInfiniteList<MyItem>({
         pageSize: 12,
         fetcher: async ({ page, limit, signal }) => {
           const res = await getThings({ page, limit, category });
           if ('data' in res) return { items: res.data, pagination: res.pagination };
           return { items: res, pagination: null };
         },
         deps: [category],
       });

   `deps` resets the list when they change (e.g. filter changed).
   `reset()` resets the list manually.
   --------------------------------------------------------- */

export type InfiniteFetcherArgs = {
  page: number;
  limit: number;
  signal: AbortSignal;
};

export type InfiniteFetcherResult<T> = {
  items: T[];
  pagination: PaginationMetadata | null;
};

export type UseInfiniteListOptions<T> = {
  pageSize?: number;
  fetcher: (args: InfiniteFetcherArgs) => Promise<InfiniteFetcherResult<T>>;
  deps?: React.DependencyList;
  rootMargin?: string;
};

export type UseInfiniteListReturn<T> = {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  total: number;
  page: number;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  reset: () => void;
};

export function useInfiniteList<T>(
  options: UseInfiniteListOptions<T>
): UseInfiniteListReturn<T> {
  const {
    pageSize = 12,
    fetcher,
    deps = [],
    rootMargin = "0px 0px 320px 0px",
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  /* When deps change, reset list back to page 1. */
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setTotal(0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset();
  }, deps);

  /* Fetch whenever `page` changes (including initial mount + after reset). */
  useEffect(() => {
    const ac = new AbortController();
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    fetcherRef
      .current({ page, limit: pageSize, signal: ac.signal })
      .then((res) => {
        if (ac.signal.aborted) return;
        setItems((prev) => (isFirstPage ? res.items : [...prev, ...res.items]));
        if (res.pagination) {
          setTotal(res.pagination.total);
          setHasMore(page < res.pagination.pages);
        } else {
          /* No pagination metadata = single-shot response. */
          setTotal(res.items.length);
          setHasMore(false);
        }
      })
      .catch((err) => {
        if (ac.signal.aborted) return;
        console.error("[useInfiniteList] fetch failed:", err);
        setHasMore(false);
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
        setLoadingMore(false);
      });

    return () => ac.abort();
  }, [page, pageSize]);

  /* Observe the sentinel and advance the page when it enters the viewport. */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading || loadingMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, loadingMore, rootMargin]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    total,
    page,
    sentinelRef,
    reset,
  };
}
