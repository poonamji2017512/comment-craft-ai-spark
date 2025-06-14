import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Clock, TrendingUp, Users, Target, Zap, Globe, Calendar, Star, Activity, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import HourlyActivityChart from "@/components/HourlyActivityChart";

interface DashboardStats {
  totalComments: number;
  thisWeek: number;
  mostUsedPlatform: string;
  mostUsedTone: string;
  avgResponseTime: number;
  engagementRate: number;
  uniqueComments: number;
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
    uniqueComments: 0,
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

      // Fetch all comments to calculate unique posts
      const { data: allCommentsData } = await supabase
        .from('generated_comments')
        .select('original_post, platform, tone');

      let uniqueComments = 0;
      let mostUsedPlatform = 'Twitter';
      let mostUsedTone = 'Friendly';

      if (allCommentsData && allCommentsData.length > 0) {
        // Calculate unique posts (original_post field)
        const uniquePosts = new Set(allCommentsData.map(comment => comment.original_post));
        uniqueComments = uniquePosts.size;

        // Calculate most used platform and tone
        const platformCounts: Record<string, number> = {};
        const toneCounts: Record<string, number> = {};

        allCommentsData.forEach(comment => {
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

      // Fetch recent activity
      const { data: recentData } = await supabase
        .from('generated_comments')
        .select('platform, tone, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats(prev => ({
        ...prev,
        totalComments: totalComments || 0,
        thisWeek: thisWeekCount || 0,
        uniqueComments,
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
      title: "Unique Comments",
      value: stats.uniqueComments.toLocaleString(),
      description: "Distinct posts commented",
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

  const platformIcons = {
    twitter: '𝕏',
    linkedin: '💼',
    facebook: '📘',
    instagram: '📷',
    reddit: '🔴',
    youtube: '📺',
  };

  const platformColors = {
    twitter: 'bg-blue-500',
    linkedin: 'bg-blue-700',
    facebook: 'bg-blue-600',
    instagram: 'bg-pink-500',
    reddit: 'bg-orange-500',
    youtube: 'bg-red-500',
  };

  const toneColors = {
    friendly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    casual: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    enthusiastic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    thoughtful: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    humorous: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'gen-z': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    thanks: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  };

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

      {/* Recent Activity and Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`${platformColors[activity.platform as keyof typeof platformColors] || 'bg-gray-500'} p-3 rounded-xl shadow-sm`}>
                        <span className="text-white text-sm font-medium">
                          {platformIcons[activity.platform as keyof typeof platformIcons] || '💬'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-medium border-2 px-3 py-1">
                            {activity.platform.charAt(0).toUpperCase() + activity.platform.slice(1)}
                          </Badge>
                        </div>
                        <Badge 
                          className={`text-xs font-medium px-2 py-1 ${toneColors[activity.tone as keyof typeof toneColors] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {activity.tone.charAt(0).toUpperCase() + activity.tone.slice(1)} tone
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">
                    No recent activity
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate your first comment to see activity here!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                    <span className="text-white text-sm font-medium">𝕏</span>
                  </div>
                  <span className="font-medium">Twitter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-20 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 min-w-[3rem] text-right">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-700 p-2 rounded-lg shadow-sm">
                    <span className="text-white text-sm font-medium">💼</span>
                  </div>
                  <span className="font-medium">LinkedIn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-12 h-full bg-gradient-to-r from-blue-700 to-blue-800 rounded-full shadow-sm"></div>
                  </div>
                  <span className="text-sm font-bold text-blue-700 min-w-[3rem] text-right">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                    <span className="text-white text-sm font-medium">📘</span>
                  </div>
                  <span className="font-medium">Facebook</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-8 h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-sm"></div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 min-w-[3rem] text-right">32%</span>
                </div>
              </div>
              <div className="flex items-center justify-between group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 p-2 rounded-lg shadow-sm">
                    <span className="text-white text-sm font-medium">📷</span>
                  </div>
                  <span className="font-medium">Instagram</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-7 h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full shadow-sm"></div>
                  </div>
                  <span className="text-sm font-bold text-pink-500 min-w-[3rem] text-right">28%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 24-Hour Activity Chart */}
      <HourlyActivityChart />
    </div>
  );
};

export default Dashboard;
