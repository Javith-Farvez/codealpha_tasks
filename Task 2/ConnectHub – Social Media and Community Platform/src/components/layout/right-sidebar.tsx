'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data';

export default function RightSidebar() {
  const suggestedUsers = mockUsers.slice(1, 4);

  return (
    <aside className="w-80 border-l border-border px-6 py-8 sticky top-0 h-screen overflow-y-auto hidden xl:block bg-background/50 backdrop-blur-sm">
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users, posts..."
          className="pl-10 bg-secondary rounded-full border-border"
        />
      </div>

      {/* Trending Section */}
      <div className="bg-secondary rounded-2xl p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-4">What's happening!</h3>
        <div className="space-y-4">
          {[
            { category: 'Technology', trend: '#ReactJS', posts: '125K' },
            { category: 'Design', trend: '#WebDesign', posts: '89K' },
            { category: 'Community', trend: '#ConnectHub', posts: '456K' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="hover:bg-primary/5 rounded-lg p-3 cursor-pointer transition"
            >
              <p className="text-xs text-foreground/60">{item.category} Trending</p>
              <p className="font-display font-bold">{item.trend}</p>
              <p className="text-xs text-foreground/60">{item.posts} posts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-secondary rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg mb-4">Suggested for you</h3>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user.fullName}</p>
                  <p className="text-xs text-foreground/60">@{user.email.split('@')[0]}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Follow
              </Button>
            </div>
          ))}
        </div>
        <Link href="/search">
          <Button variant="ghost" className="w-full mt-4 text-primary">
            Show more
          </Button>
        </Link>
      </div>
    </aside>
  );
}
