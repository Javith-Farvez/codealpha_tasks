import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in production this would be Supabase
const users: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create mock user
    const userId = Math.random().toString(36).substr(2, 9);
    const user = {
      id: userId,
      fullName,
      email,
      password, // In production: hash with bcrypt
      createdAt: new Date(),
      avatar: null,
      coverImage: null,
      bio: '',
      followers: 0,
      following: 0,
    };

    users.push(user);

    // Mock JWT token
    const token = Buffer.from(JSON.stringify({ userId, email })).toString('base64');

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
