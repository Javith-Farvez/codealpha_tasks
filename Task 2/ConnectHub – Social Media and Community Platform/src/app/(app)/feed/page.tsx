'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/post-card';
import PostComposer from '@/components/post-composer';
import { mockPosts } from '@/lib/mock-data';

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const handlePost = (content: string, image: string | null) => {
    const newPost = {
      id: `post_${Date.now()}`,
      authorId: 'user_1',
      content,
      image,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.includes(postId)
                ? post.likes - 1
                : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto border-r border-border">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40">
        <h2 className="font-display font-bold text-xl">Home</h2>
      </div>

      {/* Post Composer */}
      <PostComposer onPost={handlePost} />

      {/* Posts Feed */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isLiked={likedPosts.includes(post.id)}
            onLike={() => handleLike(post.id)}
            onDelete={() => handleDelete(post.id)}
          />
        ))}
      </div>
    </div>
  );
}
