'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ReelPlayer from '@/components/reel-player';
import ReelCard from '@/components/reel-card';
import { mockReels } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks';

interface PaginatedReels {
  reels: typeof mockReels;
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export default function ReelsPage() {
  const [displayedReels, setDisplayedReels] = useState<typeof mockReels>([]);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [likedReels, setLikedReels] = useState<string[]>([]);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const REELS_PER_PAGE = 5;

  // Initial load - fetch first batch of reels
  useEffect(() => {
    loadReels(0, true);
    setIsInitialLoad(false);
  }, []);

  const loadReels = async (currentOffset: number, isInitial = false) => {
    if (isLoading && !isInitial) return;
    
    setIsLoading(true);
    try {
      // Simulate API call - in real app, fetch from /api/reels
      await new Promise(resolve => setTimeout(resolve, 500));

      const newReels = mockReels.slice(
        currentOffset,
        currentOffset + REELS_PER_PAGE
      );

      if (isInitial) {
        setDisplayedReels(newReels);
        if (newReels.length > 0) {
          setSelectedReelId(newReels[0].id);
        }
      } else {
        setDisplayedReels(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(r => r.id));
          const filtered = newReels.filter(r => !existingIds.has(r.id));
          return [...prev, ...filtered];
        });
      }

      const nextOffset = currentOffset + REELS_PER_PAGE;
      setOffset(nextOffset);
      setHasMore(nextOffset < mockReels.length);
    } catch (error) {
      console.error('Failed to load reels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadReels(offset);
    }
  }, [isLoading, hasMore, offset]);

  // Use infinite scroll hook
  const observerTarget = useInfiniteScroll({
    threshold: 300,
    onLoadMore: handleLoadMore,
    isLoading,
    hasMore,
  });

  const selectedReel = displayedReels.find((r) => r.id === selectedReelId) || displayedReels[0];

  const handleLike = (reelId: string) => {
    setLikedReels((prev) =>
      prev.includes(reelId)
        ? prev.filter((id) => id !== reelId)
        : [...prev, reelId]
    );
    setDisplayedReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              likes: likedReels.includes(reelId)
                ? reel.likes - 1
                : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const handleDelete = (reelId: string) => {
    setDisplayedReels((prev) => prev.filter((reel) => reel.id !== reelId));
    if (selectedReelId === reelId) {
      const remaining = displayedReels.filter(r => r.id !== reelId);
      setSelectedReelId(remaining[0]?.id || null);
    }
  };

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setFollowingUsers((prev) => {
      const updated = new Set(prev);
      if (isFollowing) {
        updated.add(userId);
      } else {
        updated.delete(userId);
      }
      return Array.from(updated);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Reels</h2>
        <Link href="/reels/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Reel
          </Button>
        </Link>
      </div>

      {/* Reels Feed - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Main Reel Player - Desktop Only */}
        <div className="hidden lg:block lg:col-span-2">
          {selectedReel && (
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl overflow-hidden h-[600px]">
                <ReelPlayer
                  videoUrl={selectedReel.videoUrl}
                  caption={selectedReel.caption}
                  autoPlay={true}
                />
              </div>
              {selectedReel && (
                <ReelCard
                  reel={selectedReel}
                  isLiked={likedReels.includes(selectedReel.id)}
                  onLike={() => handleLike(selectedReel.id)}
                  onDelete={() => handleDelete(selectedReel.id)}
                  isFollowing={followingUsers.includes(selectedReel.authorId)}
                  onFollowChange={(isFollowing) =>
                    handleFollowChange(selectedReel.authorId, isFollowing)
                  }
                  showInteractions={true}
                />
              )}
            </div>
          )}
        </div>

        {/* Reels List - Infinite Scroll Container */}
        <div className="space-y-4 lg:col-span-1 lg:max-h-screen lg:overflow-y-auto">
          {displayedReels.map((reel) => {
            const isSelected = selectedReelId === reel.id;
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedReelId(reel.id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary scale-105'
                    : 'ring-1 ring-border hover:ring-primary/50'
                }`}
              >
                {/* Mobile - Full Reel Card */}
                <div className="lg:hidden">
                  <ReelCard
                    reel={reel}
                    isLiked={likedReels.includes(reel.id)}
                    onLike={() => handleLike(reel.id)}
                    onDelete={() => handleDelete(reel.id)}
                    isFollowing={followingUsers.includes(reel.authorId)}
                    onFollowChange={(isFollowing) =>
                      handleFollowChange(reel.authorId, isFollowing)
                    }
                    showInteractions={true}
                  />
                </div>

                {/* Desktop - Thumbnail */}
                <div className="hidden lg:block relative h-32">
                  <img
                    src={reel.thumbnail}
                    alt="Reel thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="text-white text-xs font-semibold">
                      {reel.duration}s
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 ring-2 ring-primary" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* Infinite Scroll Observer Target */}
          {hasMore && (
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              <span className="text-xs text-foreground/50">Loading more...</span>
            </div>
          )}

          {/* No More Reels Message */}
          {!hasMore && displayedReels.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-foreground/60">No more reels to load</p>
            </div>
          )}

          {/* Empty State */}
          {displayedReels.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-display font-bold mb-4">No reels yet</p>
              <Link href="/reels/create">
                <Button className="bg-primary hover:bg-primary/90">
                  Create Your First Reel
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
