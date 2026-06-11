import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom in pixels (default 200px)
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function useInfiniteScroll({
  threshold = 200,
  onLoadMore,
  isLoading = false,
  hasMore = true,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!observerTarget.current) return;
    if (isLoading || !hasMore) return;

    const rect = observerTarget.current.getBoundingClientRect();
    const isNearBottom = rect.bottom <= window.innerHeight + threshold;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, hasMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return observerTarget;
}
