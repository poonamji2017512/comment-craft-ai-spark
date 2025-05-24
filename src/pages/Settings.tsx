
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bot, 
  Palette, 
  Link, 
  Shield, 
  HelpCircle, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Radio,
  Trash2,
  ExternalLink
} from "lucide-react";
import Header from "@/components/Header";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  // Settings state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [defaultTone, setDefaultTone] = useState('friendly');
  const [commentLength, setCommentLength] = useState('balanced');
  const [aiLearning, setAiLearning] = useState(true);
  const [preferredKeywords, setPreferredKeywords] = useState('');
  const [avoidedTopics, setAvoidedTopics] = useState('');

  // Platform connections mock data
  const [platforms] = useState([
    { name: 'Twitter/X', icon: Twitter, connected: false, username: '' },
    { name: 'LinkedIn', icon: Linkedin, connected: true, username: '@johndoe' },
    { name: 'Reddit', icon: MessageSquare, connected: false, username: '' },
    { name: 'Bluesky', icon: Radio, connected: true, username: '@johndoe.bsky.social' },
  ]);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleResetAI = () => {
    toast({
      title: "AI learning data reset",
      description: "Your AI companion has been reset to default settings.",
    });
  };

  const handlePlatformToggle = (platformName: string) => {
    toast({
      title: `${platformName} ${platforms.find(p => p.name === platformName)?.connected ? 'disconnected' : 'connected'}`,
      description: `Your ${platformName} account has been ${platforms.find(p => p.name === platformName)?.connected ? 'disconnected' : 'connected'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your AI Comment Companion experience</p>
        </div>

        <div className="space-y-8">
          {/* Account & Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account & Profile
              </CardTitle>
              <CardDescription>
                Manage your account information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI & Comment Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                My AI Preferences
              </CardTitle>
              <CardDescription>
                Customize how your AI companion generates comments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTone">Default Tone</Label>
                  <Select value={defaultTone} onValueChange={setDefaultTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="witty">Witty</SelectItem>
                      <SelectItem value="insightful">Insightful</SelectItem>
                      <SelectItem value="supportive">Supportive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commentLength">Default Comment Length</Label>
                  <Select value={commentLength} onValueChange={setCommentLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short & Punchy</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="detailed">Allow More Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>AI Learning & Adaptation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow the AI to learn from your edits, selections, and feedback
                    </p>
                  </div>
                  <Switch
                    checked={aiLearning}
                    onCheckedChange={setAiLearning}
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleResetAI}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset AI Learning Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Preferred Keywords/Hashtags</Label>
                  <Textarea
                    id="keywords"
                    placeholder="AI, technology, innovation, #TechTalk, #Innovation (comma-separated)"
                    value={preferredKeywords}
                    onChange={(e) => setPreferredKeywords(e.target.value)}
                    className="min-h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avoided">Avoided Topics/Keywords</Label>
                  <Textarea
                    id="avoided"
                    placeholder="politics, controversial topics, personal finance (comma-separated)"
                    value={avoidedTopics}
                    onChange={(e) => setAvoidedTopics(e.target.value)}
                    className="min-h-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Platform Connections
              </CardTitle>
              <CardDescription>
                Manage your social media platform connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <platform.icon className="w-5 h-5" />
                      <div>
                        <h4 className="font-medium">{platform.name}</h4>
                        {platform.connected && platform.username && (
                          <p className="text-sm text-muted-foreground">{platform.username}</p>
                        )}
                      </div>
                      <Badge variant={platform.connected ? "default" : "secondary"}>
                        {platform.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <Button
                      variant={platform.connected ? "outline" : "default"}
                      onClick={() => handlePlatformToggle(platform.name)}
                    >
                      {platform.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tool Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tool Preferences
              </CardTitle>
              <CardDescription>
                Customize the appearance and behavior of the tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>
                Information about how your data is used and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  Your inputs, selections, and feedback are used to improve the AI model and 
                  personalize your experience. We follow strict internal data policies to 
                  protect your information.
                </p>
                <p>
                  When AI learning is enabled, your interactions help the system understand 
                  your preferences and improve future suggestions specifically for you.
                </p>
              </div>
              <Button variant="outline" className="w-full md:w-auto">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Data Usage Policy
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Get help and provide feedback about the tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  FAQ & Documentation
                </Button>
                <Button variant="outline" className="justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
