
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Check, User, MessageSquare, Target, Shield } from 'lucide-react';

interface OnboardingData {
  introduction: string;
  frequentPhrases: string;
  brandCtas: string;
  alwaysSay: string;
  neverSay: string;
  dailyTarget: number;
  avoidPolitics: boolean;
  avoidReligion: boolean;
  avoidTragedies: boolean;
  avoidNsfw: boolean;
  bannedKeywords: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<OnboardingData>({
    introduction: '',
    frequentPhrases: '',
    brandCtas: '',
    alwaysSay: '',
    neverSay: '',
    dailyTarget: 20,
    avoidPolitics: true,
    avoidReligion: true,
    avoidTragedies: true,
    avoidNsfw: true,
    bannedKeywords: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setIsLoading(true);
    try {
      // Save user settings
      const settingsData = {
        user_id: user.id,
        theme: 'dark',
        language: 'en',
        summary_length: 'medium',
        ai_tone: 'friendly',
        ai_model: 'gemini-2.5-pro',
        dashboard_view: 'recent',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        use_custom_api_key: false,
        custom_api_key: '',
        daily_comment_target: formData.dailyTarget,
        notification_prefs: {
          email_notifications: false,
          meeting_processed: true,
          summary_ready: true,
          task_due: true,
          frequency: 'real-time'
        },
        ai_features: {
          auto_summarization: true,
          action_item_detection: true,
          topic_extraction: true
        }
      };

      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert(settingsData);

      if (settingsError) {
        console.error('Error saving settings:', settingsError);
        toast.error('Failed to save settings');
        return;
      }

      // Update user profile with introduction
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          introduction: formData.introduction,
          preferred_tone: 'friendly',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Onboarding completed! Welcome to AI Comment Agent!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome! Let's Set Up Your Interact Agent</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                First, give your AI some context. This helps it understand who it's commenting as.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Describe yourself (used for AI context)</Label>
                <Textarea
                  placeholder="e.g., I am a marketing expert focused on B2B SaaS growth. or I am a casual gaming streamer who loves retro RPGs and engages with my community."
                  value={formData.introduction}
                  onChange={(e) => updateFormData('introduction', e.target.value)}
                  className="min-h-[120px] bg-background border-border text-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  The more context you provide, the better your AI will understand your perspective and expertise.
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Define Your AI's Brand Voice</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Teach the AI how you want it to sound. The more detail you provide, the more authentic it will be.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Frequently Used Phrases</Label>
                <Textarea
                  placeholder="Enter common phrases you use, like That's a great point! or Couldn't agree more."
                  value={formData.frequentPhrases}
                  onChange={(e) => updateFormData('frequentPhrases', e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Brand CTAs and Catchphrases</Label>
                <Textarea
                  placeholder="e.g., Check out the link in my bio! or Don't forget to smash that like button!"
                  value={formData.brandCtas}
                  onChange={(e) => updateFormData('brandCtas', e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Always Say</Label>
                  <Textarea
                    placeholder="Include phrases you want in most comments, like Keep up the great work!"
                    value={formData.alwaysSay}
                    onChange={(e) => updateFormData('alwaysSay', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Never Say</Label>
                  <Textarea
                    placeholder="List words or phrases to avoid, like Literally or slang you dislike."
                    value={formData.neverSay}
                    onChange={(e) => updateFormData('neverSay', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Configure Your Workflow</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                How active do you want your AI to be? You can always change this later.
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Daily Comment Target</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.dailyTarget}
                    onChange={(e) => updateFormData('dailyTarget', parseInt(e.target.value) || 20)}
                    className="bg-background border-border text-foreground w-32"
                  />
                  <span className="text-muted-foreground">comments per day</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set a daily goal for comment generation (1-1000). We'll track your progress and send you milestone notifications!
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">What to expect:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Progress tracking with motivational milestones</li>
                  <li>• Notifications at 25%, 50%, 75%, and 100% completion</li>
                  <li>• Analytics to help you understand your activity patterns</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Set Your Safety Rules</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Configure guardrails to ensure your AI comments appropriately and avoids sensitive topics.
              </p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Never Comment On:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="politics"
                      checked={formData.avoidPolitics}
                      onChange={(e) => updateFormData('avoidPolitics', e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="politics" className="text-foreground">Politics</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="religion"
                      checked={formData.avoidReligion}
                      onChange={(e) => updateFormData('avoidReligion', e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="religion" className="text-foreground">Religion</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tragedies"
                      checked={formData.avoidTragedies}
                      onChange={(e) => updateFormData('avoidTragedies', e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="tragedies" className="text-foreground">Personal Tragedies</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="nsfw"
                      checked={formData.avoidNsfw}
                      onChange={(e) => updateFormData('avoidNsfw', e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="nsfw" className="text-foreground">NSFW Content</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Additional Banned Keywords</Label>
                <Textarea
                  placeholder="Enter comma-separated keywords to avoid..."
                  value={formData.bannedKeywords}
                  onChange={(e) => updateFormData('bannedKeywords', e.target.value)}
                  className="bg-background border-border text-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  Add any specific words or phrases you want your AI to avoid using.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepImage = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <User className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Tell Us About You</h3>
              <p className="text-blue-100">Help your AI understand your expertise and perspective</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <MessageSquare className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Shape Your Voice</h3>
              <p className="text-green-100">Define how your AI should sound and communicate</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <Target className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Set Your Goals</h3>
              <p className="text-orange-100">Choose how active you want your AI to be</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <Shield className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Stay Safe</h3>
              <p className="text-purple-100">Configure guardrails for appropriate commenting</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentStep > totalSteps) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">You're All Set!</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Your AI is configured and ready to go. You can change any of these settings later from your Settings page.
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg" className="px-8">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Onboarding Content */}
          <div className="order-2 lg:order-1">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button
                      onClick={handleFinish}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? 'Saving...' : 'Finish Setup'}
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-square lg:aspect-[4/5] w-full">
              {renderStepImage()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
