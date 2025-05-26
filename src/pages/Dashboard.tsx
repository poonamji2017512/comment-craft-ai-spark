
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalComments: number;
  thisWeek: number;
  mostUsedPlatform: string;
  mostUsedTone: string;
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
    mostUsedTone: 'Friendly'
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

      setStats({
        totalComments: totalComments || 0,
        thisWeek: thisWeekCount || 0,
        mostUsedPlatform,
        mostUsedTone
      });

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Comments generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostUsedPlatform}</div>
            <p className="text-xs text-muted-foreground">Most used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preferred Tone</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostUsedTone}</div>
            <p className="text-xs text-muted-foreground">Most used tone</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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
    </div>
  );
};

export default Dashboard;
