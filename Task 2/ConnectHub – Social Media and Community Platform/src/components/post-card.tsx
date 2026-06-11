'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import type { Post } from '@/lib/mock-data';

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
}

export default function PostCard({
  post,
  isLiked,
  onLike,
  onDelete,
}: PostCardProps) {
  const author = mockUsers.find((u) => u.id === post.authorId);
  const [showMenu, setShowMenu] = useState(false);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'd';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    return Math.floor(seconds) + 's';
  };

  return (
    <div className="border-b border-border p-6 hover:bg-secondary/30 transition-colors cursor-pointer group">
      <div className="flex gap-4">
        {/* Avatar */}
        {author?.avatar && (
          <img
            src={author.avatar}
            alt={author.fullName}
            className="w-12 h-12 rounded-full"
          />
        )}

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${author?.id}`}>
                <p className="font-display font-bold hover:underline">
                  {author?.fullName}
                </p>
              </Link>
              <p className="text-foreground/60 text-sm">
                @{author?.email.split('@')[0]}
              </p>
              <p className="text-foreground/60 text-sm">·</p>
              <p className="text-foreground/60 text-sm">{timeAgo(post.createdAt)}</p>
            </div>

            {/* Menu */}
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-50">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <p className="text-foreground mb-4">{post.content}</p>

          {/* Post Image */}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="rounded-2xl mb-4 w-full max-h-96 object-cover"
            />
          )}

          {/* Stats */}
          <div className="flex gap-6 mb-4 text-sm text-foreground/60 border-b border-border pb-4">
            <span>{post.comments} comments</span>
            <span>{post.likes} likes</span>
          </div>

          {/* Actions */}
          <div className="flex justify-around text-foreground/60">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 justify-center gap-2 hover:text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">Reply</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLike}
              className={`flex-1 justify-center gap-2 transition ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-xs">{post.likes}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 justify-center gap-2 hover:text-primary hover:bg-primary/10"
            >
              <Share className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
