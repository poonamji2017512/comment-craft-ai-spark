
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

const History = () => {
  // Mock history data - in a real app this would come from a database
  const mockHistory = [
    {
      id: 1,
      content: "This is a really insightful post! Thanks for sharing your thoughts on this topic.",
      platform: "LinkedIn",
      tone: "Professional",
      timestamp: "2024-01-20 14:30",
    },
    {
      id: 2,
      content: "Love this! 🔥 Such great content, keep it up! 👏",
      platform: "Instagram",
      tone: "Casual",
      timestamp: "2024-01-20 10:15",
    },
    {
      id: 3,
      content: "Interesting perspective. I'd like to add that this approach also works well in enterprise environments.",
      platform: "Twitter",
      tone: "Professional",
      timestamp: "2024-01-19 16:45",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comment History</h1>
      
      <div className="space-y-4">
        {mockHistory.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.platform}</Badge>
                  <Badge variant="outline">{item.tone}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4 leading-relaxed">
                {item.content}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.content)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {mockHistory.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No comment history yet. Generate your first comment to see it here!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
