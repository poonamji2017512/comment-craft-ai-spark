
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HourlyData {
  hour: string;
  Twitter: number;
  LinkedIn: number;
  Facebook: number;
  Instagram: number;
  TikTok: number;
  total: number;
}

const HourlyActivityChart = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);

  useEffect(() => {
    fetchHourlyData();
  }, []);

  const fetchHourlyData = async () => {
    try {
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
        hourlyActivity[hour] = {
          hour,
          Twitter: 0,
          LinkedIn: 0,
          Facebook: 0,
          Instagram: 0,
          TikTok: 0,
          total: 0
        };
      }

      // Process the data
      if (commentsData) {
        commentsData.forEach(comment => {
          const commentDate = new Date(comment.created_at);
          const hour = commentDate.getHours().toString().padStart(2, '0') + ':00';
          
          if (hourlyActivity[hour]) {
            const platform = comment.platform as keyof Omit<HourlyData, 'hour' | 'total'>;
            if (platform in hourlyActivity[hour]) {
              hourlyActivity[hour][platform]++;
              hourlyActivity[hour].total++;
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
    } catch (error) {
      console.error('Error fetching hourly data:', error);
    }
  };

  const platformColors = {
    Twitter: '#1DA1F2',
    LinkedIn: '#0077B5',
    Facebook: '#1877F2',
    Instagram: '#E4405F',
    TikTok: '#000000'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          24-Hour Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value, name) => [value, name]}
              />
              <Legend />
              {Object.entries(platformColors).map(([platform, color]) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyActivityChart;
