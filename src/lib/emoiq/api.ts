import { supabase } from "@/integrations/supabase/client";

export type EmoIqAction = "analyze" | "predict" | "plan" | "quiz" | "roadmap";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emoiq`;

export async function callEmoIq<T = unknown>(action: EmoIqAction, payload: unknown): Promise<T> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `AI request failed (${res.status})`);
  return body.result as T;
}

export type Weightage = { unit: string; percent: number; priority: "HIGH" | "MEDIUM" | "LOW" };
export type TopicFreq = { topic: string; count: number; unit: string };
export type YearTrend = { year: string; top_topics: string[] };
export type AnalyzeResult = {
  summary: string;
  weightage: Weightage[];
  topic_freq: TopicFreq[];
  year_trend: YearTrend[];
};
export type PredictedQuestion = { question: string; probability: number; unit: string; marks: number; reason: string };
export type PlanDay = { day: number; focus: string; topics: string[]; tasks: string[]; hours: number };
export type PlanResult = { headline: string; strategy: string; days: PlanDay[]; skip: string[] };
export type QuizQuestion = { q: string; options: string[]; answer: number; topic: string; explain: string };
