
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ThumbsUp, ThumbsDown, Edit, Sparkles, Settings, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommentCard from "@/components/CommentCard";
import Header from "@/components/Header";

const Index = () => {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('');
  const [toneDirective, setToneDirective] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const platforms = [
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'bluesky', label: 'Bluesky' }
  ];

  const mockSuggestions = [
    {
      id: 1,
      text: "This is incredibly insightful! The way you've broken down the complexity into actionable steps really resonates. Thanks for sharing your expertise! 🚀",
      platform: "twitter",
      length: 145
    },
    {
      id: 2,
      text: "Absolutely brilliant perspective! I've been thinking about this exact challenge, and your approach offers a fresh angle I hadn't considered. Looking forward to implementing some of these ideas.",
      platform: "linkedin",
      length: 198
    },
    {
      id: 3,
      text: "Great post! This really highlights the importance of strategic thinking in today's fast-paced environment. Would love to hear more about your experience with implementation.",
      platform: "twitter",
      length: 178
    },
    {
      id: 4,
      text: "This hits different! 💯 The authenticity in your approach is exactly what the industry needs right now. Keep pushing boundaries! 🔥",
      platform: "twitter",
      length: 134
    }
  ];

  const generateComments = async () => {
    if (!input.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please provide post content and select a platform.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const platformSpecificSuggestions = mockSuggestions.filter(s => 
        s.platform === platform || platform === 'linkedin'
      ).slice(0, 4);
      
      setSuggestions(platformSpecificSuggestions);
      setIsGenerating(false);
      
      toast({
        title: "Comments Generated!",
        description: `Generated ${platformSpecificSuggestions.length} comment suggestions for ${platforms.find(p => p.value === platform)?.label}.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Comment Companion Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generate Perfect Comments
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create engaging, human-like comments for any social platform using AI. 
            Input your post and get multiple suggestions tailored to your audience.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="input" className="text-sm font-medium text-gray-700 mb-2 block">
                Post URL or Content *
              </Label>
              <Textarea
                id="input"
                placeholder="Paste the post URL or copy the post content here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-24 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform" className="text-sm font-medium text-gray-700 mb-2 block">
                  Target Platform *
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Tone/Directive (Optional)
                </Label>
                <Input
                  id="tone"
                  placeholder="e.g., professional, casual, enthusiastic"
                  value={toneDirective}
                  onChange={(e) => setToneDirective(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
            
            <Button 
              onClick={generateComments}
              disabled={isGenerating}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Comments...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Comments
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Comment Suggestions
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {suggestions.length} suggestions
              </span>
            </div>
            
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <CommentCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {suggestions.length === 0 && !isGenerating && (
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
            <CardContent className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Ready to Generate Comments
              </h3>
              <p className="text-gray-500">
                Enter your post content and platform to get started with AI-generated comment suggestions.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
