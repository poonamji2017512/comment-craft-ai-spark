import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BillingSettings from "@/components/BillingSettings";
import { User, Settings as SettingsIcon, Bell, Database, Key, Trash2, Download, Eye, EyeOff, Check, X, Palette, MessageSquare, Shield, CreditCard, Users, Workflow, Crown, Mail, ExternalLink, Puzzle, Twitter, Linkedin, Globe, Clock } from "lucide-react";

interface NotificationPrefs {
  email_notifications: boolean;
  meeting_processed: boolean;
  summary_ready: boolean;
  task_due: boolean;
  frequency: string;
}

interface AIFeatures {
  auto_summarization: boolean;
  action_item_detection: boolean;
  topic_extraction: boolean;
}

interface UserSettings {
  theme: string;
  language: string;
  summary_length: string;
  ai_tone: string;
  ai_model: string;
  dashboard_view: string;
  timezone: string;
  use_custom_api_key: boolean;
  custom_api_key?: string;
  notification_prefs: NotificationPrefs;
  ai_features: AIFeatures;
}

const Settings = () => {
  const { isDark, setTheme } = useTheme();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || '',
    email: user?.email || '',
    introduction: '',
    preferred_tone: 'Bold Founder'
  });

  const defaultNotificationPrefs: NotificationPrefs = {
    email_notifications: false,
    meeting_processed: true,
    summary_ready: true,
    task_due: true,
    frequency: 'real-time'
  };

  const defaultAIFeatures: AIFeatures = {
    auto_summarization: true,
    action_item_detection: true,
    topic_extraction: true
  };

  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: isDark ? 'dark' : 'light',
    language: 'en',
    summary_length: 'medium',
    ai_tone: 'friendly',
    ai_model: 'gemini-2.5-pro',
    dashboard_view: 'recent',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    use_custom_api_key: false,
    custom_api_key: '',
    notification_prefs: defaultNotificationPrefs,
    ai_features: defaultAIFeatures
  });

  // Categorized AI models for better UX
  const aiModelCategories = {
    google: {
      name: "Google Gemini",
      models: [
        { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite', description: 'Fastest and most efficient' },
        { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Experimental', description: 'Latest experimental features' },
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Balanced performance' },
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Recommended)', description: 'Best overall performance' }
      ]
    },
    openai: {
      name: "OpenAI",
      models: [
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast and efficient' },
        { value: 'gpt-4.1', label: 'GPT-4.1', description: 'Advanced reasoning' },
        { value: 'gpt-4o', label: 'GPT-4o', description: 'Multimodal capabilities' },
        { value: 'o3-mini', label: 'o3-mini', description: 'Compact and efficient' }
      ]
    },
    anthropic: {
      name: "Anthropic Claude",
      models: [
        { value: 'claude-4-opus', label: 'Claude 4 Opus', description: 'Most powerful Claude model' },
        { value: 'claude-4-sonnet', label: 'Claude 4 Sonnet', description: 'Latest Claude model' },
        { value: 'claude-3.7-sonnet', label: 'Claude 3.7 Sonnet', description: 'Reliable performance' }
      ]
    }
  };

  const timezones = [
    { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
    { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
    { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
    { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
    { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST/NZDT)' },
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || user?.email || '',
        introduction: '',
        preferred_tone: 'Bold Founder'
      });
    }
    loadUserSettings();
  }, [userProfile, user]);

  const validateNotificationPrefs = (data: any): NotificationPrefs => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return {
        email_notifications: typeof data.email_notifications === 'boolean' ? data.email_notifications : defaultNotificationPrefs.email_notifications,
        meeting_processed: typeof data.meeting_processed === 'boolean' ? data.meeting_processed : defaultNotificationPrefs.meeting_processed,
        summary_ready: typeof data.summary_ready === 'boolean' ? data.summary_ready : defaultNotificationPrefs.summary_ready,
        task_due: typeof data.task_due === 'boolean' ? data.task_due : defaultNotificationPrefs.task_due,
        frequency: typeof data.frequency === 'string' ? data.frequency : defaultNotificationPrefs.frequency
      };
    }
    return defaultNotificationPrefs;
  };

  const validateAIFeatures = (data: any): AIFeatures => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return {
        auto_summarization: typeof data.auto_summarization === 'boolean' ? data.auto_summarization : defaultAIFeatures.auto_summarization,
        action_item_detection: typeof data.action_item_detection === 'boolean' ? data.action_item_detection : defaultAIFeatures.action_item_detection,
        topic_extraction: typeof data.topic_extraction === 'boolean' ? data.topic_extraction : defaultAIFeatures.topic_extraction
      };
    }
    return defaultAIFeatures;
  };

  const loadUserSettings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setHasExistingSettings(true);
        const notificationPrefs = validateNotificationPrefs(data.notification_prefs);
        const aiFeatures = validateAIFeatures(data.ai_features);

        setUserSettings({
          theme: data.theme || 'dark',
          language: data.language || 'en',
          summary_length: data.summary_length || 'medium',
          ai_tone: data.ai_tone || 'friendly',
          ai_model: data.ai_model || 'gemini-2.5-pro',
          dashboard_view: data.dashboard_view || 'recent',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          use_custom_api_key: data.use_custom_api_key || false,
          custom_api_key: data.custom_api_key || '',
          notification_prefs: notificationPrefs,
          ai_features: aiFeatures
        });
      } else {
        setHasExistingSettings(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveUserSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setIsLoading(true);
    try {
      const settingsToSave = {
        ...userSettings,
        ...updatedSettings
      };

      console.log('Saving settings:', settingsToSave);

      const settingsData = {
        user_id: user.id,
        theme: settingsToSave.theme,
        language: settingsToSave.language,
        summary_length: settingsToSave.summary_length,
        ai_tone: settingsToSave.ai_tone,
        ai_model: settingsToSave.ai_model,
        dashboard_view: settingsToSave.dashboard_view,
        timezone: settingsToSave.timezone,
        use_custom_api_key: settingsToSave.use_custom_api_key,
        custom_api_key: settingsToSave.custom_api_key,
        notification_prefs: settingsToSave.notification_prefs as any,
        ai_features: settingsToSave.ai_features as any
      };

      let error;
      if (hasExistingSettings) {
        // Update existing settings
        const result = await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new settings
        const result = await supabase
          .from('user_settings')
          .insert(settingsData);
        error = result.error;
        if (!error) {
          setHasExistingSettings(true);
        }
      }

      if (error) {
        console.error('Error saving settings:', error);
        toast.error(`Failed to save settings: ${error.message}`);
        return;
      }

      setUserSettings(settingsToSave);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred while saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) {
      toast.error('You must be logged in to update profile');
      return;
    }

    setIsLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error(`Failed to update profile: ${profileError.message}`);
        return;
      }

      // Also save current settings
      await saveUserSettings({});
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelection = async (modelValue: string) => {
    await saveUserSettings({ ai_model: modelValue });
  };

  const validateApiKey = async () => {
    if (!userSettings.custom_api_key) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + userSettings.custom_api_key);
      if (response.ok) {
        setApiKeyValid(true);
        toast.success('API key is valid!');
      } else {
        setApiKeyValid(false);
        toast.error('Invalid API key');
      }
    } catch (error) {
      setApiKeyValid(false);
      toast.error('Failed to validate API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('generated_comments')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to export data');
        return;
      }

      const exportData = {
        user_profile: userProfile,
        generated_comments: data,
        user_settings: userSettings,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-comments-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while exporting data');
    }
  };

  const handleClearData = async () => {
    if (!user || !confirm('Are you sure you want to clear all your data? This action cannot be undone.')) return;
    try {
      const { error } = await supabase
        .from('generated_comments')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing data:', error);
        toast.error('Failed to clear data');
        return;
      }

      toast.success('All data cleared successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while clearing data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your AI comment experience</p>
        </div>
        {userProfile && (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Daily Comments: {userProfile.daily_prompt_count || 0}/20
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-8 h-12">
          <TabsTrigger value="account" className="flex items-center gap-2 px-4">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2 px-4">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Platforms</span>
          </TabsTrigger>
          <TabsTrigger value="tone" className="flex items-center gap-2 px-4">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Tone & Style</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2 px-4">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2 px-4">
            <Workflow className="h-4 w-4" />
            <span className="hidden sm:inline">Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2 px-4">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">AI & API</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex items-center gap-2 px-4">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Safety</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 px-4">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 px-4">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="bg-gradient-to-r from-orange-500 to-pink-500 border-0 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6" />
                    <h3 className="text-xl font-bold">Unlock the most powerful AI experience</h3>
                  </div>
                  <p className="text-white/90">Get the most out of AI Comment Agent with Pro. Learn more</p>
                </div>
                <Button variant="secondary" className="bg-white text-orange-600 hover:bg-white/90">
                  Learn more
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-foreground">Display Name</Label>
                <Input
                  id="full-name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your display name"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted border-border text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introduction" className="text-foreground">Introduction</Label>
                <Textarea
                  id="introduction"
                  value={profileData.introduction}
                  onChange={(e) => setProfileData(prev => ({ ...prev, introduction: e.target.value }))}
                  placeholder="Describe yourself (used for AI context)"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Timezone</Label>
                <select
                  value={userSettings.timezone}
                  onChange={(e) => saveUserSettings({ timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md"
                  disabled={isLoading}
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  Used for displaying activity timelines and notifications in your local time
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Preferred Tone</Label>
                <select
                  value={profileData.preferred_tone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, preferred_tone: e.target.value }))}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md"
                >
                  <option value="Bold Founder">Bold Founder</option>
                  <option value="Curious Maker">Curious Maker</option>
                  <option value="Corporate Executive">Corporate Executive</option>
                  <option value="Indie Hacker">Indie Hacker</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleProfileUpdate} disabled={isLoading} className="flex-1">
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:support@interactai.com', '_blank')}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={isDark}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? 'dark' : 'light');
                    saveUserSettings({ theme: checked ? 'dark' : 'light' });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Language</Label>
                <select
                  value={userSettings.language}
                  onChange={(e) => saveUserSettings({ language: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md"
                  disabled={isLoading}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI & API Tab with 3-column grid layout */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">AI Model Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(aiModelCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.models.map((model) => (
                      <div
                        key={model.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          userSettings.ai_model === model.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleModelSelection(model.value)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">{model.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                          </div>
                          {userSettings.ai_model === model.value && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Alert>
                <AlertDescription>
                  Google Gemini 2.5 Pro is recommended for optimal performance and advanced capabilities.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API Key Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Use Custom API Key</Label>
                <Switch
                  checked={userSettings.use_custom_api_key}
                  onCheckedChange={(checked) => saveUserSettings({ use_custom_api_key: checked })}
                />
              </div>

              {userSettings.use_custom_api_key && (
                <div className="space-y-3">
                  <Label className="text-foreground">API Key (for selected model)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={userSettings.custom_api_key}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, custom_api_key: e.target.value }))}
                        placeholder="Enter your API key"
                        className="bg-background border-border text-foreground pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={validateApiKey}
                      disabled={!userSettings.custom_api_key || isLoading}
                    >
                      Validate
                    </Button>
                  </div>

                  {apiKeyValid !== null && (
                    <Alert className={apiKeyValid ? "border-green-500" : "border-red-500"}>
                      {apiKeyValid ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                      <AlertDescription className={apiKeyValid ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
                        {apiKeyValid ? "API key is valid and working" : "API key is invalid or expired"}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={() => saveUserSettings({ custom_api_key: userSettings.custom_api_key })}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Save API Key
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Connected Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Twitter className="h-8 w-8 text-blue-400" />
                      <div>
                        <h3 className="font-medium">X (Twitter)</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Connect
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">LinkedIn</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Connect
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-orange-500" />
                      <div>
                        <h3 className="font-medium">Reddit</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Connect
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Bluesky</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Connect
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Puzzle className="h-8 w-8 text-purple-500" />
                      <div>
                        <h3 className="font-medium">Interact Extension</h3>
                        <p className="text-sm text-muted-foreground">Browser extension for all platforms</p>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Install
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tone & Style Tab */}
        <TabsContent value="tone">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tone & Style Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Comment Length</Label>
                <select
                  value={userSettings.summary_length}
                  onChange={(e) => saveUserSettings({ summary_length: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Long</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground">AI Response Tone</Label>
                <select
                  value={userSettings.ai_tone}
                  onChange={(e) => saveUserSettings({ ai_tone: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <Label className="text-foreground">Style Options</Label>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Use Emojis</Label>
                  <Switch
                    checked={userSettings.ai_features.auto_summarization}
                    onCheckedChange={(checked) => saveUserSettings({
                      ai_features: { ...userSettings.ai_features, auto_summarization: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Use Hashtags</Label>
                  <Switch
                    checked={userSettings.ai_features.action_item_detection}
                    onCheckedChange={(checked) => saveUserSettings({
                      ai_features: { ...userSettings.ai_features, action_item_detection: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Auto Tone Detection</Label>
                  <Switch
                    checked={userSettings.ai_features.topic_extraction}
                    onCheckedChange={(checked) => saveUserSettings({
                      ai_features: { ...userSettings.ai_features, topic_extraction: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Voice Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Frequently Used Phrases</Label>
                <Textarea placeholder="Enter phrases you commonly use..." className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Brand CTAs and Catchphrases</Label>
                <Textarea placeholder="Enter your brand catchphrases and CTAs..." className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Always Say</Label>
                <Textarea placeholder="Phrases to always include..." className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Never Say</Label>
                <Textarea placeholder="Phrases to never use..." className="bg-background border-border text-foreground" />
              </div>
              <Button onClick={() => toast.success('Voice settings saved!')} className="w-full">
                Save Voice Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Comment Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Auto Approval</Label>
                <Switch
                  checked={userSettings.ai_features.auto_summarization}
                  onCheckedChange={(checked) => saveUserSettings({
                    ai_features: { ...userSettings.ai_features, auto_summarization: checked }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Comments per Day Limit</Label>
                <Input type="number" placeholder="20" className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Priority Targeting</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">Verified Users Only</Label>
                    <Switch
                      checked={userSettings.ai_features.action_item_detection}
                      onCheckedChange={(checked) => saveUserSettings({
                        ai_features: { ...userSettings.ai_features, action_item_detection: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">High Engagement Posts</Label>
                    <Switch
                      checked={userSettings.ai_features.topic_extraction}
                      onCheckedChange={(checked) => saveUserSettings({
                        ai_features: { ...userSettings.ai_features, topic_extraction: checked }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Safety & Guardrails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-foreground">Never Comment On</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">Politics</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">Religion</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">Personal Tragedies</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-sm">NSFW Content</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Banned Keywords</Label>
                <Textarea placeholder="Enter comma-separated keywords to avoid..." className="bg-background border-border text-foreground" />
              </div>
              <Button onClick={() => toast.success('Safety settings saved!')} className="w-full">
                Save Safety Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Data Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export all your data including comments, settings, and usage history.
              </p>
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data (JSON)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Clear All Data</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your generated comments. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleClearData} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab - Now using BillingSettings component */}
        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>
      </Tabs>

      {/* Account Information Footer */}
      {userProfile && (
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since:</span>
              <span className="text-foreground">{new Date(userProfile.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last login:</span>
              <span className="text-foreground">
                {userProfile.last_login ? new Date(userProfile.last_login).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily usage:</span>
              <span className="text-foreground">{userProfile.daily_prompt_count || 0} / 20</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
