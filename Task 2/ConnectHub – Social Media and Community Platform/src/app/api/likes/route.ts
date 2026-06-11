import { NextRequest, NextResponse } from 'next/server';

// Mock likes store
let likes: any[] = [];

export async function POST(request: NextRequest) {
  const { userId, postId, action } = await request.json();

  if (!userId || !postId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if (action === 'like') {
    const exists = likes.find((l) => l.userId === userId && l.postId === postId);
    if (!exists) {
      likes.push({ userId, postId, createdAt: new Date() });
    }
  } else if (action === 'unlike') {
    likes = likes.filter((l) => !(l.userId === userId && l.postId === postId));
  }

  const count = likes.filter((l) => l.postId === postId).length;
  return NextResponse.json({ success: true, count });
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId');
  const userId = request.nextUrl.searchParams.get('userId');

  if (!postId) {
    return NextResponse.json(
      { error: 'Missing postId' },
      { status: 400 }
    );
  }

  const postLikes = likes.filter((l) => l.postId === postId);
  const isLikedByUser = userId
    ? postLikes.some((l) => l.userId === userId)
    : false;

  return NextResponse.json({
    count: postLikes.length,
    isLiked: isLikedByUser,
  });
}
