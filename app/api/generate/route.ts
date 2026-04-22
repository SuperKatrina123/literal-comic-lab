import type { GenerateRequest, GenerateResponse } from "@/lib/types";
import { generateIdeaBreakdown } from "@/lib/prompts/idea-breakdown";
import { generateStoryboard } from "@/lib/prompts/storyboard";
import { generateImagePrompt } from "@/lib/prompts/image-prompt";

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { input, style, tone, absurdity } = body;

    if (!input?.trim()) {
      return Response.json({ error: "Input is required" }, { status: 400 });
    }

    const idea = await generateIdeaBreakdown(input, style, tone, absurdity);
    const storyboard = await generateStoryboard(idea, style, tone, absurdity);
    const prompt = await generateImagePrompt(idea, storyboard, style);

    const response: GenerateResponse = { idea, storyboard, prompt };
    return Response.json(response);
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
