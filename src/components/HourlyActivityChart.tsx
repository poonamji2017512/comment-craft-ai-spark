
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Clock, TrendingUp, Activity, Eye, EyeOff, ChevronDown, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface HourlyData {
  hour: string;
  displayHour: string;
  Twitter: number;
  LinkedIn: number;
  Facebook: number;
  Instagram: number;
  Reddit: number;
  YouTube: number;
  total: number;
}

interface PlatformVisibility {
  [key: string]: boolean;
}

interface DashboardStats {
  uniqueComments: number;
  totalComments: number;
  peakHour: string;
}

const HourlyActivityChart = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    uniqueComments: 0,
    totalComments: 0,
    peakHour: ''
  });
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [platformVisibility, setPlatformVisibility] = useState<PlatformVisibility>({
    Twitter: true,
    LinkedIn: true,
    Facebook: true,
    Instagram: true,
    Reddit: true,
    YouTube: true,
  });

  useEffect(() => {
    fetchHourlyData();
  }, []);

  const fetchHourlyData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No user session found');
        setIsLoading(false);
        return;
      }

      // Get comments from the last 24 hours for the current user
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: commentsData } = await supabase
        .from('generated_comments')
        .select('created_at, platform, original_post')
        .eq('user_id', session.user.id)
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Initialize data for all 24 hours
      const hourlyActivity: { [key: string]: HourlyData } = {};
      
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ':00';
        const displayHour = i === 0 ? '12 AM' : 
                           i < 12 ? `${i} AM` : 
                           i === 12 ? '12 PM' : 
                           `${i - 12} PM`;
        
        hourlyActivity[hour] = {
          hour,
          displayHour,
          Twitter: 0,
          LinkedIn: 0,
          Facebook: 0,
          Instagram: 0,
          Reddit: 0,
          YouTube: 0,
          total: 0
        };
      }

      let totalCount = 0;
      let maxHourActivity = 0;
      let busyHour = '';
      
      // Calculate unique comments (distinct original posts)
      const uniquePosts = new Set();

      // Process the data
      if (commentsData) {
        commentsData.forEach(comment => {
          const commentDate = new Date(comment.created_at);
          const hour = commentDate.getHours().toString().padStart(2, '0') + ':00';
          
          // Track unique posts
          uniquePosts.add(comment.original_post);
          
          if (hourlyActivity[hour]) {
            // Map platform names to match our data structure
            let platformKey = comment.platform;
            if (platformKey === 'twitter') platformKey = 'Twitter';
            else if (platformKey === 'linkedin') platformKey = 'LinkedIn';
            else if (platformKey === 'facebook') platformKey = 'Facebook';
            else if (platformKey === 'instagram') platformKey = 'Instagram';
            else if (platformKey === 'reddit') platformKey = 'Reddit';
            else if (platformKey === 'youtube') platformKey = 'YouTube';
            
            if (platformKey in hourlyActivity[hour]) {
              (hourlyActivity[hour] as any)[platformKey]++;
              hourlyActivity[hour].total++;
              totalCount++;
              
              // Track peak hour
              if (hourlyActivity[hour].total > maxHourActivity) {
                maxHourActivity = hourlyActivity[hour].total;
                busyHour = hourlyActivity[hour].displayHour;
              }
            }
          }
        });
      }

      // Convert to array and sort by hour
      const sortedData = Object.values(hourlyActivity).sort((a, b) => {
        const hourA = parseInt(a.hour.split(':')[0]);
        const hourB = parseInt(b.hour.split(':')[0]);
        return hourA - hourB;
      });

      setHourlyData(sortedData);
      setStats({
        uniqueComments: uniquePosts.size,
        totalComments: totalCount,
        peakHour: busyHour || 'N/A'
      });
    } catch (error) {
      console.error('Error fetching hourly data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const platformColors = {
    Twitter: '#1DA1F2',
    LinkedIn: '#0077B5',
    Facebook: '#1877F2',
    Instagram: '#E4405F',
    Reddit: '#FF4500',
    YouTube: '#FF0000'
  };

  const platformIcons = {
    Twitter: '𝕏',
    LinkedIn: '💼',
    Facebook: '📘',
    Instagram: '📷',
    Reddit: '🔴',
    YouTube: '📺'
  };

  const togglePlatformVisibility = (platform: string) => {
    setPlatformVisibility(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const toggleAllPlatforms = (show: boolean) => {
    const newVisibility: PlatformVisibility = {};
    Object.keys(platformColors).forEach(platform => {
      newVisibility[platform] = show;
    });
    setPlatformVisibility(newVisibility);
  };

  const visiblePlatforms = Object.entries(platformVisibility)
    .filter(([_, visible]) => visible)
    .map(([platform, _]) => platform);

  const getVisiblePlatformsCount = () => {
    return Object.values(platformVisibility).filter(Boolean).length;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalValue = payload.reduce((sum: number, entry: any) => 
        platformVisibility[entry.dataKey] ? sum + entry.value : sum, 0
      );
      
      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{`Time: ${label}`}</p>
          <p className="text-sm text-muted-foreground mb-2">{`Total: ${totalValue} comments`}</p>
          {payload
            .filter((entry: any) => platformVisibility[entry.dataKey] && entry.value > 0)
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span>{platformIcons[entry.dataKey as keyof typeof platformIcons]}</span>
                <span style={{ color: entry.color }}>
                  {`${entry.dataKey}: ${entry.value}`}
                </span>
              </div>
            ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">24-Hour Activity Timeline</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <Activity className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{stats.totalComments}</div>
            <div className="text-sm text-muted-foreground">Total Comments (24h)</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary flex items-center gap-1">
              <Users className="w-5 h-5" />
              {stats.uniqueComments}
            </div>
            <div className="text-sm text-muted-foreground">Unique Comments</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{stats.peakHour}</div>
            <div className="text-sm text-muted-foreground">Peak Activity Hour</div>
          </div>
        </div>

        {/* Platform Controls */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-foreground">Platform Visibility</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleAllPlatforms(true)}
                className="h-8 px-2 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleAllPlatforms(false)}
                className="h-8 px-2 text-xs"
              >
                <EyeOff className="w-3 h-3 mr-1" />
                None
              </Button>
            </div>
          </div>

          {/* Platform Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between bg-background border-border"
              >
                <span className="flex items-center gap-2">
                  {Object.entries(platformVisibility)
                    .filter(([_, visible]) => visible)
                    .slice(0, 3)
                    .map(([platform, _]) => (
                      <span key={platform} className="flex items-center gap-1">
                        {platformIcons[platform as keyof typeof platformIcons]}
                        <span className="text-xs">{platform}</span>
                      </span>
                    ))}
                  {getVisiblePlatformsCount() > 3 && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                      +{getVisiblePlatformsCount() - 3} more
                    </Badge>
                  )}
                  {getVisiblePlatformsCount() === 0 && (
                    <span className="text-muted-foreground">No platforms selected</span>
                  )}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background border-border">
              <DropdownMenuLabel>Select Platforms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(platformColors).map(([platform, color]) => {
                const totalComments = hourlyData.reduce((sum, hour) => sum + (hour as any)[platform], 0);
                return (
                  <DropdownMenuCheckboxItem
                    key={platform}
                    checked={platformVisibility[platform]}
                    onCheckedChange={() => togglePlatformVisibility(platform)}
                    className="flex items-center gap-2"
                  >
                    <span style={{ color }}>{platformIcons[platform as keyof typeof platformIcons]}</span>
                    <span className="flex-1">{platform}</span>
                    <Badge variant="outline" className="text-xs">
                      {totalComments}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAllPlatforms(true)}
                    className="h-6 px-2 text-xs flex-1"
                  >
                    Show All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAllPlatforms(false)}
                    className="h-6 px-2 text-xs flex-1"
                  >
                    Hide All
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={hourlyData}>
                <defs>
                  {visiblePlatforms.map(platform => (
                    <linearGradient key={platform} id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={platformColors[platform as keyof typeof platformColors]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={platformColors[platform as keyof typeof platformColors]} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="displayHour" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  interval={1}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                {visiblePlatforms.map(platform => (
                  <Area
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    stackId="1"
                    stroke={platformColors[platform as keyof typeof platformColors]}
                    fill={`url(#gradient-${platform})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="displayHour" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  interval={1}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                {visiblePlatforms.map(platform => (
                  <Line
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    stroke={platformColors[platform as keyof typeof platformColors]}
                    strokeWidth={3}
                    dot={{ fill: platformColors[platform as keyof typeof platformColors], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: platformColors[platform as keyof typeof platformColors], strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyActivityChart;
