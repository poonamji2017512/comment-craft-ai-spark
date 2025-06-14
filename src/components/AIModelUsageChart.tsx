
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Brain, Zap, Star } from "lucide-react";

const AIModelUsageChart = () => {
  // Sample data - in a real app, this would come from actual usage analytics
  const modelUsageData = [
    { name: "Gemini 2.5 Pro", usage: 45, color: "#4285f4", sessions: 156, icon: Star },
    { name: "GPT-4.1", usage: 25, color: "#00a96e", sessions: 89, icon: Brain },
    { name: "Claude 4 Sonnet", usage: 20, color: "#ff6b35", sessions: 67, icon: Zap },
    { name: "Gemini 2.5 Flash", usage: 7, color: "#34a853", sessions: 23, icon: Zap },
    { name: "GPT-4o", usage: 3, color: "#fbbc04", sessions: 12, icon: Brain }
  ];

  const totalSessions = modelUsageData.reduce((sum, model) => sum + model.sessions, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Model Usage Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Usage by Percentage</h3>
              <ChartContainer
                config={modelUsageData.reduce((acc, model) => ({
                  ...acc,
                  [model.name]: { label: model.name, color: model.color }
                }), {})}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="usage"
                    >
                      {modelUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-foreground">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.usage}% ({data.sessions} sessions)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Bar Chart */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Sessions Count</h3>
              <ChartContainer
                config={modelUsageData.reduce((acc, model) => ({
                  ...acc,
                  [model.name]: { label: model.name, color: model.color }
                }), {})}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-foreground">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.sessions} sessions ({data.usage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="sessions" fill="#4285f4" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Model Details */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Model Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {modelUsageData.map((model) => {
                const IconComponent = model.icon;
                return (
                  <div
                    key={model.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: model.color }}
                      />
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {model.name.split(' ').slice(-2).join(' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{model.usage}%</div>
                      <div className="text-xs text-muted-foreground">{model.sessions} uses</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Total AI sessions this month: {totalSessions}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelUsageChart;
