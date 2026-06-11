import { NextRequest, NextResponse } from 'next/server';

// Mock reels store
let reels: any[] = [];

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const type = request.nextUrl.searchParams.get('type'); // 'feed', 'user', 'trending'
  const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5');

  try {
    let filtered = reels.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (type === 'user' && userId) {
      filtered = filtered.filter((r) => r.authorId === userId);
    } else if (type === 'trending') {
      filtered = filtered.sort((a, b) => b.likes - a.likes).slice(0, 10);
    }

    // Pagination
    const paginated = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < filtered.length;

    return NextResponse.json({
      reels: paginated,
      offset,
      limit,
      total: filtered.length,
      hasMore,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorId, videoUrl, caption, duration, thumbnail } = await request.json();

    if (!authorId || !videoUrl || !caption) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newReel = {
      id: `reel_${Date.now()}`,
      authorId,
      videoUrl,
      thumbnail: thumbnail || videoUrl,
      caption,
      duration: duration || 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    };

    reels.push(newReel);
    return NextResponse.json(newReel, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create reel' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { reelId } = await request.json();

    if (!reelId) {
      return NextResponse.json(
        { error: 'Missing reelId' },
        { status: 400 }
      );
    }

    reels = reels.filter((r) => r.id !== reelId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete reel' },
      { status: 500 }
    );
  }
}
