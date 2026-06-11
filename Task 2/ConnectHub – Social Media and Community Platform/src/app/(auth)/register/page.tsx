'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Store token and redirect
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
        <h1 className="text-2xl font-display font-bold mb-2">Create Account</h1>
        <p className="text-foreground/60 mb-6">Join ConnectHub and start connecting</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={formData.confirmPassword}
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
            {loading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-foreground/60 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-foreground/40 text-center mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
