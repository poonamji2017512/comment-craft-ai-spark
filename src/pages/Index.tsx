import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CommentCard from "@/components/CommentCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('professional');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const platforms = [
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'bluesky', label: 'Bluesky' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'supportive', label: 'Supportive' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'critical', label: 'Critical' }
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
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Comment Companion Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Generate Perfect Comments
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create engaging, human-like comments for any social platform using AI. 
            Input your post and get multiple suggestions tailored to your audience.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="input" className="text-sm font-medium mb-2 block">
                Post URL or Content *
              </Label>
              <Textarea
                id="input"
                placeholder="Paste the post URL or copy the post content here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="platform" className="text-sm font-medium mb-2 block">
                  Target Platform *
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
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
                <Label className="text-sm font-medium mb-3 block">
                  Comment Tone
                </Label>
                <RadioGroup value={tone} onValueChange={setTone} className="grid grid-cols-2 gap-2">
                  {tones.map((toneOption) => (
                    <div key={toneOption.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={toneOption.value} id={toneOption.value} />
                      <Label htmlFor={toneOption.value} className="text-sm cursor-pointer">
                        {toneOption.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <Button 
              onClick={generateComments}
              disabled={isGenerating}
              className="w-full md:w-auto"
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
              <h2 className="text-2xl font-bold text-foreground">
                Comment Suggestions
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
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
          <Card className="border-2 border-dashed border-border">
            <CardContent className="text-center py-12">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ready to Generate Comments
              </h3>
              <p className="text-muted-foreground">
                Enter your post content and platform to get started with AI-generated comment suggestions.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </div>
  );
};

export default Index;
