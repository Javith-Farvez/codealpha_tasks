'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import RightSidebar from '@/components/layout/right-sidebar';
import MobileNav from '@/components/layout/mobile-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  if (!mounted || !isAuthed) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background pb-16 lg:pb-0">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 border-r border-border overflow-y-auto">
        {children}
      </main>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
