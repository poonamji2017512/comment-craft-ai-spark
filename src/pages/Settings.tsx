
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { isDark, setTheme } = useTheme();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || '',
    email: user?.email || '',
  });
  const [preferences, setPreferences] = useState({
    default_platform: 'twitter',
    default_tone: 'friendly',
    auto_save_comments: true,
    email_notifications: false,
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || user?.email || '',
      });
    }
  }, [userProfile, user]);

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

  const handleResetSettings = () => {
    setPreferences({
      default_platform: 'twitter',
      default_tone: 'friendly',
      auto_save_comments: true,
      email_notifications: false,
    });
    toast.success('Settings reset to defaults');
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('generated_comments')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing history:', error);
        toast.error('Failed to clear comment history');
        return;
      }

      toast.success('Comment history cleared successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while clearing history');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        {userProfile && (
          <Badge variant="secondary">
            Daily Comments: {userProfile.daily_prompt_count || 0}/20
          </Badge>
        )}
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
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
      )}

      {/* Comment Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-platform">Default Platform</Label>
            <select
              id="default-platform"
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={preferences.default_platform}
              onChange={(e) => setPreferences(prev => ({ ...prev, default_platform: e.target.value }))}
            >
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="reddit">Reddit</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-tone">Default Tone</Label>
            <select
              id="default-tone"
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              value={preferences.default_tone}
              onChange={(e) => setPreferences(prev => ({ ...prev, default_tone: e.target.value }))}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="thoughtful">Thoughtful</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Auto-save Comments</Label>
            <Switch
              id="auto-save"
              checked={preferences.auto_save_comments}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, auto_save_comments: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email_notifications: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Reset Settings</h4>
            <p className="text-sm text-muted-foreground">
              Reset all preferences to default values
            </p>
            <Button variant="outline" onClick={handleResetSettings} className="w-full">
              Reset to Default Settings
            </Button>
          </div>
          {user && (
            <div className="space-y-2">
              <h4 className="font-medium text-destructive">Clear Comment History</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all your saved comments. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleClearHistory} className="w-full">
                Clear All Comment History
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Member since:</span>
              <span className="text-sm">{new Date(userProfile.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last login:</span>
              <span className="text-sm">
                {userProfile.last_login ? new Date(userProfile.last_login).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Daily comments used:</span>
              <span className="text-sm">{userProfile.daily_prompt_count || 0} / 20</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
