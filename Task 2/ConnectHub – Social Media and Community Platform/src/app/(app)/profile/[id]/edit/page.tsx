'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadInput from '@/components/image-upload-input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditProfilePageProps {
  params: {
    id: string;
  };
}

export default function EditProfilePage({ params }: EditProfilePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
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

    try {
      // In production, would save to Supabase
      setTimeout(() => {
        setLoading(false);
        router.push(`/profile/${params.id}`);
      }, 500);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center gap-4">
        <Link href={`/profile/${params.id}`}>
          <Button size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="font-display font-bold text-lg">Edit Profile</h2>
      </div>

      {/* Form */}
      <div className="p-6 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-4">Cover Image</label>
            <ImageUploadInput
              bucket="covers"
              currentImage={coverImage || undefined}
              onUpload={setCoverImage}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-4">Avatar</label>
            <ImageUploadInput
              bucket="avatars"
              currentImage={avatar || undefined}
              onUpload={setAvatar}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-secondary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary"
              disabled
            />
            <p className="text-xs text-foreground/60 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
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

          {/* Actions */}
          <div className="border-t border-border pt-6 flex gap-4">
            <Link href={`/profile/${params.id}`} className="flex-1">
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
