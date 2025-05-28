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
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Database, 
  Key, 
  Trash2, 
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  Palette,
  MessageSquare,
  Shield,
  CreditCard,
  Users
} from "lucide-react";

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
  dashboard_view: string;
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
  const [activeSection, setActiveSection] = useState("account");
  
  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || '',
    email: user?.email || '',
    introduction: '',
    preferred_tone: 'Bold Founder',
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
    dashboard_view: 'recent',
    use_custom_api_key: false,
    custom_api_key: '',
    notification_prefs: defaultNotificationPrefs,
    ai_features: defaultAIFeatures
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || user?.email || '',
        introduction: '',
        preferred_tone: 'Bold Founder',
      });
    }
    loadUserSettings();
  }, [userProfile, user]);

  const isValidNotificationPrefs = (data: any): data is NotificationPrefs => {
    return data && 
           typeof data === 'object' && 
           typeof data.email_notifications === 'boolean' &&
           typeof data.meeting_processed === 'boolean' &&
           typeof data.summary_ready === 'boolean' &&
           typeof data.task_due === 'boolean' &&
           typeof data.frequency === 'string';
  };

  const isValidAIFeatures = (data: any): data is AIFeatures => {
    return data && 
           typeof data === 'object' && 
           typeof data.auto_summarization === 'boolean' &&
           typeof data.action_item_detection === 'boolean' &&
           typeof data.topic_extraction === 'boolean';
  };

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        const notificationPrefs = isValidNotificationPrefs(data.notification_prefs) 
          ? data.notification_prefs 
          : defaultNotificationPrefs;
        
        const aiFeatures = isValidAIFeatures(data.ai_features) 
          ? data.ai_features 
          : defaultAIFeatures;

        setUserSettings({
          theme: data.theme || 'dark',
          language: data.language || 'en',
          summary_length: data.summary_length || 'medium',
          ai_tone: data.ai_tone || 'friendly',
          dashboard_view: data.dashboard_view || 'recent',
          use_custom_api_key: data.use_custom_api_key || false,
          custom_api_key: data.custom_api_key || '',
          notification_prefs: notificationPrefs,
          ai_features: aiFeatures
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveUserSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const settingsToSave = { ...userSettings, ...updatedSettings };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: settingsToSave.theme,
          language: settingsToSave.language,
          summary_length: settingsToSave.summary_length,
          ai_tone: settingsToSave.ai_tone,
          dashboard_view: settingsToSave.dashboard_view,
          use_custom_api_key: settingsToSave.use_custom_api_key,
          custom_api_key: settingsToSave.custom_api_key,
          notification_prefs: settingsToSave.notification_prefs as any,
          ai_features: settingsToSave.ai_features as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return;
      }

      setUserSettings(settingsToSave);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
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
    if (!user) return;
    
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

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'platforms', label: 'Platforms', icon: Users },
    { id: 'tone', label: 'Tone & Style', icon: Palette },
    { id: 'voice', label: 'Voice', icon: MessageSquare },
    { id: 'workflow', label: 'Workflow', icon: SettingsIcon },
    { id: 'ai', label: 'AI & API', icon: Key },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'history', label: 'History', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-4">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="space-y-6">
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
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </CardContent>
              </Card>

              {/* Appearance */}
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
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI & API Section */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Google API Key Management</CardTitle>
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
                      <Label className="text-foreground">Google Gemini 2.5 API Key</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={userSettings.custom_api_key}
                            onChange={(e) => setUserSettings(prev => ({ ...prev, custom_api_key: e.target.value }))}
                            placeholder="Enter your Google API key"
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

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">AI Settings</CardTitle>
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
                    <Label className="text-foreground">AI Features</Label>
                    {Object.entries(userSettings.ai_features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            saveUserSettings({ 
                              ai_features: { ...userSettings.ai_features, [key]: checked }
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* History Section */}
          {activeSection === 'history' && (
            <div className="space-y-6">
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
            </div>
          )}

          {/* Placeholder sections for other tabs */}
          {(activeSection === 'platforms' || activeSection === 'tone' || activeSection === 'voice' || 
            activeSection === 'workflow' || activeSection === 'safety' || activeSection === 'billing') && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground capitalize">{activeSection}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-sm">This feature is currently under development</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
