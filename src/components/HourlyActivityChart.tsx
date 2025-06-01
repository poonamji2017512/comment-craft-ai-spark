
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Clock, TrendingUp, Activity, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HourlyData {
  hour: string;
  displayHour: string;
  Twitter: number;
  LinkedIn: number;
  Facebook: number;
  Instagram: number;
  TikTok: number;
  Reddit: number;
  YouTube: number;
  total: number;
}

interface PlatformVisibility {
  [key: string]: boolean;
}

const HourlyActivityChart = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [peakHour, setPeakHour] = useState<string>('');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [platformVisibility, setPlatformVisibility] = useState<PlatformVisibility>({
    Twitter: true,
    LinkedIn: true,
    Facebook: true,
    Instagram: true,
    TikTok: true,
    Reddit: true,
    YouTube: true,
  });

  useEffect(() => {
    fetchHourlyData();
  }, []);

  const fetchHourlyData = async () => {
    try {
      setIsLoading(true);
      
      // Get comments from the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: commentsData } = await supabase
        .from('generated_comments')
        .select('created_at, platform')
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
          TikTok: 0,
          Reddit: 0,
          YouTube: 0,
          total: 0
        };
      }

      let totalCount = 0;
      let maxHourActivity = 0;
      let busyHour = '';

      // Process the data
      if (commentsData) {
        commentsData.forEach(comment => {
          const commentDate = new Date(comment.created_at);
          const hour = commentDate.getHours().toString().padStart(2, '0') + ':00';
          
          if (hourlyActivity[hour]) {
            // Map platform names to match our data structure
            let platformKey = comment.platform;
            if (platformKey === 'twitter') platformKey = 'Twitter';
            else if (platformKey === 'linkedin') platformKey = 'LinkedIn';
            else if (platformKey === 'facebook') platformKey = 'Facebook';
            else if (platformKey === 'instagram') platformKey = 'Instagram';
            else if (platformKey === 'reddit') platformKey = 'Reddit';
            else if (platformKey === 'youtube') platformKey = 'YouTube';
            else if (platformKey === 'tiktok') platformKey = 'TikTok';
            
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
      setTotalComments(totalCount);
      setPeakHour(busyHour || 'N/A');
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
    TikTok: '#000000',
    Reddit: '#FF4500',
    YouTube: '#FF0000'
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
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${entry.dataKey}: ${entry.value}`}
              </p>
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{totalComments}</div>
            <div className="text-sm text-muted-foreground">Total Comments (24h)</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{peakHour}</div>
            <div className="text-sm text-muted-foreground">Peak Activity Hour</div>
          </div>
        </div>

        {/* Platform Controls */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-foreground">Platforms</div>
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
          <div className="flex flex-wrap gap-2">
            {Object.entries(platformColors).map(([platform, color]) => (
              <Button
                key={platform}
                variant={platformVisibility[platform] ? "default" : "outline"}
                size="sm"
                onClick={() => togglePlatformVisibility(platform)}
                className="h-8 px-3 text-xs font-medium"
                style={{
                  backgroundColor: platformVisibility[platform] ? color : 'transparent',
                  borderColor: color,
                  color: platformVisibility[platform] ? 'white' : color
                }}
              >
                {platform}
                {platformVisibility[platform] && (
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {hourlyData.reduce((sum, hour) => sum + (hour as any)[platform], 0)}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
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
