'use client';

import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import PostCard from '@/components/post-card';
import { mockPosts } from '@/lib/mock-data';
import { useState } from 'react';

export default function BookmarksPage() {
  const [bookmarkedPosts] = useState(mockPosts.slice(0, 2));
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const handleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40">
        <h2 className="font-display font-bold text-xl">Bookmarks</h2>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {bookmarkedPosts.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-lg font-display font-bold mb-2">No bookmarks yet</p>
            <p className="text-foreground/60">Save posts to read them later</p>
          </div>
        ) : (
          bookmarkedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={likedPosts.includes(post.id)}
              onLike={() => handleLike(post.id)}
              onDelete={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}
