
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

const CommentGenerator = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('friendly');
  const [length, setLength] = useState([100]);
  const [generatedComments, setGeneratedComments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'youtube', label: 'YouTube' }
  ];

  const tones = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'thoughtful', label: 'Thoughtful' },
    { value: 'humorous', label: 'Humorous' }
  ];

  const generateComments = async () => {
    if (!originalPost.trim()) {
      toast.error('Please enter the original post content');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with mock data
    setTimeout(() => {
      const mockComments = [
        `Great insights! Thanks for sharing this perspective on ${originalPost.slice(0, 20)}...`,
        `This really resonates with me. I've had similar experiences and appreciate you bringing this up.`,
        `Interesting point! I'd love to hear more about your thoughts on this topic.`
      ];
      
      setGeneratedComments(mockComments);
      setIsGenerating(false);
      toast.success('Comments generated successfully!');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Comment copied to clipboard!');
  };

  const regenerateComment = (index: number) => {
    const newComments = [...generatedComments];
    newComments[index] = `Regenerated comment for "${originalPost.slice(0, 30)}..." - This is a fresh perspective!`;
    setGeneratedComments(newComments);
    toast.success('Comment regenerated!');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate AI Comments
          </CardTitle>
          <CardDescription>
            Enter the original post content and customize your comment preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Original Post Content</label>
            <Textarea
              placeholder="Paste the original post content here..."
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
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
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Length: {length[0]} characters
              </label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={280}
                min={50}
                step={10}
                className="mt-2"
              />
            </div>
          </div>

          <Button 
            onClick={generateComments} 
            disabled={isGenerating || !originalPost.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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

      {/* Generated Comments Section */}
      {generatedComments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Comments</CardTitle>
            <CardDescription>
              AI-generated comments ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedComments.map((comment, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm leading-relaxed">{comment}</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {comment.length} chars
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => regenerateComment(index)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => copyToClipboard(comment)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommentGenerator;
