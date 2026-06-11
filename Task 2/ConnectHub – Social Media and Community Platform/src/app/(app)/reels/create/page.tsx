'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadInput from '@/components/image-upload-input';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';

export default function CreateReelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    caption: '',
    music: '',
    visibility: 'public' as 'public' | 'private' | 'friends',
  });

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video file
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Video must be under 100MB');
      return;
    }

    setVideoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!videoFile) {
      alert('Please select a video');
      setLoading(false);
      return;
    }

    if (!formData.caption.trim()) {
      alert('Please add a caption');
      setLoading(false);
      return;
    }

    try {
      // Simulate upload
      setTimeout(() => {
        setLoading(false);
        router.push('/reels');
      }, 1000);
    } catch (error) {
      setLoading(false);
      alert('Failed to create reel');
    }
  };

  return (
    <div className="max-w-3xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center gap-4">
        <Link href="/reels">
          <Button size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="font-display font-bold text-lg">Create Reel</h2>
      </div>

      {/* Form */}
      <div className="p-6 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-4">Video</label>
            {videoPreview ? (
              <div className="relative rounded-lg overflow-hidden bg-black/20 aspect-video mb-4">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                <Upload className="w-8 h-8 mx-auto mb-3 text-foreground/40" />
                <p className="font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-foreground/60">
                  MP4, WebM or MOV (max 100MB)
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption</label>
            <Textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Share what's in your reel... #Hashtags @Mentions"
              className="bg-secondary resize-none"
              rows={4}
            />
            <p className="text-xs text-foreground/60 mt-2">
              {formData.caption.length}/150 characters
            </p>
          </div>

          {/* Music (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Music (Optional)</label>
            <input
              type="text"
              name="music"
              value={formData.music}
              onChange={(e) => setFormData({ ...formData, music: e.target.value })}
              placeholder="Search for music or add a link..."
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none transition"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none transition"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private - Only you</option>
            </select>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-6 flex gap-4">
            <Link href="/reels" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !videoFile}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Publishing...' : 'Publish Reel'}
            </Button>
          </div>
        </form>

        {/* Tips */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-2">Tips for Great Reels</h3>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>✓ Keep videos between 15-60 seconds</li>
            <li>✓ Use trending audio and hashtags</li>
            <li>✓ Start with a hook to grab attention</li>
            <li>✓ Ensure good lighting and clear audio</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
