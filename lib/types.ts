export type IdeaBreakdown = {
  rawInput: string;
  title: string;
  coreJoke: string;
  normalWorld: string;
  twist: string;
  finalPayoff: string;
};

export type StoryPanel = {
  panel: 1 | 2 | 3 | 4;
  purpose: "setup" | "trigger" | "twist" | "payoff";
  scene: string;
  action: string;
  dialogue: string;
};

export type PromptResult = {
  title: string;
  stylePrompt: string;
  fullPrompt: string;
};

export type GenerateResponse = {
  idea: IdeaBreakdown;
  storyboard: StoryPanel[];
  prompt: PromptResult;
};

export type GenerateRequest = {
  input: string;
  style: "minimal_webcomic" | "office_satire" | "ai_comic" | "indie_comic";
  tone: "deadpan" | "playful" | "absurd";
  absurdity: number;
};

export type RewritePayoffRequest = {
  idea: IdeaBreakdown;
  storyboard: StoryPanel[];
  style: GenerateRequest["style"];
  tone: GenerateRequest["tone"];
  absurdity: number;
};

export type RewritePayoffResponse = {
  storyboard: StoryPanel[];
  prompt: PromptResult;
};
