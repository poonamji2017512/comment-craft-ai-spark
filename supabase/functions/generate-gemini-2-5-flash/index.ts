
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { originalPost, platform, tone, maxLength } = requestBody;

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are an expert social media comment writer. Generate 3 high-quality, human-like comments for this post: "${originalPost}". Platform: ${platform}, Tone: ${tone}, Max length: ${maxLength} characters. Make each comment unique and valuable. Separate with "---".`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
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

    const comments = generatedText
      .split('---')
      .map((comment: string) => comment.trim())
      .filter((comment: string) => comment.length > 0)
      .slice(0, 3);

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
    console.error('Error in gemini-2-5-flash function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
