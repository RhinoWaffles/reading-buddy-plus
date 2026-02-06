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
    const { childAnswer, correctAnswer, question } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      // Fallback to simple keyword matching if AI not configured
      const childWords = childAnswer.toLowerCase().split(/\s+/);
      const correctWords = correctAnswer.toLowerCase().split(/\s+/);
      const keyWords = correctWords.filter((w: string) => w.length > 3);
      const matchCount = keyWords.filter((w: string) => childWords.some((cw: string) => cw.includes(w) || w.includes(cw))).length;
      const ratio = matchCount / Math.max(keyWords.length, 1);
      
      let grade = "incorrect";
      if (ratio >= 0.7) grade = "full";
      else if (ratio >= 0.4) grade = "partial";
      
      return new Response(JSON.stringify({ 
        grade,
        is_correct: grade !== "incorrect",
        is_partial: grade === "partial"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are grading a Grade 3 student's short-answer reading comprehension response.

GRADING RULES:
Return "full" if the student's answer:
- Contains the correct main idea or key concept
- Shows clear understanding, even if phrased differently
- Has grammar, spelling, or capitalization errors but the idea is right

Return "partial" if the student's answer:
- Shows some understanding but is incomplete
- Mentions relevant details but misses the main point
- Is on the right track but needs more explanation
- Has the right idea but is too vague

Return "incorrect" only if:
- The answer is factually wrong
- The answer shows misunderstanding of the question
- The answer is completely off-topic or nonsensical

Return ONLY valid JSON: {"grade": "full"} or {"grade": "partial"} or {"grade": "incorrect"}`;

    const userPrompt = `Question: ${question}

Model Answer (the ideal complete response): ${correctAnswer}

Student's Answer: ${childAnswer}

Grade the student's answer as "full", "partial", or "incorrect" based on meaning.`;

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
      const ratio = matches / Math.max(keywords.length, 1);
      
      let grade = "incorrect";
      if (ratio >= 0.6) grade = "full";
      else if (ratio >= 0.3) grade = "partial";
      
      return new Response(JSON.stringify({ 
        grade,
        is_correct: grade !== "incorrect",
        is_partial: grade === "partial"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ grade: "incorrect", is_correct: false, is_partial: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(jsonMatch[0]);
    const grade = result.grade || "incorrect";

    return new Response(JSON.stringify({ 
      grade,
      is_correct: grade !== "incorrect",
      is_partial: grade === "partial"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ grade: "incorrect", is_correct: false, is_partial: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
