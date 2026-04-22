import { callClaude, stripCodeFences } from "@/lib/claude";
import type {
  IdeaBreakdown,
  StoryPanel,
  PromptResult,
  GenerateRequest,
} from "@/lib/types";

const SYSTEM_PROMPT = `You are an expert at writing image generation prompts for AI art tools (Gemini, Midjourney, DALL-E). Given a comic storyboard, produce two prompts:

1. stylePrompt: A short style description (art style, line quality, color palette, layout format)
2. fullPrompt: A complete image generation prompt that describes all 4 panels in sequence with scene details, character actions, and dialogue

Emphasize:
- Clean 4-panel grid layout with white gutters
- Simple indie webcomic style
- Consistent character appearance across all panels
- Expressive but simple character designs
- The comedic tone in visual descriptions

Respond ONLY with valid JSON:
{
  "title": "The comic title",
  "stylePrompt": "...",
  "fullPrompt": "..."
}

No markdown, no explanation, just JSON.`;

export function buildUserPrompt(
  idea: IdeaBreakdown,
  storyboard: StoryPanel[],
  style: GenerateRequest["style"]
): string {
  const panelDescriptions = storyboard
    .map(
      (p) =>
        `Panel ${p.panel} (${p.purpose}): Scene: ${p.scene}. Action: ${p.action}. Dialogue: "${p.dialogue}"`
    )
    .join("\n");

  return `Comic title: ${idea.title}
Art style: ${style.replace(/_/g, " ")}

Storyboard:
${panelDescriptions}

Generate the image prompts.`;
}

export async function generateImagePrompt(
  idea: IdeaBreakdown,
  storyboard: StoryPanel[],
  style: GenerateRequest["style"]
): Promise<PromptResult> {
  const userPrompt = buildUserPrompt(idea, storyboard, style);
  const raw = await callClaude(SYSTEM_PROMPT, userPrompt);
  return JSON.parse(stripCodeFences(raw));
}
