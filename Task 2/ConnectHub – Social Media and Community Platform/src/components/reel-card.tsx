'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Play, UserPlus, UserCheck } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import type { Reel } from '@/lib/mock-data';

interface ReelCardProps {
  reel: Reel;
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  showInteractions?: boolean;
}

export default function ReelCard({
  reel,
  isLiked,
  onLike,
  onDelete,
  isFollowing = false,
  onFollowChange,
  showInteractions = false,
}: ReelCardProps) {
  const author = mockUsers.find((u) => u.id === reel.authorId);
  const [showMenu, setShowMenu] = useState(false);
  const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const handleFollowClick = async () => {
    setIsFollowLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newFollowState = !isFollowingLocal;
      setIsFollowingLocal(newFollowState);
      onFollowChange?.(newFollowState);
      setIsFollowLoading(false);
    }, 300);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    return Math.floor(seconds) + 's';
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 flex-1">
          {author?.avatar && (
            <img
              src={author.avatar}
              alt={author.fullName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <Link href={`/profile/${author?.id}`}>
              <p className="font-semibold text-sm hover:underline">
                {author?.fullName}
              </p>
            </Link>
            <p className="text-xs text-foreground/60">
              @{author?.email.split('@')[0]} • {timeAgo(reel.createdAt)}
            </p>
          </div>
        </div>

        {/* Follow Button + Menu */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isFollowingLocal ? "outline" : "default"}
            onClick={handleFollowClick}
            disabled={isFollowLoading}
            className={`gap-1 transition-all ${
              isFollowingLocal
                ? 'text-foreground border-border'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {isFollowingLocal ? (
              <>
                <UserCheck className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </Button>

          {/* Menu */}
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-50">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 rounded-none"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail - Mobile Only */}
      {!showInteractions && (
        <div className="relative aspect-[9/16] bg-black overflow-hidden mb-4">
          <img
            src={reel.thumbnail}
            alt="Reel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs text-white font-semibold">
              {reel.duration}s
            </span>
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm text-foreground line-clamp-2">{reel.caption}</p>
      </div>

      {/* Interactions */}
      {showInteractions && (
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="flex gap-6 text-sm text-foreground/60 border-b border-border pb-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {reel.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {reel.comments}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-4 h-4" /> {reel.shares}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`flex-1 gap-2 ${
                isLiked
                  ? 'text-red-500 bg-red-500/10'
                  : 'text-foreground/70 hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={isLiked ? 'currentColor' : 'none'}
              />
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions - Mobile */}
      {!showInteractions && (
        <div className="p-4 flex gap-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex-1 gap-2 ${
              isLiked
                ? 'text-red-500 bg-red-500/10'
                : 'text-foreground/70 hover:text-red-500 hover:bg-red-500/10'
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className="text-xs">{reel.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{reel.comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">{reel.shares}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
