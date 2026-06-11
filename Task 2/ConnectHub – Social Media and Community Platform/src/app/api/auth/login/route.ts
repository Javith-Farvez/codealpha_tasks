import { NextRequest, NextResponse } from 'next/server';

// Mock database
const mockUsers = [
  {
    id: 'user_1',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    avatar: null,
    coverImage: null,
    bio: 'Welcome to ConnectHub!',
    followers: 0,
    following: 0,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Mock JWT token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64');

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
