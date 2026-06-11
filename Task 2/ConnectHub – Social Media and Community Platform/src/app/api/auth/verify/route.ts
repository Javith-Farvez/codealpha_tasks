import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token (in production, verify JWT signature)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

      if (!decoded.userId || !decoded.email) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          valid: true,
          user: {
            id: decoded.userId,
            email: decoded.email,
          },
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}
