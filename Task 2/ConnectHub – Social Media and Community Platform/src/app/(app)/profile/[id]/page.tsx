'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, MapPin } from 'lucide-react';
import { mockUsers, mockPosts } from '@/lib/mock-data';
import PostCard from '@/components/post-card';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = mockUsers.find((u) => u.id === params.id);
  const userPosts = mockPosts.filter((p) => p.authorId === params.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Link href="/feed">
            <Button>Back to Feed</Button>
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center gap-4">
        <Link href="/feed">
          <Button size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="font-display font-bold text-lg">{user.fullName}</h2>
          <p className="text-xs text-foreground/60">{userPosts.length} posts</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20" />

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar and Follow Button */}
        <div className="flex justify-between items-start -mt-16 mb-6">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={user.fullName}
            className="w-32 h-32 rounded-full border-4 border-background"
          />
          <Button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`mt-4 ${
              isFollowing
                ? 'bg-secondary text-foreground'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>

        {/* Bio Section */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl mb-1">{user.fullName}</h1>
          <p className="text-foreground/60 mb-4">@{user.email.split('@')[0]}</p>
          <p className="text-foreground mb-4">{user.bio}</p>

          {/* Stats */}
          <div className="flex gap-8 mb-6">
            <div>
              <p className="font-bold text-lg">{userPosts.length}</p>
              <p className="text-sm text-foreground/60">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{user.followers}</p>
              <p className="text-sm text-foreground/60">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{user.following}</p>
              <p className="text-sm text-foreground/60">Following</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {user.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-0">
          <div className="flex gap-8">
            <button className="py-4 font-display font-bold border-b-2 border-primary">
              Posts
            </button>
            <button className="py-4 text-foreground/60 hover:text-foreground transition">
              Media
            </button>
            <button className="py-4 text-foreground/60 hover:text-foreground transition">
              Likes
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {userPosts.length === 0 ? (
          <div className="p-12 text-center text-foreground/60">
            <p>No posts yet</p>
          </div>
        ) : (
          userPosts.map((post) => (
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
