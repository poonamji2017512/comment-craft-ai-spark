
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CommentCard from "./CommentCard";

interface CommentSuggestion {
  id: number;
  text: string;
  platform: string;
  length: number;
}

const CommentGenerator = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('friendly');
  const [length, setLength] = useState([280]);
  const [generatedComments, setGeneratedComments] = useState<CommentSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);

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
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to generate comments');
        setIsGenerating(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-ai-comment', {
        body: {
          originalPost,
          platform,
          tone,
          maxLength: length[0]
        }
      });

      if (error) {
        console.error('Error generating comments:', error);
        toast.error('Failed to generate comments. Please try again.');
        return;
      }

      if (data?.comments) {
        // Clear previous comments and set new ones
        setGeneratedComments(data.comments);
        setLastGenerationTime(Date.now());
        toast.success('Comments generated successfully!');
      } else {
        toast.error('No comments were generated. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateComments = async () => {
    // Add a small delay to prevent too frequent regenerations
    const timeSinceLastGeneration = Date.now() - lastGenerationTime;
    if (timeSinceLastGeneration < 3000) {
      toast.error('Please wait a moment before regenerating');
      return;
    }
    
    await generateComments();
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
                max={platform === 'linkedin' ? 3000 : platform === 'reddit' ? 10000 : 280}
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Generated Comments</CardTitle>
              <CardDescription>
                AI-generated comments ready to use
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateComments}
              disabled={isGenerating}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedComments.map((comment, index) => (
                <CommentCard
                  key={`${comment.id}-${lastGenerationTime}`}
                  suggestion={comment}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommentGenerator;
