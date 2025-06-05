
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { Brain } from "lucide-react";

interface ModelUsageData {
  name: string;
  value: number;
  color: string;
}

const ModelUsageChart = () => {
  const [modelData, setModelData] = useState<ModelUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModelUsage();
  }, []);

  const fetchModelUsage = async () => {
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('ai_model');

      if (settings && settings.length > 0) {
        const modelCounts: Record<string, number> = {};
        
        settings.forEach(setting => {
          const model = setting.ai_model || 'gemini-2.5-pro';
          modelCounts[model] = (modelCounts[model] || 0) + 1;
        });

        const colors = [
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
          '#10B981', // Emerald
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#6366F1', // Indigo
          '#EC4899', // Pink
        ];

        const chartData = Object.entries(modelCounts).map(([model, count], index) => ({
          name: getModelDisplayName(model),
          value: count,
          color: colors[index % colors.length]
        }));

        setModelData(chartData);
      } else {
        // Default data when no user settings exist
        setModelData([
          { name: 'Gemini 2.5 Pro', value: 85, color: '#8B5CF6' },
          { name: 'GPT-4o Mini', value: 10, color: '#06B6D4' },
          { name: 'Claude 4 Sonnet', value: 5, color: '#10B981' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching model usage:', error);
      // Fallback data
      setModelData([
        { name: 'Gemini 2.5 Pro', value: 85, color: '#8B5CF6' },
        { name: 'GPT-4o Mini', value: 10, color: '#06B6D4' },
        { name: 'Claude 4 Sonnet', value: 5, color: '#10B981' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModelDisplayName = (model: string): string => {
    const modelNames: Record<string, string> = {
      'gemini-2.0-flash-lite': 'Gemini 2.0 Flash Lite',
      'gemini-2.0-flash-exp': 'Gemini 2.0 Flash Exp',
      'gemini-2.5-flash': 'Gemini 2.5 Flash',
      'gemini-2.5-pro': 'Gemini 2.5 Pro',
      'gpt-4o-mini': 'GPT-4o Mini',
      'gpt-4.1': 'GPT-4.1',
      'gpt-4o': 'GPT-4o',
      'o3-mini': 'o3-mini',
      'claude-4-opus': 'Claude 4 Opus',
      'claude-4-sonnet': 'Claude 4 Sonnet',
      'claude-3.7-sonnet': 'Claude 3.7 Sonnet'
    };
    return modelNames[model] || model;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            {data.value} users ({((data.value / modelData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Model Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Model Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {modelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {modelData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {((item.value / modelData.reduce((sum, data) => sum + data.value, 0)) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelUsageChart;
