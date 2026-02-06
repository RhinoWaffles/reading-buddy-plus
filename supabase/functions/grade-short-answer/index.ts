import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Fallback to simple keyword matching if AI not configured
      const { childAnswer, correctAnswer } = await req.json();
      const childWords = childAnswer.toLowerCase().split(/\s+/);
      const correctWords = correctAnswer.toLowerCase().split(/\s+/);
      const keyWords = correctWords.filter((w: string) => w.length > 3);
      const matchCount = keyWords.filter((w: string) => childWords.some((cw: string) => cw.includes(w) || w.includes(cw))).length;
      const isCorrect = matchCount >= Math.ceil(keyWords.length * 0.5);
      
      return new Response(JSON.stringify({ is_correct: isCorrect }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { childAnswer, correctAnswer, question } = await req.json();

    const systemPrompt = `You are grading a Grade 3 student's short-answer reading comprehension response.

GRADING RULES - Mark as CORRECT if the student's answer:
- Contains the correct main idea or key concept
- Shows understanding of the passage, even if phrased differently
- Is incomplete but captures the essential point
- Has grammar, spelling, or capitalization errors but the idea is right
- Leaves out words like "because" or other transitions
- Is not a full sentence but conveys the right meaning

Mark as INCORRECT only if:
- The answer is factually wrong
- The answer shows misunderstanding of the question
- The answer is completely off-topic or nonsensical

Return ONLY valid JSON: {"is_correct": true} or {"is_correct": false}`;

    const userPrompt = `Question: ${question}

Model Answer (the ideal complete response): ${correctAnswer}

Student's Answer: ${childAnswer}

Is the student's answer correct based on meaning, not exact wording?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      // Fallback to lenient matching
      const childLower = childAnswer.toLowerCase();
      const correctLower = correctAnswer.toLowerCase();
      const keywords = correctLower.split(/\s+/).filter((w: string) => w.length > 3);
      const matches = keywords.filter((w: string) => childLower.includes(w)).length;
      const isCorrect = matches >= Math.ceil(keywords.length * 0.4);
      
      return new Response(JSON.stringify({ is_correct: isCorrect }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ is_correct: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ is_correct: result.is_correct === true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ is_correct: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
