'use client';

import { useState } from 'react';
import ReelCard from '@/components/reel-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import type { Reel } from '@/lib/mock-data';

interface UserReelsSectionProps {
  userId: string;
  reels: Reel[];
  onLike?: (reelId: string) => void;
  onDelete?: (reelId: string) => void;
}

export default function UserReelsSection({
  userId,
  reels,
  onLike,
  onDelete,
}: UserReelsSectionProps) {
  const [likedReels, setLikedReels] = useState<string[]>([]);

  const handleLike = (reelId: string) => {
    setLikedReels((prev) =>
      prev.includes(reelId)
        ? prev.filter((id) => id !== reelId)
        : [...prev, reelId]
    );
    onLike?.(reelId);
  };

  const handleDelete = (reelId: string) => {
    onDelete?.(reelId);
  };

  if (reels.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
        <p className="text-lg font-display font-bold mb-2">No reels yet</p>
        <p className="text-foreground/60 mb-4">
          {userId === 'user_1'
            ? 'Create your first reel to get started'
            : 'This user hasnt created any reels yet'}
        </p>
        {userId === 'user_1' && (
          <Link href="/reels/create">
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Create Reel
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4">Reels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <div key={reel.id} className="relative">
            <ReelCard
              reel={reel}
              isLiked={likedReels.includes(reel.id)}
              onLike={() => handleLike(reel.id)}
              onDelete={() => handleDelete(reel.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
