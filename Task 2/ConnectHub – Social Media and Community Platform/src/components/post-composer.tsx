'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, Heart, Smile } from 'lucide-react';

interface PostComposerProps {
  onPost: (content: string, image: string | null) => void;
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    // Simulate post creation
    setTimeout(() => {
      onPost(content, null);
      setContent('');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="border-b border-border p-6 hover:bg-secondary/30 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0" />

        {/* Input Area */}
        <div className="flex-1">
          <Textarea
            placeholder="What's happening!?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-lg border-0 resize-none focus:outline-none focus-visible:ring-0 p-0 mb-4 bg-transparent"
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-primary">
                <Image className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary">
                <Smile className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handlePost}
              disabled={!content.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 rounded-full px-6"
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
