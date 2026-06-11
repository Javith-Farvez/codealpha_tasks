'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';

interface ReelInteractionsProps {
  reelId: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
}

export default function ReelInteractions({
  reelId,
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  onShare,
}: ReelInteractionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const getInitialComments = () => {
    const now = new Date().getTime();
    return [
      {
        id: 'comment_1',
        authorId: 'user_1',
        content: 'Amazing content! 🔥',
        createdAt: new Date(now - 10 * 60 * 1000),
      },
      {
        id: 'comment_2',
        authorId: 'user_2',
        content: 'Love this! Following for more',
        createdAt: new Date(now - 5 * 60 * 1000),
      },
    ];
  };
  const [reelComments, setReelComments] = useState(getInitialComments());

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      authorId: 'user_1',
      content: commentText,
      createdAt: new Date(),
    };

    setReelComments([newComment, ...reelComments]);
    setCommentText('');
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + 'm';
    return 'now';
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`flex-1 gap-2 ${
            isLiked
              ? 'text-red-500 bg-red-500/10'
              : 'text-foreground/70 hover:text-red-500 hover:bg-red-500/10'
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={isLiked ? 'currentColor' : 'none'}
          />
          <span className="text-xs font-semibold">{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">{comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="flex-1 gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs font-semibold">{shares}</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="font-semibold text-sm">Comments</h3>

          {/* Comment Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
              className="bg-secondary text-sm"
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="max-h-48 overflow-y-auto space-y-3">
            {reelComments.map((comment) => {
              const author = mockUsers.find((u) => u.id === comment.authorId);
              return (
                <div key={comment.id} className="flex gap-2">
                  {author?.avatar && (
                    <img
                      src={author.avatar}
                      alt={author.fullName}
                      className="w-7 h-7 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 bg-secondary/50 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold">
                        {author?.fullName}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs text-foreground/90">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
