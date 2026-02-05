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
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { difficulty = "normal" } = await req.json();

    const systemPrompt = `You are an expert educational content creator for Grade 3 reading comprehension. Generate original, engaging passages with questions similar to Spectrum Reading workbooks.

Return ONLY valid JSON with this exact structure:
{
  "passage_title": "string",
  "passage_text": "string (120-220 words, grade 3 reading level)",
  "passage_type": "fiction" or "nonfiction",
  "primary_skill_category": "A", "B", "C", or "D",
  "reading_level": "grade3",
  "questions": [
    {
      "order_index": 0,
      "question_type": "mcq_main_idea",
      "prompt": "What is the main idea of this passage?",
      "choices": ["option1", "option2", "option3", "option4"],
      "correct_answer": "exact match of correct choice",
      "explanation": "1-2 sentence explanation",
      "hint": null,
      "evidence_spans": [{"start": 0, "end": 50}]
    },
    {
      "order_index": 1,
      "question_type": "mcq_detail",
      "prompt": "question about key details",
      "choices": ["option1", "option2", "option3", "option4"],
      "correct_answer": "exact match",
      "explanation": "explanation",
      "hint": null,
      "evidence_spans": [{"start": 100, "end": 150}]
    },
    {
      "order_index": 2,
      "question_type": "short_answer",
      "prompt": "inference or cause-effect question",
      "choices": null,
      "correct_answer": "sample correct answer",
      "explanation": "explanation",
      "hint": "helpful hint for child",
      "evidence_spans": [{"start": 50, "end": 100}]
    },
    {
      "order_index": 3,
      "question_type": "mcq_vocab",
      "prompt": "What does '[word from passage]' mean?",
      "choices": ["option1", "option2", "option3", "option4"],
      "correct_answer": "exact match",
      "explanation": "explanation",
      "hint": null,
      "evidence_spans": [{"start": 20, "end": 40}]
    }
  ]
}

Skill categories: A=Fiction/Nonfiction passages, B=Main Idea/Structure, C=Key Details, D=Knowledge Integration

${difficulty === "easy" ? "Use simpler vocabulary and shorter sentences. Make clues more direct." : ""}
${difficulty === "hard" ? "Include mild inference questions and slightly richer vocabulary." : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate a new original reading passage with 4 questions. Return only the JSON." }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Invalid AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const passage = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(passage), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate passage" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
