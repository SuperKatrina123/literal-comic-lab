import { callClaude } from "@/lib/claude";
import type { IdeaBreakdown, GenerateRequest } from "@/lib/types";

const SYSTEM_PROMPT = `You are a comedy writer who deconstructs jokes and memes into structured components. Given a phrase, slogan, or comic idea, break it down into a comedic premise.

Respond ONLY with valid JSON matching this exact structure:
{
  "title": "A short punchy title for the comic",
  "coreJoke": "The fundamental comedic observation or irony",
  "normalWorld": "The relatable everyday situation before the joke",
  "twist": "The unexpected turn that creates the humor",
  "finalPayoff": "The punchline or escalation that lands the joke"
}

No markdown, no explanation, just JSON.`;

export function buildUserPrompt(
  input: string,
  style: GenerateRequest["style"],
  tone: GenerateRequest["tone"],
  absurdity: number
): string {
  return `Idea: "${input}"
Style: ${style.replace(/_/g, " ")}
Tone: ${tone}
Absurdity level: ${absurdity}/5

Break this down into a comic premise.`;
}

export async function generateIdeaBreakdown(
  input: string,
  style: GenerateRequest["style"],
  tone: GenerateRequest["tone"],
  absurdity: number
): Promise<IdeaBreakdown> {
  const userPrompt = buildUserPrompt(input, style, tone, absurdity);
  const raw = await callClaude(SYSTEM_PROMPT, userPrompt);
  const parsed = JSON.parse(raw);
  return { rawInput: input, ...parsed };
}
