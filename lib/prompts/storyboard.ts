import { callClaude, stripCodeFences } from "@/lib/claude";
import type { IdeaBreakdown, StoryPanel, GenerateRequest } from "@/lib/types";

const SYSTEM_PROMPT = `You are a comic storyboard artist. Given a joke breakdown, create a 4-panel storyboard.

Each panel must follow this structure:
- Panel 1 (setup): Establish the normal world and characters
- Panel 2 (trigger): Introduce the comedic trigger
- Panel 3 (twist): The unexpected turn
- Panel 4 (payoff): The punchline or escalation

Respond ONLY with valid JSON array:
[
  { "panel": 1, "purpose": "setup", "scene": "...", "action": "...", "dialogue": "..." },
  { "panel": 2, "purpose": "trigger", "scene": "...", "action": "...", "dialogue": "..." },
  { "panel": 3, "purpose": "twist", "scene": "...", "action": "...", "dialogue": "..." },
  { "panel": 4, "purpose": "payoff", "scene": "...", "action": "...", "dialogue": "..." }
]

Scene: describe the visual setting. Action: describe what characters are doing. Dialogue: one speech bubble per panel.
No markdown, no explanation, just JSON array.`;

export function buildUserPrompt(
  idea: IdeaBreakdown,
  style: GenerateRequest["style"],
  tone: GenerateRequest["tone"],
  absurdity: number
): string {
  return `Comic premise:
Title: ${idea.title}
Core Joke: ${idea.coreJoke}
Normal World: ${idea.normalWorld}
Twist: ${idea.twist}
Final Payoff: ${idea.finalPayoff}

Style: ${style.replace(/_/g, " ")}
Tone: ${tone}
Absurdity level: ${absurdity}/5

Create the 4-panel storyboard.`;
}

export async function generateStoryboard(
  idea: IdeaBreakdown,
  style: GenerateRequest["style"],
  tone: GenerateRequest["tone"],
  absurdity: number
): Promise<StoryPanel[]> {
  const userPrompt = buildUserPrompt(idea, style, tone, absurdity);
  const raw = await callClaude(SYSTEM_PROMPT, userPrompt);
  return JSON.parse(stripCodeFences(raw));
}

export async function rewritePanel4(
  idea: IdeaBreakdown,
  firstThreePanels: StoryPanel[],
  style: GenerateRequest["style"],
  tone: GenerateRequest["tone"],
  absurdity: number
): Promise<StoryPanel> {
  const rewriteSystem = `You are a comic storyboard artist. Given a joke breakdown and the first 3 panels of a 4-panel comic, write a NEW panel 4 (payoff) that is different from the previous version but still lands the joke.

Respond ONLY with valid JSON:
{ "panel": 4, "purpose": "payoff", "scene": "...", "action": "...", "dialogue": "..." }

No markdown, no explanation, just JSON.`;

  const userPrompt = `Comic premise:
Title: ${idea.title}
Core Joke: ${idea.coreJoke}
Twist: ${idea.twist}
Final Payoff: ${idea.finalPayoff}

Existing panels 1-3:
${firstThreePanels.map((p) => `Panel ${p.panel} (${p.purpose}): Scene: ${p.scene} | Action: ${p.action} | Dialogue: "${p.dialogue}"`).join("\n")}

Style: ${style.replace(/_/g, " ")}
Tone: ${tone}
Absurdity level: ${absurdity}/5

Write a DIFFERENT panel 4 that still pays off the joke in a fresh way.`;

  const raw = await callClaude(rewriteSystem, userPrompt);
  return JSON.parse(stripCodeFences(raw));
}
