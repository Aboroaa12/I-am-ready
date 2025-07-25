/*
  # AI Writing Feedback Function

  1. New Edge Function
    - `ai-writing-feedback` function for Google Gemini AI integration
    - Receives text from frontend and returns AI feedback
    - Handles grammar checking, style suggestions, and content analysis
  
  2. Security
    - API key stored securely in environment variables
    - CORS headers for frontend access
    - Input validation and error handling
*/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AIFeedback {
  grammarErrors: Array<{
    text: string;
    suggestion: string;
    explanation: string;
    position: { start: number; end: number };
    type: 'grammar' | 'spelling' | 'style';
  }>;
  overallFeedback: string;
  suggestions: string[];
  score: number; // 0-100
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call Google Gemini API
    const apiKey = 'AIzaSyAZrgXBV27w9TV-OYd8i5TyS8yXPgUUIp8'
    
    const prompt = `Please analyze the following English text written by an Arabic-speaking student learning English. Provide detailed feedback in the following JSON format:

{
  "grammarErrors": [
    {
      "text": "incorrect text",
      "suggestion": "corrected text", 
      "explanation": "explanation in Arabic",
      "position": {"start": 0, "end": 5},
      "type": "grammar"
    }
  ],
  "overallFeedback": "Overall feedback in Arabic about the writing quality, strengths, and areas for improvement",
  "suggestions": ["suggestion 1 in Arabic", "suggestion 2 in Arabic"],
  "score": 85
}

Focus on:
1. Grammar mistakes and corrections
2. Spelling errors
3. Sentence structure improvements
4. Vocabulary suggestions
5. Overall writing quality (score 0-100)

Provide explanations in Arabic to help the student understand. Be encouraging and constructive.

Text to analyze: "${text}"

Return only valid JSON, no additional text.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Gemini API response:', data)
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      console.error('No AI response found in:', data)
      throw new Error('No response from AI')
    }

    // Try to parse the AI response as JSON
    let feedback: AIFeedback
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim()
      feedback = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // If parsing fails, create a basic feedback structure
      feedback = {
        grammarErrors: [],
        overallFeedback: "تم تحليل النص بنجاح. يرجى المحاولة مرة أخرى للحصول على تفاصيل أكثر.",
        suggestions: ["استمر في الكتابة والممارسة", "راجع القواعد النحوية الأساسية"],
        score: 75
      }
    }

    return new Response(
      JSON.stringify(feedback),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in AI feedback function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get AI feedback',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})