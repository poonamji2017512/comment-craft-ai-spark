
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingData {
  description: string;
  phrases: string;
  ctas: string;
  alwaysSay: string;
  neverSay: string;
  dailyTarget: number;
  boundaries: string;
  guidelines: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<OnboardingData>({
    description: '',
    phrases: '',
    ctas: '',
    alwaysSay: '',
    neverSay: '',
    dailyTarget: 10,
    boundaries: '',
    guidelines: ''
  });

  const totalSteps = 4;

  const stepVisuals = {
    1: '🤖',
    2: '🎯', 
    3: '⚡',
    4: '🛡️',
    5: '✨'
  };

  const handleNext = () => {
    if (currentStep <= totalSteps) {
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
        },
        // Store onboarding data in settings
        onboarding_data: {
          frequent_phrases: formData.phrases,
          brand_ctas: formData.ctas,
          always_say: formData.alwaysSay,
          never_say: formData.neverSay,
          content_boundaries: formData.boundaries,
          additional_guidelines: formData.guidelines
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

      // Update user profile with description
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          introduction: formData.description,
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
          <div className="step-content">
            <h1 className="text-2xl font-semibold mb-2 text-white">Welcome! Let's Set Up Your Interact Agent</h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              First, give your AI some context. This helps it understand who it's commenting as.
            </p>
            
            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Describe yourself (used for AI context)
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Tell the AI about your expertise, interests, and style.
              </div>
              <Textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="e.g., I am a marketing expert focused on B2B SaaS growth..."
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm resize-vertical min-h-[80px] focus:border-gray-600 focus:bg-gray-800"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h1 className="text-2xl font-semibold mb-2 text-white">Define Your AI's Brand Voice</h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Teach the AI how you want it to sound. The more detail you provide, the more authentic it will be.
            </p>
            
            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Frequently Used Phrases
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Enter common phrases you use in conversations.
              </div>
              <Input
                value={formData.phrases}
                onChange={(e) => updateFormData('phrases', e.target.value)}
                placeholder="That's a great point!, Couldn't agree more"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm focus:border-gray-600 focus:bg-gray-800"
              />
            </div>

            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Brand CTAs and Catchphrases
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Include your signature calls-to-action.
              </div>
              <Input
                value={formData.ctas}
                onChange={(e) => updateFormData('ctas', e.target.value)}
                placeholder="Check out the link in my bio!"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm focus:border-gray-600 focus:bg-gray-800"
              />
            </div>

            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Always Say
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Phrases you want included in most comments.
              </div>
              <Input
                value={formData.alwaysSay}
                onChange={(e) => updateFormData('alwaysSay', e.target.value)}
                placeholder="Keep up the great work!"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm focus:border-gray-600 focus:bg-gray-800"
              />
            </div>

            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Never Say
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Words or phrases to avoid completely.
              </div>
              <Input
                value={formData.neverSay}
                onChange={(e) => updateFormData('neverSay', e.target.value)}
                placeholder="Literally, Epic fail"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm focus:border-gray-600 focus:bg-gray-800"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h1 className="text-2xl font-semibold mb-2 text-white">Configure Your Workflow</h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              How active do you want your AI to be? You can always change this later.
            </p>
            
            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Daily Comment Target
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Set a daily goal for comment generation (1-1000). We'll track your progress!
              </div>
              <div className="inline-block w-25">
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.dailyTarget}
                  onChange={(e) => updateFormData('dailyTarget', parseInt(e.target.value) || 10)}
                  className="w-24 p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm text-center focus:border-gray-600 focus:bg-gray-800"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h1 className="text-2xl font-semibold mb-2 text-white">Set Your Safety & Guardrails</h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Define boundaries to keep your AI interactions safe and on-brand.
            </p>
            
            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Content Boundaries
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Topics your AI should avoid commenting on.
              </div>
              <Textarea
                value={formData.boundaries}
                onChange={(e) => updateFormData('boundaries', e.target.value)}
                placeholder="e.g., Political discussions, controversial topics"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm resize-vertical min-h-[80px] focus:border-gray-600 focus:bg-gray-800"
              />
            </div>

            <div className="form-group mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Additional Guidelines
              </label>
              <div className="text-xs text-gray-500 mb-2 leading-tight">
                Any other rules for your AI's behavior.
              </div>
              <Textarea
                value={formData.guidelines}
                onChange={(e) => updateFormData('guidelines', e.target.value)}
                placeholder="e.g., Always be supportive, avoid arguments"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-900 text-white text-sm resize-vertical min-h-[80px] focus:border-gray-600 focus:bg-gray-800"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content text-center py-5">
            <h2 className="text-xl mb-2 text-white">You're All Set!</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your AI is configured and ready to go. You can change any of these settings later from your Settings page.
            </p>
            <Button 
              onClick={handleFinish}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-100 transition-all"
            >
              {isLoading ? 'Setting up...' : 'Go to Dashboard'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDots = () => {
    return (
      <div className="flex justify-center gap-2 mt-6">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              step === currentStep && currentStep <= totalSteps
                ? 'bg-white'
                : step < currentStep
                ? 'bg-gray-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  if (currentStep > totalSteps) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <div className="w-1/2 bg-black flex flex-col p-10 relative">
          <div className="flex items-center gap-2 mb-15">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs text-black font-bold">
              AI
            </div>
            <span className="text-base font-semibold">Interact Agent</span>
          </div>

          <div className="absolute top-10 right-10 text-xs text-gray-500">
            Complete
          </div>

          <div className="max-w-80 w-full mx-auto flex-1 flex flex-col justify-center">
            {renderStepContent()}
          </div>
        </div>

        <div className="w-1/2 bg-gray-600 flex items-center justify-center">
          <div className="text-8xl opacity-30">✨</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-1/2 bg-black flex flex-col p-10 relative">
        <div className="flex items-center gap-2 mb-15">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs text-black font-bold">
            AI
          </div>
          <span className="text-base font-semibold">Interact Agent</span>
        </div>

        <div className="absolute top-10 right-10 text-xs text-gray-500">
          {currentStep <= totalSteps ? `Step ${currentStep} of ${totalSteps}` : 'Complete'}
        </div>

        <div className="max-w-80 w-full mx-auto flex-1 flex flex-col justify-center">
          {renderStepContent()}

          {currentStep <= totalSteps && (
            <div className="flex justify-between items-center mt-8 gap-3">
              <button
                onClick={handlePrevious}
                className={`flex-1 py-2 px-4 border border-gray-700 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-all ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                ← Previous
              </button>
              
              <button
                onClick={currentStep === totalSteps ? handleFinish : handleNext}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                {isLoading ? 'Saving...' : currentStep === totalSteps ? 'Finish Setup' : 'Continue'}
              </button>
            </div>
          )}

          {renderDots()}
        </div>
      </div>

      <div className="w-1/2 bg-gray-600 flex items-center justify-center">
        <div className="text-8xl opacity-30">
          {stepVisuals[currentStep] || '✨'}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
