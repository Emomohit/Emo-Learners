// AI Study Assistant — uses the Lovable AI Gateway (free during preview).
// Requires LOVABLE_API_KEY (auto-provided by Lovable Cloud).
//
// Body: { messages: { role: "user"|"assistant"|"system", content: string }[] }
// Returns: { reply: string }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SYSTEM_PROMPT = `You are EMO Learners' AI Study Assistant — a friendly, sharp tutor for Indian B.Tech students in CSE, CSE-IT, CSE-CY, and AIML.

Rules:
- Be concise and concrete. Prefer bullet points and small examples.
- For code, use fenced blocks and explain the key line.
- For exam-style questions, give a structured answer (definition → key points → example → 1-line summary).
- If the user asks something off-topic, gently steer back to studies.
- Never claim to be ChatGPT/Claude; you are EMO Learners AI.`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return json({ error: "messages[] required" }, 400);
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY missing" }, 500);

    const safe = messages
      .slice(-20)
      .filter((m: any) => m && typeof m.content === "string")
      .map((m: any) => ({
        role: m.role === "assistant" || m.role === "system" ? m.role : "user",
        content: String(m.content).slice(0, 4000),
      }));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safe],
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      if (res.status === 429) return json({ error: "Too many requests. Try again in a minute." }, 429);
      if (res.status === 402) return json({ error: "AI credits exhausted. Please contact admin." }, 402);
      return json({ error: "AI provider error" }, 502);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return json({ reply });
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
