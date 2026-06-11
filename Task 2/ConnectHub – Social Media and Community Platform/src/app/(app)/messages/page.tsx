'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Mail, Search } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';

export default function MessagesPage() {
  const recentChats = mockUsers.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Messages</h2>
        <Button size="sm" variant="outline">
          <Mail className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-secondary rounded-full"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {recentChats.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <Mail className="w-16 h-16 text-foreground/20 mb-4" />
            <p className="text-lg font-display font-bold mb-2">No messages yet</p>
            <p className="text-foreground/60">Start a conversation by visiting a profile</p>
          </div>
        ) : (
          recentChats.map((user) => (
            <button
              key={user.id}
              className="w-full p-4 hover:bg-secondary/50 transition-colors text-left flex items-center gap-4 border-0"
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-foreground/60 truncate">
                  Start a conversation...
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
