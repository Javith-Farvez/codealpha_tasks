import { NextRequest, NextResponse } from 'next/server';

// Mock comments store
let comments: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postComments = comments.filter((c) => c.postId === id);
  return NextResponse.json(postComments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content, authorId } = await request.json();

  if (!content || !authorId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const comment = {
    id: `comment_${Date.now()}`,
    postId: id,
    authorId,
    content,
    createdAt: new Date(),
  };

  comments.push(comment);
  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { commentId } = await request.json();

  comments = comments.filter((c) => c.id !== commentId);
  return NextResponse.json({ success: true });
}
