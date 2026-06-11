import { NextRequest, NextResponse } from 'next/server';

// Mock follows store
let follows: any[] = [];

export async function POST(request: NextRequest) {
  const { userId, targetUserId, action } = await request.json();

  if (!userId || !targetUserId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if (action === 'follow') {
    const exists = follows.find(
      (f) => f.userId === userId && f.targetUserId === targetUserId
    );
    if (!exists) {
      follows.push({ userId, targetUserId, createdAt: new Date() });
    }
  } else if (action === 'unfollow') {
    follows = follows.filter(
      (f) => !(f.userId === userId && f.targetUserId === targetUserId)
    );
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const type = request.nextUrl.searchParams.get('type'); // 'followers' or 'following'

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId' },
      { status: 400 }
    );
  }

  let result = [];
  if (type === 'followers') {
    result = follows
      .filter((f) => f.targetUserId === userId)
      .map((f) => f.userId);
  } else if (type === 'following') {
    result = follows
      .filter((f) => f.userId === userId)
      .map((f) => f.targetUserId);
  }

  return NextResponse.json({ count: result.length, users: result });
}
