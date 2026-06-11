'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Test User',
    email: 'test@example.com',
    bio: 'Welcome to ConnectHub!',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      router.push('/profile/user_1');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center gap-4">
        <Link href="/profile/user_1">
          <Button size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="font-display font-bold text-lg">Edit Profile</h2>
      </div>

      {/* Cover Image Editor */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20 group cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all rounded-none">
          <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-8 space-y-8">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-4">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button size="sm" variant="outline" className="text-destructive">
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="bg-secondary resize-none"
              rows={4}
            />
            <p className="text-xs text-foreground/60 mt-2">
              {formData.bio.length}/160 characters
            </p>
          </div>

          <div className="border-t border-border pt-6 flex gap-4">
            <Link href="/profile/user_1" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
