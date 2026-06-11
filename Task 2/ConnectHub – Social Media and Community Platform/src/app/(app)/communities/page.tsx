'use client';

import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

const communities = [
  {
    id: 1,
    name: 'Tech Enthusiasts',
    description: 'Discuss the latest in technology and innovation',
    members: 12450,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Design Lovers',
    description: 'Share your creative designs and get feedback',
    members: 8930,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Photographers',
    description: 'Showcase your photography and learn from others',
    members: 15670,
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=400&fit=crop',
  },
];

export default function CommunitiesPage() {
  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40 flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Communities</h2>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Communities List */}
      <div className="divide-y divide-border">
        {communities.map((community) => (
          <div key={community.id} className="p-6 hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className="flex gap-4">
              <img
                src={community.image}
                alt={community.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg">{community.name}</h3>
                <p className="text-sm text-foreground/60 mb-2">{community.description}</p>
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Users className="w-3 h-3" />
                  <span>{community.members.toLocaleString()} members</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Join
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-6 text-center border-t border-border">
        <Button variant="ghost" className="text-primary">
          Show more communities
        </Button>
      </div>
    </div>
  );
}
