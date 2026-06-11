'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  Settings,
  LogOut,
  Video,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const links = [
    { href: '/feed', icon: Home, label: 'Home' },
    { href: '/reels', icon: Video, label: 'Reels' },
    { href: '/search', icon: Search, label: 'Explore' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/messages', icon: Mail, label: 'Messages' },
    { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { href: '/communities', icon: Users, label: 'Communities' },
  ];

  return (
    <aside className="w-64 border-r border-border flex flex-col px-6 py-8 sticky top-0 h-screen bg-background/50 backdrop-blur-sm hidden lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg font-display">C</span>
        </div>
        <span className="font-display font-bold text-lg">ConnectHub</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4 flex-1">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/70 hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="space-y-4 border-t border-border pt-4">
        <Link href="/settings">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-foreground/70 hover:bg-secondary transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 py-3 text-foreground/70 hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">{isLoading ? 'Logging out...' : 'Logout'}</span>
        </Button>
      </div>
    </aside>
  );
}
