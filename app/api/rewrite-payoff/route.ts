import type { RewritePayoffRequest, RewritePayoffResponse } from "@/lib/types";
import { rewritePanel4 } from "@/lib/prompts/storyboard";
import { generateImagePrompt } from "@/lib/prompts/image-prompt";

export async function POST(request: Request) {
  try {
    const body: RewritePayoffRequest = await request.json();
    const { idea, storyboard, style, tone, absurdity } = body;

    const firstThree = storyboard.slice(0, 3);
    const newPanel4 = await rewritePanel4(idea, firstThree, style, tone, absurdity);
    const newStoryboard = [...firstThree, newPanel4];
    const prompt = await generateImagePrompt(idea, newStoryboard, style);

    const response: RewritePayoffResponse = { storyboard: newStoryboard, prompt };
    return Response.json(response);
  } catch (error) {
    console.error("Rewrite payoff error:", error);
    return Response.json(
      { error: "Rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
