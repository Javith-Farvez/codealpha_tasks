'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';
import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'posts' | 'reels'>('users');

  // Import mockReels from mock-data
  const mockReels = []; // Will be populated with reels in search

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();

    if (searchType === 'users') {
      return mockUsers.filter(
        (u) =>
          u.fullName.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          u.bio.toLowerCase().includes(lower)
      );
    }

    if (searchType === 'reels') {
      return mockReels.filter(
        (r) =>
          r.caption.toLowerCase().includes(lower)
      );
    }

    return [];
  }, [query, searchType]);

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40">
        <h2 className="font-display font-bold text-xl mb-4">Explore</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-secondary rounded-full text-base"
            autoFocus
          />
        </div>
      </div>

      {/* Search Type Tabs */}
      {query && (
        <div className="border-b border-border flex gap-8 px-6">
          <button
            onClick={() => setSearchType('users')}
            className={`py-4 font-display font-semibold transition ${
              searchType === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSearchType('posts')}
            className={`py-4 font-display font-semibold transition ${
              searchType === 'posts'
                ? 'border-b-2 border-primary text-primary'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setSearchType('reels')}
            className={`py-4 font-display font-semibold transition ${
              searchType === 'reels'
                ? 'border-b-2 border-primary text-primary'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            Reels
          </button>
        </div>
      )}

      {/* Results */}
      <div className="divide-y divide-border">
        {!query ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-lg font-display font-bold mb-2">Discover People</p>
            <p className="text-foreground/60">Start searching to find users and posts</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground/60">No results found for "{query}"</p>
          </div>
        ) : (
          results.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <div className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-14 h-14 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-display font-bold">{user.fullName}</p>
                    <p className="text-sm text-foreground/60">@{user.email.split('@')[0]}</p>
                    <p className="text-sm text-foreground/70 mt-1">{user.bio}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
