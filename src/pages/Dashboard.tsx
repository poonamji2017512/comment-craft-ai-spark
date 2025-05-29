
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Clock, TrendingUp, Users, Target, Zap, Globe, Calendar, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalComments: number;
  thisWeek: number;
  mostUsedPlatform: string;
  mostUsedTone: string;
  avgResponseTime: number;
  engagementRate: number;
  activeUsers: number;
  successRate: number;
}

interface RecentActivity {
  platform: string;
  tone: string;
  time: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalComments: 0,
    thisWeek: 0,
    mostUsedPlatform: 'Twitter',
    mostUsedTone: 'Friendly',
    avgResponseTime: 2.3,
    engagementRate: 87.5,
    activeUsers: 1247,
    successRate: 95.2
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total comments
      const { count: totalComments } = await supabase
        .from('generated_comments')
        .select('*', { count: 'exact', head: true });

      // Fetch comments from this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: thisWeekCount } = await supabase
        .from('generated_comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Fetch recent activity
      const { data: recentData } = await supabase
        .from('generated_comments')
        .select('platform, tone, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate most used platform and tone
      const { data: allComments } = await supabase
        .from('generated_comments')
        .select('platform, tone');

      let mostUsedPlatform = 'Twitter';
      let mostUsedTone = 'Friendly';

      if (allComments && allComments.length > 0) {
        const platformCounts: Record<string, number> = {};
        const toneCounts: Record<string, number> = {};

        allComments.forEach(comment => {
          platformCounts[comment.platform] = (platformCounts[comment.platform] || 0) + 1;
          toneCounts[comment.tone] = (toneCounts[comment.tone] || 0) + 1;
        });

        mostUsedPlatform = Object.keys(platformCounts).reduce((a, b) => 
          platformCounts[a] > platformCounts[b] ? a : b
        );
        
        mostUsedTone = Object.keys(toneCounts).reduce((a, b) => 
          toneCounts[a] > toneCounts[b] ? a : b
        );
      }

      setStats(prev => ({
        ...prev,
        totalComments: totalComments || 0,
        thisWeek: thisWeekCount || 0,
        mostUsedPlatform,
        mostUsedTone
      }));

      if (recentData) {
        const activities = recentData.map(item => ({
          platform: item.platform,
          tone: item.tone,
          time: getRelativeTime(item.created_at)
        }));
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const statCards = [
    {
      title: "Total Comments",
      value: stats.totalComments.toLocaleString(),
      description: "All time",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      title: "This Week",
      value: stats.thisWeek.toLocaleString(),
      description: "Comments generated",
      icon: Clock,
      color: "text-green-500"
    },
    {
      title: "Top Platform",
      value: stats.mostUsedPlatform,
      description: "Most used",
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      title: "Preferred Tone",
      value: stats.mostUsedTone,
      description: "Most used tone",
      icon: MessageSquare,
      color: "text-orange-500"
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}s`,
      description: "AI generation speed",
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      description: "Comment success rate",
      icon: Target,
      color: "text-red-500"
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      description: "This month",
      icon: Users,
      color: "text-indigo-500"
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      description: "Quality score",
      icon: Star,
      color: "text-pink-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{activity.platform}</Badge>
                          <Badge variant="outline">{activity.tone}</Badge>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity. Generate your first comment to see activity here!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Twitter</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">LinkedIn</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-10 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Facebook</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">32%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Instagram</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-6 h-2 bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
