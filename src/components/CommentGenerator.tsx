import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sparkles, RefreshCw, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { commentGenerationSchema, sanitizeText, sanitizeErrorMessage } from "@/lib/validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useMilestoneTracking } from "@/hooks/useMilestoneTracking";
interface CommentSuggestion {
  id: number;
  text: string;
  platform: string;
  length: number;
}
const CommentGenerator = () => {
  const {
    userProfile
  } = useAuth();
  const [originalPost, setOriginalPost] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('friendly');
  const [length, setLength] = useState([280]);
  const [generatedComments, setGeneratedComments] = useState<CommentSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [dailyTarget, setDailyTarget] = useState(20);

  // Get current daily comment count from user profile
  const currentDailyCount = userProfile?.daily_prompt_count || 0;

  // Use milestone tracking
  const {
    getProgressInfo
  } = useMilestoneTracking(currentDailyCount, dailyTarget);

  // Load settings from sessionStorage on component mount
  useEffect(() => {
    const savedLength = sessionStorage.getItem('comment-length-setting');
    const savedPlatform = sessionStorage.getItem('comment-platform-setting');
    const savedTone = sessionStorage.getItem('comment-tone-setting');
    const savedTarget = sessionStorage.getItem('daily-comment-target');
    if (savedLength) {
      const parsedLength = parseInt(savedLength);
      if (!isNaN(parsedLength) && parsedLength >= 50 && parsedLength <= 10000) {
        setLength([parsedLength]);
      }
    }
    if (savedPlatform) {
      setPlatform(savedPlatform);
    }
    if (savedTone) {
      setTone(savedTone);
    }
    if (savedTarget) {
      const parsedTarget = parseInt(savedTarget);
      if (!isNaN(parsedTarget) && parsedTarget >= 1 && parsedTarget <= 100) {
        setDailyTarget(parsedTarget);
      }
    }
  }, []);

  // Save settings to sessionStorage when they change
  useEffect(() => {
    sessionStorage.setItem('comment-length-setting', length[0].toString());
  }, [length]);
  useEffect(() => {
    sessionStorage.setItem('comment-platform-setting', platform);
  }, [platform]);
  useEffect(() => {
    sessionStorage.setItem('comment-tone-setting', tone);
  }, [tone]);
  const platforms = [{
    value: 'twitter',
    label: 'Twitter/X'
  }, {
    value: 'linkedin',
    label: 'LinkedIn'
  }, {
    value: 'facebook',
    label: 'Facebook'
  }, {
    value: 'instagram',
    label: 'Instagram'
  }, {
    value: 'reddit',
    label: 'Reddit'
  }, {
    value: 'youtube',
    label: 'YouTube'
  }];
  const tones = [{
    value: 'friendly',
    label: 'Friendly'
  }, {
    value: 'professional',
    label: 'Professional'
  }, {
    value: 'casual',
    label: 'Casual'
  }, {
    value: 'enthusiastic',
    label: 'Enthusiastic'
  }, {
    value: 'thoughtful',
    label: 'Thoughtful'
  }, {
    value: 'humorous',
    label: 'Humorous'
  }, {
    value: 'gen-z',
    label: 'Gen-Z'
  }, {
    value: 'thanks',
    label: 'Thanks'
  }];
  const validateInput = () => {
    try {
      setValidationError('');
      const result = commentGenerationSchema.parse({
        originalPost: sanitizeText(originalPost),
        platform,
        tone,
        maxLength: length[0]
      });
      return result;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Invalid input';
      setValidationError(errorMessage);
      return null;
    }
  };
  const generateComments = async () => {
    const validatedInput = validateInput();
    if (!validatedInput) {
      toast.error(validationError);
      return;
    }
    setIsGenerating(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to generate comments');
        setIsGenerating(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-ai-comment', {
        body: validatedInput
      });
      if (error) {
        console.error('Error generating comments:', error);
        toast.error('Failed to generate comments. Please try again.');
        return;
      }
      if (data?.comments) {
        // Sanitize generated comments before displaying
        const sanitizedComments = data.comments.map((comment: any) => ({
          ...comment,
          text: sanitizeText(comment.text)
        }));
        setGeneratedComments(sanitizedComments);
        setLastGenerationTime(Date.now());
        toast.success('Comments generated successfully!');
      } else {
        toast.error('No comments were generated. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(sanitizeErrorMessage(error));
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
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Comment copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy comment");
    }
  };
  const platformIcons = {
    twitter: '𝕏',
    linkedin: '💼',
    facebook: '📘',
    instagram: '📷',
    reddit: '🔴',
    youtube: '📺'
  };
  const platformColors = {
    twitter: "bg-blue-500",
    linkedin: "bg-blue-700",
    facebook: "bg-blue-600",
    instagram: "bg-pink-500",
    reddit: "bg-orange-500",
    youtube: "bg-red-500"
  };
  const progressInfo = getProgressInfo();
  return <div className="space-y-6">
      {/* Progress Indicator */}
      {userProfile}

      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate AI Comments
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the original post content and customize your comment preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationError && <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>}
          
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Original Post Content</label>
            <Textarea placeholder="Paste the original post content here..." value={originalPost} onChange={e => {
            setOriginalPost(e.target.value);
            setValidationError('');
          }} className="min-h-[120px] bg-background border-border text-foreground" maxLength={10000} />
            <div className="text-xs text-muted-foreground mt-1">
              {originalPost.length}/10,000 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {platforms.map(p => <SelectItem key={p.value} value={p.value} className="text-foreground hover:bg-muted">
                      {p.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {tones.map(t => <SelectItem key={t.value} value={t.value} className="text-foreground hover:bg-muted">
                      {t.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">
                Length: {length[0]} characters
              </label>
              <Slider value={length} onValueChange={setLength} max={platform === 'linkedin' ? 3000 : platform === 'reddit' ? 10000 : 280} min={50} step={10} className="mt-2" />
            </div>
          </div>

          <Button onClick={generateComments} disabled={isGenerating || !originalPost.trim() || !!validationError} className="w-full" size="lg">
            {isGenerating ? <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Comments...
              </> : <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Comments
              </>}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Comments Section */}
      {generatedComments.length > 0 && <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-foreground">Generated Comments</CardTitle>
              <CardDescription className="text-muted-foreground">
                AI-generated comments ready to use
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={regenerateComments} disabled={isGenerating} className="ml-4 border-border text-foreground hover:bg-muted">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedComments.map((comment, index) => <Card key={`${comment.id}-${lastGenerationTime}`} className="bg-background border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`${platformColors[platform as keyof typeof platformColors] || "bg-gray-500"} p-2 rounded-lg`}>
                          <span className="text-white text-sm">
                            {platformIcons[platform as keyof typeof platformIcons] || '💬'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{platform}</p>
                          <p className="text-sm text-muted-foreground">
                            Comment #{index + 1}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {tone}
                        </Badge>
                        <Badge variant="outline" className="border-border text-foreground">
                          {comment.text.length} chars
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-foreground bg-muted p-3 rounded-lg border border-border">
                          {comment.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button onClick={() => copyToClipboard(comment.text)} variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default CommentGenerator;