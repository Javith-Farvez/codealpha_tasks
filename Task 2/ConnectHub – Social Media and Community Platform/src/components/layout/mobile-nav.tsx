'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Home,
  Search,
  Bell,
  Mail,
  Users,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react';

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/feed', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Explore' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/messages', icon: Mail, label: 'Messages' },
    { href: '/communities', icon: Users, label: 'Communities' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-50 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 max-w-full overflow-x-auto">
          {links.slice(0, 4).map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 w-12 h-full transition-all ${
                  isActive ? 'text-primary' : 'text-foreground/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-center justify-center gap-1 w-12 h-full text-foreground/60 hover:text-foreground transition-all"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="text-xs font-medium hidden sm:inline">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm">
          <div className="absolute bottom-16 left-0 right-0 bg-card border-t border-border p-4 space-y-2 max-h-96 overflow-y-auto">
            <Link href="/settings">
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground/70 hover:text-foreground">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
