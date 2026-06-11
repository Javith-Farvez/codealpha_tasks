'use client';

import { useEffect, useState } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-secondary to-background">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
