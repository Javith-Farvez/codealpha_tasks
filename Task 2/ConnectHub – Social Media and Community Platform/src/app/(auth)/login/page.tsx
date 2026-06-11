'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/feed');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg font-display">C</span>
        </div>
        <span className="font-display font-bold text-lg">ConnectHub</span>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-display font-bold mb-2">Welcome Back</h1>
        <p className="text-foreground/60 mb-6">Sign in to your ConnectHub account</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 h-11"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-foreground/60 text-center">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary/90 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-foreground/40 text-center mt-6">
        Demo credentials: test@example.com / password123
      </p>
    </div>
  );
}
