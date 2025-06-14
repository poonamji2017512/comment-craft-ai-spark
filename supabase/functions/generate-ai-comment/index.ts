import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  originalPost: string;
  platform: string;
  tone: string;
  maxLength?: number;
}

// Input validation and sanitization
const validateInput = (body: RequestBody): { isValid: boolean; error?: string; sanitized?: RequestBody } => {
  if (!body.originalPost || typeof body.originalPost !== 'string') {
    return { isValid: false, error: 'Original post is required and must be text' };
  }
  
  if (body.originalPost.length > 10000) {
    return { isValid: false, error: 'Original post is too long' };
  }
  
  const allowedPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'reddit', 'youtube'];
  if (!allowedPlatforms.includes(body.platform)) {
    return { isValid: false, error: 'Invalid platform specified' };
  }
  
  const allowedTones = ['friendly', 'professional', 'casual', 'enthusiastic', 'thoughtful', 'humorous', 'gen-z', 'thanks'];
  if (!allowedTones.includes(body.tone)) {
    return { isValid: false, error: 'Invalid tone specified' };
  }
  
  // Sanitize input - remove potential HTML/script tags
  const sanitizedPost = body.originalPost
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
  
  return {
    isValid: true,
    sanitized: {
      ...body,
      originalPost: sanitizedPost,
      maxLength: Math.min(Math.max(body.maxLength || 280, 50), 10000)
    }
  };
};

// Sanitize error messages to prevent information leakage
const sanitizeErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]'); // Remove IP addresses
  }
  if (error instanceof Error) {
    return error.message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]');
  }
  return 'An unexpected error occurred';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: RequestBody = await req.json();
    
    // Validate and sanitize input
    const validation = validateInput(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { originalPost, platform, tone, maxLength } = validation.sanitized!;

    // Get the API key from environment
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create platform-specific guidelines
    const platformGuidelines: Record<string, string> = {
      twitter: `Keep it under ${maxLength} characters. Use casual language, hashtags sparingly, and make it engaging for quick consumption.`,
      linkedin: `Professional tone with thoughtful insights. Can be longer and more detailed. Focus on adding value to professional discussions.`,
      instagram: `Visual-focused, use emojis appropriately, casual but engaging. Consider the visual nature of the platform.`,
      facebook: `Conversational and personal. Can include questions to encourage engagement. Moderate length.`,
      reddit: `Be authentic and add genuine value. Match the community tone. Can be detailed if it adds insight.`,
      youtube: `Engaging and supportive. Can ask questions or share related experiences. Moderate to long length okay.`
    };

    // Create tone-specific instructions
    const toneInstructions: Record<string, string> = {
      friendly: "Use warm, approachable language. Be supportive and positive. Use casual expressions but remain respectful.",
      professional: "Maintain a business-appropriate tone. Be respectful, thoughtful, and add professional value to the conversation.",
      casual: "Use relaxed, everyday language. Be conversational and natural, like talking to a friend.",
      enthusiastic: "Show genuine excitement and energy. Use positive language and express interest in the topic.",
      thoughtful: "Provide deep, reflective insights. Ask meaningful questions and show genuine consideration of the topic.",
      humorous: "Add light humor where appropriate, but ensure it's tasteful and relevant. Don't force jokes.",
      'gen-z': "Use modern slang and expressions. Be authentic, relatable, and use current internet language. Keep it real and engaging with Gen-Z vibes.",
      'thanks': "Express genuine gratitude and appreciation. Use thankful language, acknowledge the value of the post, and show sincere appreciation for the content or message shared."
    };

    const prompt = `You are an expert social media comment writer. Your task is to generate 3 high-quality, human-like comments in response to the following post.

ORIGINAL POST:
"${originalPost}"

PLATFORM: ${platform}
TONE: ${tone}
MAX LENGTH: ${maxLength} characters

PLATFORM GUIDELINES: ${platformGuidelines[platform] || platformGuidelines.twitter}

TONE INSTRUCTIONS: ${toneInstructions[tone] || toneInstructions.friendly}

IMPORTANT RULES:
1. Write like a real human, not an AI. Use natural language patterns, occasional typos are okay.
2. Each comment should be unique and approach the topic from different angles.
3. Make comments that add genuine value - ask questions, share insights, or provide support.
4. Avoid overly promotional or sales-y language.
5. Use contractions and casual expressions naturally.
6. Don't start every comment the same way.
7. Be authentic and relatable.
8. Stay within the character limit for each comment.

Generate exactly 3 different comments, separated by "---". Do not include any other text, explanations, or formatting.`;

    // Call Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error - status:', geminiResponse.status);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: 'Unable to generate comments at this time' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Split and sanitize generated comments
    const comments = generatedText
      .split('---')
      .map((comment: string) => {
        const sanitized = comment
          .trim()
          .replace(/<[^>]*>/g, '') // Remove any HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, ''); // Remove event handlers
        return sanitized;
      })
      .filter((comment: string) => comment.length > 0)
      .slice(0, 3); // Ensure we only take 3 comments

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader!,
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Store the generated comments in the database
      const commentsToStore = comments.map((comment: string) => ({
        user_id: user.id,
        original_post: originalPost,
        platform,
        tone,
        generated_text: comment,
        character_count: comment.length
      }));

      const { error: dbError } = await supabase
        .from('generated_comments')
        .insert(commentsToStore);

      if (dbError) {
        console.error('Database storage error');
        // Don't fail the request if database storage fails
      }
    }

    return new Response(
      JSON.stringify({ 
        comments: comments.map((comment: string, index: number) => ({
          id: index + 1,
          text: comment,
          platform,
          length: comment.length
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-ai-comment function');
    return new Response(
      JSON.stringify({ error: sanitizeErrorMessage(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
