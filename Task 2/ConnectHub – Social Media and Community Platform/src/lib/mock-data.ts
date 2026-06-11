// Mock data for ConnectHub

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string;
  followers: number;
  following: number;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export const mockUsers: User[] = [
  {
    id: 'user_1',
    fullName: 'Test User',
    email: 'test@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    coverImage: null,
    bio: 'Welcome to ConnectHub! 🌟',
    followers: 1250,
    following: 342,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'user_2',
    fullName: 'Sarah Anderson',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    coverImage: null,
    bio: 'Designer & Creator | Always exploring new ideas ✨',
    followers: 3200,
    following: 1100,
    createdAt: new Date('2024-08-20'),
  },
  {
    id: 'user_3',
    fullName: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    coverImage: null,
    bio: 'Tech enthusiast | Building cool stuff 🚀',
    followers: 5420,
    following: 892,
    createdAt: new Date('2024-05-10'),
  },
  {
    id: 'user_4',
    fullName: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    coverImage: null,
    bio: 'Content creator | Photography lover 📸',
    followers: 8900,
    following: 234,
    createdAt: new Date('2024-03-05'),
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_2',
    content: 'Just launched my new design portfolio! Check it out and let me know what you think 🎨',
    image: null,
    likes: 342,
    comments: 28,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'post_2',
    authorId: 'user_3',
    content: 'Building a new web platform with React. The performance improvements are amazing! 🔥',
    image: null,
    likes: 589,
    comments: 45,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'post_3',
    authorId: 'user_4',
    content: 'Golden hour photography is the best. Nature is incredible 🌅',
    image: null,
    likes: 1203,
    comments: 89,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'post_4',
    authorId: 'user_1',
    content: 'ConnectHub is amazing! Love connecting with people who share my interests 💙',
    image: null,
    likes: 156,
    comments: 12,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

export const mockComments: Comment[] = [
  {
    id: 'comment_1',
    postId: 'post_1',
    authorId: 'user_1',
    content: 'This looks absolutely stunning! Great work! 👏',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'comment_2',
    postId: 'post_2',
    authorId: 'user_4',
    content: 'Would love to know more about the performance optimizations!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export interface Reel {
  id: string;
  authorId: string;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  duration: number; // in seconds
  createdAt: Date;
}

export const mockReels: Reel[] = [
  {
    id: 'reel_1',
    authorId: 'user_3',
    videoUrl: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=300&h=500&fit=crop',
    caption: 'Building amazing things with React! 🚀 #WebDevelopment #React #Code',
    likes: 2450,
    comments: 145,
    shares: 320,
    duration: 15,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'reel_2',
    authorId: 'user_2',
    videoUrl: 'https://media.giphy.com/media/l0HlCY9x8FZo0XO1i/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=500&fit=crop',
    caption: 'Design process for our new app 🎨✨ #UX #Design #Creative',
    likes: 3820,
    comments: 267,
    shares: 580,
    duration: 20,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'reel_3',
    authorId: 'user_4',
    videoUrl: 'https://media.giphy.com/media/3o7TKU8RhemSMoJLAI/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1617638925702-92991154eeb2?w=300&h=500&fit=crop',
    caption: 'Golden hour magic captured on film 📸✨ #Photography #Nature #Sunset',
    likes: 5670,
    comments: 412,
    shares: 890,
    duration: 18,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'reel_4',
    authorId: 'user_1',
    videoUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=500&fit=crop',
    caption: 'ConnectHub launch day! Excited to share this with everyone 💙 #StartUp #Tech',
    likes: 1890,
    comments: 156,
    shares: 234,
    duration: 25,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'reel_5',
    authorId: 'user_2',
    videoUrl: 'https://media.giphy.com/media/l0HlDtKPoYJhBb7KM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-ef46a146b47d?w=300&h=500&fit=crop',
    caption: 'Quick tips for better composition 🎬 #FilmTips #VideoEducation #Creator',
    likes: 4120,
    comments: 298,
    shares: 612,
    duration: 22,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'reel_6',
    authorId: 'user_3',
    videoUrl: 'https://media.giphy.com/media/3o7TKU8RhemSMoJLAI/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=500&fit=crop',
    caption: 'New coding challenge completed! Who wants to try? 💻 #WebDev #Challenge',
    likes: 3340,
    comments: 201,
    shares: 445,
    duration: 16,
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
  },
  {
    id: 'reel_7',
    authorId: 'user_4',
    videoUrl: 'https://media.giphy.com/media/l0HlQY9x8FZo0XO1i/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=500&fit=crop',
    caption: 'Summer vibes and creative energy 🌞✨ #Creative #Summer #Inspiration',
    likes: 6240,
    comments: 523,
    shares: 1023,
    duration: 19,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 'reel_8',
    authorId: 'user_2',
    videoUrl: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&h=500&fit=crop',
    caption: 'Behind the scenes of my design workflow 🎨 #BTS #Design #Process',
    likes: 2890,
    comments: 167,
    shares: 389,
    duration: 21,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'reel_9',
    authorId: 'user_1',
    videoUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=300&h=500&fit=crop',
    caption: 'Learning web development has never been easier! 🚀 #Learning #WebDev',
    likes: 1570,
    comments: 89,
    shares: 156,
    duration: 17,
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
  },
  {
    id: 'reel_10',
    authorId: 'user_3',
    videoUrl: 'https://media.giphy.com/media/l0HlDtKPoYJhBb7KM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=500&fit=crop',
    caption: 'Tech talks and innovation 🔬 #Tech #Innovation #Future',
    likes: 4560,
    comments: 345,
    shares: 678,
    duration: 23,
    createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
  },
  {
    id: 'reel_11',
    authorId: 'user_4',
    videoUrl: 'https://media.giphy.com/media/3o7TKU8RhemSMoJLAI/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1609042231775-a4cd9f2dadf0?w=300&h=500&fit=crop',
    caption: 'Nature photography tips and tricks 📷 #Photography #Tips #Nature',
    likes: 7120,
    comments: 612,
    shares: 1245,
    duration: 20,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: 'reel_12',
    authorId: 'user_2',
    videoUrl: 'https://media.giphy.com/media/l0HlCY9x8FZo0XO1i/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=500&fit=crop',
    caption: 'UI/UX design trends for 2026 🎨 #Design #Trends #UI',
    likes: 5340,
    comments: 423,
    shares: 834,
    duration: 18,
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000),
  },
  {
    id: 'reel_13',
    authorId: 'user_3',
    videoUrl: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f0?w=300&h=500&fit=crop',
    caption: 'Full stack development tutorial 🔧 #FullStack #Tutorial #Coding',
    likes: 3780,
    comments: 267,
    shares: 512,
    duration: 24,
    createdAt: new Date(Date.now() - 44 * 60 * 60 * 1000),
  },
  {
    id: 'reel_14',
    authorId: 'user_4',
    videoUrl: 'https://media.giphy.com/media/l0HlQY9x8FZo0XO1i/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1606933248051-5ce98adc8e66?w=300&h=500&fit=crop',
    caption: 'Adventure awaits! Exploring new places 🌍 #Travel #Adventure #Explorer',
    likes: 6890,
    comments: 534,
    shares: 987,
    duration: 22,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'reel_15',
    authorId: 'user_1',
    videoUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=500&fit=crop',
    caption: 'Community building on ConnectHub! 💙 #Community #Social #Connected',
    likes: 2340,
    comments: 178,
    shares: 289,
    duration: 19,
    createdAt: new Date(Date.now() - 52 * 60 * 60 * 1000),
  },
  {
    id: 'reel_16',
    authorId: 'user_2',
    videoUrl: 'https://media.giphy.com/media/l0HlDtKPoYJhBb7KM/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=500&fit=crop',
    caption: 'Design inspiration from everyday life 🎨 #Inspiration #Design #Daily',
    likes: 4670,
    comments: 356,
    shares: 723,
    duration: 17,
    createdAt: new Date(Date.now() - 56 * 60 * 60 * 1000),
  },
  {
    id: 'reel_17',
    authorId: 'user_3',
    videoUrl: 'https://media.giphy.com/media/3o7TKU8RhemSMoJLAI/giphy.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f0?w=300&h=500&fit=crop',
    caption: 'JavaScript performance optimization tips 🚀 #JavaScript #Performance #Dev',
    likes: 3450,
    comments: 234,
    shares: 456,
    duration: 21,
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
  },
];
