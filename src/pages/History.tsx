
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ThumbsUp, ThumbsDown, Clock, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const { toast } = useToast();

  // Mock data for comment history
  const commentHistory = [
    {
      id: 1,
      originalPost: "Just launched our new AI-powered analytics dashboard! Excited to see how it helps teams make data-driven decisions.",
      platform: "LinkedIn",
      generatedComments: [
        {
          text: "Congratulations on the launch! AI-powered analytics is such a game-changer for decision making. Would love to hear more about the key insights your dashboard surfaces.",
          feedback: "up",
          copied: true
        },
        {
          text: "This looks amazing! The intersection of AI and analytics is where the magic happens. Looking forward to seeing the impact this makes.",
          feedback: null,
          copied: false
        }
      ],
      timestamp: "2 hours ago",
      tone: "Professional"
    },
    {
      id: 2,
      originalPost: "Hot take: The future of work isn't remote vs in-office, it's about creating environments where people can do their best work regardless of location.",
      platform: "X",
      generatedComments: [
        {
          text: "Absolutely agree! It's about intentional design of work experiences rather than defaulting to location-based thinking. The best companies are already figuring this out.",
          feedback: "up",
          copied: true
        },
        {
          text: "This is the nuanced take we need more of. Geography becomes less relevant when you focus on outcomes and creating the right conditions for deep work.",
          feedback: "up",
          copied: false
        }
      ],
      timestamp: "1 day ago",
      tone: "Thoughtful"
    },
    {
      id: 3,
      originalPost: "Building in public update: We've hit 10k users! Thank you to everyone who believed in our vision early on.",
      platform: "X",
      generatedComments: [
        {
          text: "Incredible milestone! 🎉 Building in public takes courage and transparency. Your journey has been inspiring to follow. Here's to the next 10k!",
          feedback: "up",
          copied: true
        }
      ],
      timestamp: "3 days ago",
      tone: "Supportive"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Comment copied to clipboard!",
    });
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'X':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Reddit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Bluesky':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Comment History</h1>
            <p className="text-muted-foreground">View and manage your previously generated comments</p>
          </div>

          <div className="space-y-6">
            {commentHistory.map((entry) => (
              <Card key={entry.id} className="border border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPlatformBadgeColor(entry.platform)}>
                          {entry.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.tone}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {entry.timestamp}
                        </div>
                      </div>
                      <CardTitle className="text-base font-medium text-foreground leading-relaxed">
                        {entry.originalPost}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {entry.generatedComments.map((comment, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                        <p className="text-sm text-foreground mb-3 leading-relaxed">
                          {comment.text}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => copyToClipboard(comment.text)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            
                            {comment.copied && (
                              <Badge variant="secondary" className="text-xs">
                                Previously copied
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 w-7 p-0 ${
                                comment.feedback === 'up' 
                                  ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 w-7 p-0 ${
                                comment.feedback === 'down' 
                                  ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {commentHistory.length === 0 && (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No comment history yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your generated comments will appear here after you start using the tool.
                </p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Generate Your First Comment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
