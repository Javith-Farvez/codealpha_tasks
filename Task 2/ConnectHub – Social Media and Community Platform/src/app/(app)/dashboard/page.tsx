'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Eye,
} from 'lucide-react';
import { mockUsers, mockPosts } from '@/lib/mock-data';

const engagementData = [
  { day: 'Mon', likes: 120, comments: 80, shares: 40 },
  { day: 'Tue', likes: 150, comments: 90, shares: 60 },
  { day: 'Wed', likes: 200, comments: 110, shares: 75 },
  { day: 'Thu', likes: 180, comments: 100, shares: 65 },
  { day: 'Fri', likes: 250, comments: 140, shares: 90 },
  { day: 'Sat', likes: 280, comments: 160, shares: 110 },
  { day: 'Sun', likes: 300, comments: 180, shares: 130 },
];

const growthData = [
  { week: 'Week 1', followers: 1000 },
  { week: 'Week 2', followers: 1250 },
  { week: 'Week 3', followers: 1450 },
  { week: 'Week 4', followers: 1800 },
];

export default function DashboardPage() {
  const currentUser = mockUsers[0];
  const userPosts = mockPosts.filter((p) => p.authorId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments, 0);

  const stats = [
    {
      icon: BarChart,
      label: 'Total Posts',
      value: userPosts.length,
      change: '+12%',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'Followers',
      value: currentUser.followers.toLocaleString(),
      change: '+8%',
      color: 'text-green-500',
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: totalLikes.toLocaleString(),
      change: '+24%',
      color: 'text-red-500',
    },
    {
      icon: MessageSquare,
      label: 'Total Comments',
      value: totalComments.toLocaleString(),
      change: '+15%',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto border-r border-border min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Dashboard</h1>
        <p className="text-foreground/60">
          Track your ConnectHub activity and growth
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="bg-card border border-border p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-xs font-semibold text-green-500">
                  {stat.change}
                </span>
              </div>
              <p className="text-foreground/60 text-sm mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement Chart */}
        <Card className="bg-card border border-border p-6">
          <h3 className="font-display font-bold text-lg mb-4">
            Weekly Engagement
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--foreground-foreground)" />
              <YAxis stroke="var(--foreground-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="likes" fill="var(--primary)" />
              <Bar dataKey="comments" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth Chart */}
        <Card className="bg-card border border-border p-6">
          <h3 className="font-display font-bold text-lg mb-4">
            Follower Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--foreground-foreground)" />
              <YAxis stroke="var(--foreground-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Posts */}
      <Card className="bg-card border border-border p-6">
        <h3 className="font-display font-bold text-lg mb-4">Top Posts</h3>
        <div className="space-y-4">
          {userPosts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/50 transition"
            >
              <div className="flex-1">
                <p className="font-medium truncate line-clamp-2">
                  {post.content}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 1,245
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
