// EMoIQ AI backend — actions: analyze, predict, plan, quiz
// Uses Lovable AI Gateway (google/gemini-2.5-flash) via LOVABLE_API_KEY.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI key missing" }, 500);

    const { action, payload } = await req.json();
    if (!action) return json({ error: "action required" }, 400);

    let system = "";
    let user = "";

    if (action === "analyze") {
      const { subject, text, years } = payload ?? {};
      if (!subject || !text) return json({ error: "subject and text required" }, 400);
      system = "You are EMoIQ, an exam-strategy AI. Analyze past-year exam paper text and output strict JSON only, no prose. Focus on Indian university curricula (RGPV Bhopal AICTE flexible curriculum by default).";
      user = `Subject: ${subject}\nYears covered (if known): ${years ?? "unknown"}\n\nPYQ TEXT:\n"""${String(text).slice(0, 60000)}"""\n\nReturn JSON with this exact shape:\n{\n  "summary": string,\n  "weightage": [{"unit": string, "percent": number, "priority": "HIGH"|"MEDIUM"|"LOW"}],\n  "topic_freq": [{"topic": string, "count": number, "unit": string}],\n  "year_trend": [{"year": string, "top_topics": string[]}]\n}\nRules: 5-6 units max. Percentages sum ~100. topic_freq top 15. year_trend one per year seen.`;
    } else if (action === "predict") {
      const { subject, analysis } = payload ?? {};
      if (!subject || !analysis) return json({ error: "subject and analysis required" }, 400);
      system = "You are EMoIQ. Predict exam questions from analyzed PYQ data. Output strict JSON only.";
      user = `Subject: ${subject}\nAnalysis JSON:\n${JSON.stringify(analysis).slice(0, 40000)}\n\nReturn JSON:\n{"questions":[{"question": string, "probability": number, "unit": string, "marks": number, "reason": string}]}\nRules: 10 questions, probability 0-100 realistic, sorted desc. Cover HIGH-weightage units more.`;
    } else if (action === "plan") {
      const { subject, weakTopics, daysLeft, mode, syllabus } = payload ?? {};
      if (!subject || !daysLeft) return json({ error: "subject and daysLeft required" }, 400);
      system = "You are EMoIQ, an exam study coach. Build a realistic day-by-day plan. Output strict JSON only.";
      user = `Subject: ${subject}\nDays left: ${daysLeft}\nMode: ${mode ?? "normal"} (crash = last 24 hours)\nWeak topics: ${(weakTopics ?? []).join(", ") || "none provided"}\nSyllabus hint: ${syllabus ?? "RGPV Bhopal AICTE flexible curriculum"}\n\nReturn JSON:\n{\n  "headline": string,\n  "strategy": string,\n  "days": [{"day": number, "focus": string, "topics": string[], "tasks": string[], "hours": number}],\n  "skip": string[]\n}\nRules: if mode=crash, produce 4 blocks instead of days, each with hours totaling 20-22 hours of work in 24h, prioritise weak topics + HIGH weightage.`;
    } else if (action === "quiz") {
      const { subject, topics } = payload ?? {};
      if (!subject) return json({ error: "subject required" }, 400);
      system = "You are EMoIQ. Generate a diagnostic MCQ quiz. Output strict JSON only.";
      user = `Subject: ${subject}\nTopics: ${(topics ?? []).join(", ") || "core topics"}\n\nReturn JSON:\n{"questions":[{"q": string, "options": string[4], "answer": number (0-3), "topic": string, "explain": string}]}\nRules: 10 questions, mix easy/medium/hard, options concise, cover topics evenly.`;
    } else if (action === "roadmap") {
      const { branch, semester, subjects, goal, hoursPerWeek, weeks } = payload ?? {};
      if (!branch || !semester) return json({ error: "branch and semester required" }, 400);
      system = "You are EMoIQ, a study roadmap planner for Indian engineering students. Output strict JSON only.";
      user = `Branch: ${branch}\nSemester: ${semester}\nSubjects: ${(subjects ?? []).join(", ") || "auto-pick core subjects for this branch+sem"}\nCareer goal: ${goal ?? "strong fundamentals + placement ready"}\nHours per week: ${hoursPerWeek ?? 12}\nWeeks: ${weeks ?? 12}\nSyllabus hint: RGPV Bhopal AICTE flexible curriculum.\n\nReturn JSON:\n{\n  "title": string,\n  "summary": string,\n  "milestones": [{"week": number, "theme": string, "subjects": string[], "topics": string[], "outcomes": string[], "resources": string[]}],\n  "skills": [{"name": string, "why": string}],\n  "projects": [{"name": string, "brief": string, "stack": string[]}],\n  "placement_prep": string[]\n}\nRules: milestones = one per week for weeks provided (max 16). Include DSA and placement prep in later weeks. Keep language simple.`;
    } else {
      return json({ error: "unknown action" }, 400);
    }

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("AI error", res.status, t);
      if (res.status === 429) return json({ error: "Rate limited. Try again in a minute." }, 429);
      if (res.status === 402) return json({ error: "AI credits exhausted." }, 402);
      return json({ error: "AI provider error" }, 502);
    }
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { raw };
    }
    return json({ result: parsed });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
