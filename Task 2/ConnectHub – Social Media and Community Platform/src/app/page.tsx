'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, MessageSquare, Heart, Share2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">C</span>
              </div>
              <span className="font-display font-bold text-xl">ConnectHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition">Features</a>
              <a href="#community" className="text-sm text-foreground/70 hover:text-foreground transition">Community</a>
              <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Animated gradient background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to the future of social</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Connect, Share,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inspire
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Experience the next generation of social networking. A platform designed for authentic connections, 
            meaningful conversations, and genuine inspiration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg h-12">
                Start Connecting
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-lg h-12">
                Already a member?
              </Button>
            </Link>
          </div>

          {/* Hero image placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-12 backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-secondary rounded-lg h-32 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-4">
            Why Choose ConnectHub?
          </h2>
          <p className="text-center text-foreground/70 mb-16 max-w-2xl mx-auto">
            Experience a social platform built for the modern user
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Real Connections',
                description: 'Connect with people who share your interests and values'
              },
              {
                icon: MessageSquare,
                title: 'Meaningful Conversations',
                description: 'Engage in thoughtful discussions and share your thoughts'
              },
              {
                icon: Heart,
                title: 'Authentic Interactions',
                description: 'Express yourself genuinely without limits or judgment'
              },
              {
                icon: Share2,
                title: 'Easy Sharing',
                description: 'Share photos, thoughts, and moments with your community'
              },
              {
                icon: Sparkles,
                title: 'Premium Experience',
                description: 'Enjoy a clean, ad-free interface with smooth animations'
              },
              {
                icon: Users,
                title: 'Discovery',
                description: 'Find and follow users with similar interests'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl border border-primary/20 p-12 text-center backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-foreground/70 mb-8">
            Join thousands of users already connecting on ConnectHub
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Create Your Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-display">C</span>
              </div>
              <span className="font-display font-bold">ConnectHub</span>
            </div>
            <p className="text-sm text-foreground/60">A modern social platform for genuine connections</p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">About</a></li>
              <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>&copy; 2026 ConnectHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
