
import React, { useState } from 'react';
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
    dailyTarget: 10
  });

  const maxSteps = 3;

  const stepIcons = {
    1: '🤖',
    2: '🎯', 
    3: '⚡'
  };

  const phraseExamples = ['Absolutely agree!', 'Love this perspective', 'Great insight'];

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user settings already exist
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Prepare onboarding data with proper JSON structure
      const onboardingData = {
        frequent_phrases: formData.phrases,
        brand_ctas: formData.ctas,
        always_say: formData.alwaysSay,
        never_say: formData.neverSay
      };

      if (existingSettings) {
        // Update existing settings
        const { error: settingsError } = await supabase
          .from('user_settings')
          .update({
            daily_comment_target: formData.dailyTarget,
            onboarding_data: onboardingData as any
          })
          .eq('user_id', user.id);

        if (settingsError) {
          console.error('Error updating settings:', settingsError);
          toast.error('Failed to save settings');
          return;
        }
      } else {
        // Create new settings
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
          } as any,
          ai_features: {
            auto_summarization: true,
            action_item_detection: true,
            topic_extraction: true
          } as any,
          onboarding_data: onboardingData as any
        };

        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert(settingsData);

        if (settingsError) {
          console.error('Error saving settings:', settingsError);
          toast.error('Failed to save settings');
          return;
        }
      }

      // Update user profile with description
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          introduction: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Don't fail the whole process if profile update fails
        console.warn('Profile update failed, but continuing...');
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

  const handlePhraseTagClick = (phrase: string) => {
    setFormData(prev => ({ ...prev, phrases: phrase }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step active">
            <h1 className="title">Welcome! Let's Set Up Your Interact Agent</h1>
            <p className="subtitle">First, give your AI some context. This helps it understand who it's commenting as.</p>
            
            <div className="form-group">
              <label className="form-label">Describe yourself (used for AI context)</label>
              <p className="form-description">Tell the AI about your expertise, interests, and style.</p>
              <textarea 
                className="input-field" 
                rows={4} 
                placeholder="e.g. I am a marketing expert focused on B2B SaaS growth..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step active">
            <h1 className="title">Define Your AI's Brand Voice</h1>
            <p className="subtitle">Teach the AI how you want it to sound. The more detail you provide, the more authentic it will be.</p>
            
            <div className="form-group">
              <label className="form-label">Frequently Used Phrases</label>
              <p className="form-description">Enter common phrases you use in conversations.</p>
              <input 
                type="text" 
                className="input-field" 
                placeholder="That's a great point! Couldn't agree more"
                value={formData.phrases}
                onChange={(e) => updateFormData('phrases', e.target.value)}
              />
              <div className="phrase-examples">
                {phraseExamples.map((phrase, index) => (
                  <span 
                    key={index}
                    className="phrase-tag"
                    onClick={() => handlePhraseTagClick(phrase)}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brand CTAs and Catchphrases</label>
              <p className="form-description">Include your signature calls-to-action.</p>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Check out the link in my bio!"
                value={formData.ctas}
                onChange={(e) => updateFormData('ctas', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Always Say</label>
              <p className="form-description">Phrases you want to include in most comments.</p>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Keep up the great work!"
                value={formData.alwaysSay}
                onChange={(e) => updateFormData('alwaysSay', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Never Say</label>
              <p className="form-description">Words or phrases to avoid completely.</p>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Literally, Epic fail"
                value={formData.neverSay}
                onChange={(e) => updateFormData('neverSay', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step active">
            <h1 className="title">Configure Your Workflow</h1>
            <p className="subtitle">How active do you want your AI to be? You can always change this later.</p>
            
            <div className="form-group">
              <label className="form-label">Daily Comment Target</label>
              <p className="form-description">Set a daily goal for comment generation (1-100). We'll track your progress.</p>
              <div className="daily-target">
                <input 
                  type="number" 
                  value={formData.dailyTarget} 
                  min="1" 
                  max="100"
                  onChange={(e) => updateFormData('dailyTarget', parseInt(e.target.value) || 10)}
                />
                <span>comments per day</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .onboarding-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          background: #191A1A;
          color: #ffffff;
          overflow: hidden;
          height: 100vh;
          padding: 10px;
        }

        .container {
          display: flex;
          height: calc(100vh - 20px);
          gap: 10px;
        }

        .left-panel {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 10px;
        }

        .right-panel {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          position: absolute;
          top: 40px;
          left: 40px;
          font-size: 18px;
          font-weight: 600;
          color: #20d4aa;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #20d4aa, #2563eb);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          color: white;
        }

        .step-indicator {
          position: absolute;
          top: 40px;
          right: 40px;
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
        }

        .content {
          max-width: 500px;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff, #e5e7eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 16px;
          color: #9ca3af;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 32px;
        }

        .form-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .form-description {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .input-field {
          width: 100%;
          padding: 16px 20px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-size: 15px;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          resize: vertical;
          min-height: 60px;
        }

        .input-field:focus {
          outline: none;
          border-color: #20d4aa;
          box-shadow: 0 0 0 3px rgba(32, 212, 170, 0.1);
          background: rgba(30, 41, 59, 0.9);
        }

        .input-field::placeholder {
          color: #64748b;
        }

        .phrase-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .phrase-tag {
          padding: 8px 14px;
          background: rgba(32, 212, 170, 0.1);
          border: 1px solid rgba(32, 212, 170, 0.2);
          border-radius: 20px;
          font-size: 13px;
          color: #20d4aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .phrase-tag:hover {
          background: rgba(32, 212, 170, 0.2);
          transform: translateY(-1px);
        }

        .daily-target {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(30, 41, 59, 0.6);
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .daily-target input {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
          width: 60px;
          text-align: center;
        }

        .daily-target input:focus {
          outline: none;
        }

        .buttons {
          display: flex;
          gap: 16px;
          margin-top: 40px;
        }

        .btn {
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #20d4aa, #2563eb);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(32, 212, 170, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: rgba(148, 163, 184, 0.1);
          color: #9ca3af;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(148, 163, 184, 0.2);
          color: #ffffff;
        }

        .skip-link {
          position: absolute;
          bottom: 40px;
          left: 40px;
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .skip-link:hover {
          color: #20d4aa;
        }

        .progress-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.3);
          transition: all 0.2s ease;
        }

        .dot.active {
          background: #20d4aa;
        }

        .agent-icon {
          width: 120px;
          height: 120px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .agent-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          animation: float 6s ease-in-out infinite;
        }

        .floating-circle:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 20%;
          right: 20%;
          animation-delay: 0s;
        }

        .floating-circle:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-circle:nth-child(3) {
          width: 80px;
          height: 80px;
          top: 40%;
          left: 10%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <div className="onboarding-container">
        <div className="container">
          <div className="left-panel">
            <div className="logo">
              <div className="logo-icon">AI</div>
              Interact Agent
            </div>
            
            <div className="step-indicator">
              Step {currentStep} of {maxSteps}
            </div>

            <div className="content">
              {renderStepContent()}

              <div className="buttons">
                {currentStep > 1 && (
                  <button className="btn btn-secondary" onClick={handlePrevious}>
                    ← Previous
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleSkip}>
                  Skip
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : currentStep === maxSteps ? 'Complete Setup' : 'Continue'}
                </button>
              </div>
            </div>

            <div className="skip-link" onClick={handleSkip}>
              Skip for now
            </div>
            
            <div className="progress-dots">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`dot ${step <= currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="right-panel">
            <div className="floating-circle"></div>
            <div className="floating-circle"></div>
            <div className="floating-circle"></div>
            
            <div className="agent-icon">
              {stepIcons[currentStep as keyof typeof stepIcons]}
            </div>
            <div className="agent-label">AI Comment Agent</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
