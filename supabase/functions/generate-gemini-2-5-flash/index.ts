
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Function invoked. Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Request body:`, JSON.stringify(requestBody, null, 2));
    
    const { originalPost, platform, tone, maxLength } = requestBody;

    if (!originalPost || !platform || !tone || !maxLength) {
      console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Missing required fields`);
      return new Response(
        JSON.stringify({ error: 'Missing required fields: originalPost, platform, tone, maxLength' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: GOOGLE_GEMINI_API_KEY not found`);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable - API key not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are an expert social media comment writer. Generate 3 high-quality, human-like comments for this post: "${originalPost}". Platform: ${platform}, Tone: ${tone}, Max length: ${maxLength} characters. Make each comment unique and valuable. Separate with "---".`;

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
    console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Calling Gemini API endpoint: ${geminiEndpoint.split('?')[0]}`);

    const geminiResponse = await fetch(geminiEndpoint, {
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

    console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Gemini API response status: ${geminiResponse.status}`);

    const geminiResponseText = await geminiResponse.text();
    console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Gemini API response body: ${geminiResponseText}`);

    if (!geminiResponse.ok) {
      console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Gemini API error. Status: ${geminiResponse.status}`);
      return new Response(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable',
          details: `Gemini API returned ${geminiResponse.status}`,
          provider_status: geminiResponse.status
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let geminiData;
    try {
      geminiData = JSON.parse(geminiResponseText);
    } catch (e) {
      console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Failed to parse Gemini response as JSON: ${e.message}`);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: No generated text in response`);
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

    console.log(`[${new Date().toISOString()}] generate-gemini-2-5-flash: Successfully generated ${comments.length} comments`);

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
    console.error(`[${new Date().toISOString()}] generate-gemini-2-5-flash: ERROR CAUGHT: ${error.message}, Stack: ${error.stack}`);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
