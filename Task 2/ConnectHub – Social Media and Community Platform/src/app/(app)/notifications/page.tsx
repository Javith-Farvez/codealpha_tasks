'use client';

import { Button } from '@/components/ui/button';
import { Bell, Heart, UserPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment';
  user: typeof mockUsers[0];
  message: string;
  timestamp: Date;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: mockUsers[1],
    message: 'liked your post',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'follow',
    user: mockUsers[2],
    message: 'started following you',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'comment',
    user: mockUsers[3],
    message: 'replied to your post',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-primary" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
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
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Notifications</h2>
        <Button size="sm" variant="outline">
          Mark all as read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {mockNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-lg font-display font-bold mb-2">No notifications</p>
            <p className="text-foreground/60">You're all caught up!</p>
          </div>
        ) : (
          mockNotifications.map((notif) => (
            <div
              key={notif.id}
              className="p-6 hover:bg-secondary/30 transition-colors flex gap-4 cursor-pointer"
            >
              {notif.user.avatar && (
                <img
                  src={notif.user.avatar}
                  alt={notif.user.fullName}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(notif.type)}
                  <p className="font-semibold">
                    <Link
                      href={`/profile/${notif.user.id}`}
                      className="hover:underline"
                    >
                      {notif.user.fullName}
                    </Link>
                  </p>
                  <p className="text-foreground/60">{notif.message}</p>
                </div>
                <p className="text-sm text-foreground/60">{timeAgo(notif.timestamp)} ago</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
