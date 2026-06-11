'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/mock-data';
import type { Comment } from '@/lib/mock-data';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function CommentSection({
  postId,
  comments,
  onAddComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      onAddComment(commentText);
      setCommentText('');
      setIsLoading(false);
    }, 300);
  };

  const postComments = comments.filter((c) => c.postId === postId);

  return (
    <div className="space-y-4 py-4">
      {/* Comment Input */}
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0" />
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Reply to this post..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="bg-secondary rounded-full"
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!commentText.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 rounded-full px-6"
          >
            Reply
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {postComments.map((comment) => {
          const author = mockUsers.find((u) => u.id === comment.authorId);
          return (
            <div key={comment.id} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
              {author?.avatar && (
                <img
                  src={author.avatar}
                  alt={author.fullName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{author?.fullName}</p>
                <p className="text-sm text-foreground/90">{comment.content}</p>
                <p className="text-xs text-foreground/50 mt-1">
                  {comment.createdAt.toLocaleTimeString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteComment(comment.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
