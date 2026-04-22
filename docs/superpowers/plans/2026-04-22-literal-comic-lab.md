# Literal Comic Lab — MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page app that takes a joke idea and generates a joke breakdown, 4-panel storyboard, and image-gen prompts via Claude API.

**Architecture:** Single Next.js project with App Router. Frontend uses React + Tailwind + shadcn/ui. Backend uses Next.js API Routes calling Claude via Anthropic SDK in a 3-step pipeline (idea → storyboard → prompt). Mock data first, then real AI.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Anthropic SDK

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout: Caveat + Inter fonts, global styles |
| `app/page.tsx` | Single page: state management, layout (left input / right results) |
| `app/globals.css` | Tailwind directives + custom CSS variables |
| `app/api/generate/route.ts` | POST handler: orchestrates 3-step pipeline |
| `app/api/rewrite-payoff/route.ts` | POST handler: rewrites panel 4 + regenerates prompt |
| `components/input-panel.tsx` | Left side: textarea, chips, controls, buttons |
| `components/result-panel.tsx` | Right side: tab container (Idea / Storyboard / Prompt) |
| `components/idea-tab.tsx` | Idea tab: 5 pastel cards |
| `components/storyboard-tab.tsx` | Storyboard tab: 2x2 panel grid |
| `components/prompt-tab.tsx` | Prompt tab: monospace blocks + copy buttons |
| `lib/types.ts` | All shared TypeScript types |
| `lib/mock-data.ts` | Mock GenerateResponse for UI development |
| `lib/claude.ts` | Anthropic SDK init + callClaude helper |
| `lib/prompts/idea-breakdown.ts` | Step 1: system prompt + builder + generate function |
| `lib/prompts/storyboard.ts` | Step 2: system prompt + builder + generate function |
| `lib/prompts/image-prompt.ts` | Step 3: system prompt + builder + generate function |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.env.local`, `.gitignore`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/sakura/Desktop/literal-comic-lab
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias="@/*" --use-npm
```

Select defaults: no Turbopack, no `src/` dir.

- [ ] **Step 2: Install shadcn/ui**

```bash
cd /Users/sakura/Desktop/literal-comic-lab
npx shadcn@latest init -d
```

- [ ] **Step 3: Add shadcn components we need**

```bash
cd /Users/sakura/Desktop/literal-comic-lab
npx shadcn@latest add tabs slider button
```

- [ ] **Step 4: Install Anthropic SDK**

```bash
cd /Users/sakura/Desktop/literal-comic-lab
npm install @anthropic-ai/sdk
```

- [ ] **Step 5: Create .env.local**

Create `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

- [ ] **Step 6: Create .gitignore additions**

Append to `.gitignore`:
```
.env.local
.superpowers/
```

- [ ] **Step 7: Verify dev server starts**

```bash
cd /Users/sakura/Desktop/literal-comic-lab
npm run dev
```

Expected: Server starts on http://localhost:3000, default Next.js page renders.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with shadcn/ui and Anthropic SDK"
```

---

## Task 2: Types + Mock Data

**Files:**
- Create: `lib/types.ts`, `lib/mock-data.ts`

- [ ] **Step 1: Create lib/types.ts**

```ts
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
```

- [ ] **Step 2: Create lib/mock-data.ts**

```ts
import type { GenerateResponse } from "./types";

export const MOCK_RESPONSE: GenerateResponse = {
  idea: {
    rawInput: "Highest Priority",
    title: "The Priority Paradox",
    coreJoke:
      'When everything is "highest priority", nothing is.',
    normalWorld:
      "A project manager assigns task priorities in a daily standup meeting.",
    twist:
      'Every single task — including lunch — gets labeled "Highest Priority".',
    finalPayoff:
      'The team creates a new tier: "Highest Priority Plus Ultra" for actually urgent items.',
  },
  storyboard: [
    {
      panel: 1,
      purpose: "setup",
      scene: "Office meeting room, whiteboard covered in colorful sticky notes",
      action: "PM stands confidently at whiteboard, team seated around table with laptops",
      dialogue: "Let's prioritize today's tasks.",
    },
    {
      panel: 2,
      purpose: "trigger",
      scene: "Close-up of whiteboard, red P0 stickers multiplying rapidly",
      action: "PM slaps a red P0 sticker on every single item with increasing enthusiasm",
      dialogue: "This is highest priority. And this. And this too.",
    },
    {
      panel: 3,
      purpose: "twist",
      scene: "Whiteboard completely covered in red, barely readable underneath",
      action: "Junior dev points at a sticky note reading 'Order lunch' — also marked P0",
      dialogue: "Wait... lunch is highest priority too?",
    },
    {
      panel: 4,
      purpose: "payoff",
      scene: "PM holding a gold sparkly sticker with 'P0 Ultra' written in glitter",
      action: "PM proudly presents the new tier to the exhausted, dead-eyed team",
      dialogue: "Introducing: Highest Priority Plus Ultra™!",
    },
  ],
  prompt: {
    title: "The Priority Paradox",
    stylePrompt:
      "Minimal webcomic style, clean lines, muted office colors, simple character designs with exaggerated expressions, 4-panel grid layout, white gutters between panels, consistent character appearance across all panels",
    fullPrompt:
      'A 4-panel comic strip in minimal webcomic style with clean lines and muted office colors. Panel 1 (top-left): Office meeting room with whiteboard and sticky notes. A project manager stands confidently at the whiteboard, team seated around table. Speech bubble: "Let\'s prioritize today\'s tasks." Panel 2 (top-right): Close-up of whiteboard filling with red P0 stickers. PM slaps stickers with increasing enthusiasm. Speech bubble: "This is highest priority. And this. And this too." Panel 3 (bottom-left): Whiteboard completely covered in red stickers. Junior dev points at "Order lunch" also marked P0. Speech bubble: "Wait... lunch is highest priority too?" Panel 4 (bottom-right): PM holds a gold sparkly "P0 Ultra" sticker, presenting to exhausted team. Speech bubble: "Introducing: Highest Priority Plus Ultra™!" Consistent character designs throughout. Deadpan humor. White gutters between panels.',
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/mock-data.ts
git commit -m "feat: add TypeScript types and mock data"
```

---

## Task 3: Root Layout + Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update app/globals.css**

Replace contents with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-hand: var(--font-caveat);
  --color-card-blue: #e8f4fd;
  --color-card-peach: #fef3e2;
  --color-card-green: #e8fbe8;
  --color-card-purple: #f3e8fe;
  --color-card-pink: #fce8f0;
  --color-tag-blue-bg: #c6e4f5;
  --color-tag-blue-text: #3a7ca5;
  --color-tag-peach-bg: #fce0b8;
  --color-tag-peach-text: #b07840;
  --color-tag-green-bg: #c6ecc6;
  --color-tag-green-text: #3a8a3a;
  --color-tag-purple-bg: #ddc8f5;
  --color-tag-purple-text: #6a40a5;
  --color-tag-pink-bg: #f5c6d8;
  --color-tag-pink-text: #a5406a;
}

@layer base {
  :root {
    --background: #fafafa;
    --foreground: #1a1a1a;
  }
}

@layer base {
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

Note: Keep any existing shadcn CSS variables that were generated during `shadcn init`. Merge, don't replace — add the custom card/tag colors and font variables on top of the existing file.

- [ ] **Step 2: Update app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Literal Comic Lab",
  description:
    "Turn a simple joke into a 4-panel comic storyboard and image prompt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify fonts load**

Run `npm run dev`, open http://localhost:3000, check DevTools — both `--font-inter` and `--font-caveat` CSS variables should be set on `<body>`.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: configure fonts and pastel color theme"
```

---

## Task 4: Input Panel Component

**Files:**
- Create: `components/input-panel.tsx`

- [ ] **Step 1: Create components/input-panel.tsx**

```tsx
"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { GenerateRequest } from "@/lib/types";

const EXAMPLES = ["Highest Priority", "Fast Response", "Human in the Loop", "Open Office"];

const STYLES: { label: string; value: GenerateRequest["style"] }[] = [
  { label: "Minimal Webcomic", value: "minimal_webcomic" },
  { label: "Office Satire", value: "office_satire" },
  { label: "AI Comic", value: "ai_comic" },
  { label: "Indie Comic", value: "indie_comic" },
];

const TONES: { label: string; value: GenerateRequest["tone"] }[] = [
  { label: "Deadpan", value: "deadpan" },
  { label: "Playful", value: "playful" },
  { label: "More Absurd", value: "absurd" },
];

type InputPanelProps = {
  input: string;
  style: GenerateRequest["style"];
  tone: GenerateRequest["tone"];
  absurdity: number;
  loading: boolean;
  hasResult: boolean;
  onInputChange: (value: string) => void;
  onStyleChange: (value: GenerateRequest["style"]) => void;
  onToneChange: (value: GenerateRequest["tone"]) => void;
  onAbsurdityChange: (value: number) => void;
  onGenerate: () => void;
  onRegenerateAll: () => void;
  onRewritePanel4: () => void;
};

export function InputPanel({
  input,
  style,
  tone,
  absurdity,
  loading,
  hasResult,
  onInputChange,
  onStyleChange,
  onToneChange,
  onAbsurdityChange,
  onGenerate,
  onRegenerateAll,
  onRewritePanel4,
}: InputPanelProps) {
  return (
    <div className="w-[360px] shrink-0 flex flex-col gap-5">
      {/* Input card */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter a phrase, slogan, or comic idea..."
          className="w-full h-[88px] border-2 border-gray-100 rounded-[14px] px-4 py-3.5 text-sm font-sans resize-none outline-none bg-[#fafafa] focus:border-[#c8b6ff] transition-colors placeholder:text-gray-300"
        />
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-4 mb-2">
          Try an example
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex}
              onClick={() => onInputChange(ex)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                [
                  "bg-card-blue text-tag-blue-text",
                  "bg-card-peach text-tag-peach-text",
                  "bg-card-green text-tag-green-text",
                  "bg-card-purple text-tag-purple-text",
                ][i]
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Controls card */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        {/* Style */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Style</div>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => onStyleChange(s.value)}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium border-2 transition-colors ${
                  style === s.value
                    ? "border-[#c8b6ff] bg-[#f5f0ff] text-[#6a4fb8]"
                    : "border-gray-100 bg-white text-gray-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Tone</div>
          <div className="flex gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => onToneChange(t.value)}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium border-2 transition-colors ${
                  tone === t.value
                    ? "border-[#c8b6ff] bg-[#f5f0ff] text-[#6a4fb8]"
                    : "border-gray-100 bg-white text-gray-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Absurdity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Absurdity</span>
            <span className="text-sm font-semibold text-[#6a4fb8]">{absurdity} / 5</span>
          </div>
          <Slider
            value={[absurdity]}
            onValueChange={(v) => onAbsurdityChange(v[0])}
            min={1}
            max={5}
            step={1}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={onGenerate}
          disabled={!input.trim() || loading}
          className="w-full py-6 bg-[#1a1a1a] hover:bg-[#333] rounded-[14px] text-[15px] font-semibold"
        >
          {loading ? "Generating..." : "Generate →"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRegenerateAll}
            disabled={!hasResult || loading}
            className="flex-1 rounded-[12px] border-2 border-gray-100 text-gray-500 text-xs"
          >
            Regenerate All
          </Button>
          <Button
            variant="outline"
            onClick={onRewritePanel4}
            disabled={!hasResult || loading}
            className="flex-1 rounded-[12px] border-2 border-gray-100 text-gray-500 text-xs"
          >
            Rewrite Panel 4
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/input-panel.tsx
git commit -m "feat: add InputPanel component"
```

---

## Task 5: Result Panel + Three Tabs

**Files:**
- Create: `components/idea-tab.tsx`, `components/storyboard-tab.tsx`, `components/prompt-tab.tsx`, `components/result-panel.tsx`

- [ ] **Step 1: Create components/idea-tab.tsx**

```tsx
import type { IdeaBreakdown } from "@/lib/types";

const FIELDS: {
  key: keyof Omit<IdeaBreakdown, "rawInput">;
  label: string;
  cardColor: string;
  tagBg: string;
  tagText: string;
}[] = [
  { key: "title", label: "Title", cardColor: "bg-card-blue", tagBg: "bg-tag-blue-bg", tagText: "text-tag-blue-text" },
  { key: "coreJoke", label: "Core Joke", cardColor: "bg-card-peach", tagBg: "bg-tag-peach-bg", tagText: "text-tag-peach-text" },
  { key: "normalWorld", label: "Normal World", cardColor: "bg-card-green", tagBg: "bg-tag-green-bg", tagText: "text-tag-green-text" },
  { key: "twist", label: "Twist", cardColor: "bg-card-purple", tagBg: "bg-tag-purple-bg", tagText: "text-tag-purple-text" },
  { key: "finalPayoff", label: "Final Payoff", cardColor: "bg-card-pink", tagBg: "bg-tag-pink-bg", tagText: "text-tag-pink-text" },
];

export function IdeaTab({ idea }: { idea: IdeaBreakdown }) {
  return (
    <div className="flex flex-col gap-3.5">
      {FIELDS.map((f) => (
        <div key={f.key} className={`${f.cardColor} rounded-[20px] px-6 py-5`}>
          <span
            className={`inline-block ${f.tagBg} ${f.tagText} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg mb-2`}
          >
            {f.label}
          </span>
          {f.key === "title" ? (
            <div className="text-[15px] font-semibold">{idea[f.key]}</div>
          ) : (
            <div className="text-[13px] text-gray-600 leading-relaxed">{idea[f.key]}</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create components/storyboard-tab.tsx**

```tsx
import type { StoryPanel } from "@/lib/types";

const PANEL_STYLES: {
  cardColor: string;
  tagBg: string;
  tagText: string;
}[] = [
  { cardColor: "bg-card-blue", tagBg: "bg-tag-blue-bg", tagText: "text-tag-blue-text" },
  { cardColor: "bg-card-peach", tagBg: "bg-tag-peach-bg", tagText: "text-tag-peach-text" },
  { cardColor: "bg-card-green", tagBg: "bg-tag-green-bg", tagText: "text-tag-green-text" },
  { cardColor: "bg-card-purple", tagBg: "bg-tag-purple-bg", tagText: "text-tag-purple-text" },
];

export function StoryboardTab({ storyboard }: { storyboard: StoryPanel[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {storyboard.map((panel, i) => {
        const s = PANEL_STYLES[i];
        return (
          <div key={panel.panel} className={`${s.cardColor} rounded-[20px] px-5 py-5`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-hand text-xl font-bold">Panel {panel.panel}</span>
              <span
                className={`${s.tagBg} ${s.tagText} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg`}
              >
                {panel.purpose}
              </span>
            </div>
            {(["scene", "action", "dialogue"] as const).map((field) => (
              <div key={field} className="mb-2.5 last:mb-0">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                  {field}
                </div>
                <div
                  className={`text-[13px] text-gray-600 leading-snug ${
                    field === "dialogue" ? "italic" : ""
                  }`}
                >
                  {field === "dialogue" ? `"${panel[field]}"` : panel[field]}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create components/prompt-tab.tsx**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptResult } from "@/lib/types";

export function PromptTab({ prompt }: { prompt: PromptResult }) {
  const [copied, setCopied] = useState<"full" | "style" | null>(null);

  const handleCopy = async (text: string, type: "full" | "style") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-3.5">
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Style Prompt</div>
        <div className="bg-white border-2 border-gray-100 rounded-[16px] p-4 text-[13px] text-gray-500 leading-relaxed font-mono">
          {prompt.stylePrompt}
        </div>
      </div>
      <div className="mb-3.5">
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Full Prompt</div>
        <div className="bg-white border-2 border-gray-100 rounded-[16px] p-4 text-[13px] text-gray-500 leading-relaxed font-mono max-h-[240px] overflow-y-auto">
          {prompt.fullPrompt}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleCopy(prompt.fullPrompt, "full")}
          className="bg-[#1a1a1a] hover:bg-[#333] rounded-[12px] text-sm font-semibold px-5"
        >
          {copied === "full" ? "Copied!" : "Copy Prompt →"}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleCopy(prompt.stylePrompt, "style")}
          className="rounded-[12px] border-2 border-gray-100 text-gray-500 text-sm"
        >
          {copied === "style" ? "Copied!" : "Copy Style Only"}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create components/result-panel.tsx**

```tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeaTab } from "./idea-tab";
import { StoryboardTab } from "./storyboard-tab";
import { PromptTab } from "./prompt-tab";
import type { GenerateResponse } from "@/lib/types";

export function ResultPanel({ result }: { result: GenerateResponse | null }) {
  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-300 text-lg font-hand">
          Enter an idea and hit Generate to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Tabs defaultValue="idea">
        <TabsList className="bg-transparent gap-1 mb-5">
          <TabsTrigger
            value="idea"
            className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Idea
          </TabsTrigger>
          <TabsTrigger
            value="storyboard"
            className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Storyboard
          </TabsTrigger>
          <TabsTrigger
            value="prompt"
            className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Prompt
          </TabsTrigger>
        </TabsList>
        <TabsContent value="idea">
          <IdeaTab idea={result.idea} />
        </TabsContent>
        <TabsContent value="storyboard">
          <StoryboardTab storyboard={result.storyboard} />
        </TabsContent>
        <TabsContent value="prompt">
          <PromptTab prompt={result.prompt} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/idea-tab.tsx components/storyboard-tab.tsx components/prompt-tab.tsx components/result-panel.tsx
git commit -m "feat: add result panel with Idea, Storyboard, and Prompt tabs"
```

---

## Task 6: Main Page with Mock Data

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Wire up app/page.tsx with mock data**

```tsx
"use client";

import { useState } from "react";
import { InputPanel } from "@/components/input-panel";
import { ResultPanel } from "@/components/result-panel";
import { MOCK_RESPONSE } from "@/lib/mock-data";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<GenerateRequest["style"]>("minimal_webcomic");
  const [tone, setTone] = useState<GenerateRequest["tone"]>("playful");
  const [absurdity, setAbsurdity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    // TODO: replace with real API call in Task 9
    await new Promise((r) => setTimeout(r, 1500));
    setResult({ ...MOCK_RESPONSE, idea: { ...MOCK_RESPONSE.idea, rawInput: input } });
    setLoading(false);
  };

  const handleRegenerateAll = () => {
    handleGenerate();
  };

  const handleRewritePanel4 = async () => {
    if (!result) return;
    setLoading(true);
    // TODO: replace with real API call in Task 9
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5">
        <h1 className="font-hand text-[28px] font-bold">Literal Comic Lab.</h1>
        <p className="text-[13px] text-gray-400">
          Turn a simple joke into a 4-panel comic storyboard and image prompt
        </p>
      </header>

      {/* Main */}
      <main className="flex gap-9 px-10 pb-10">
        <InputPanel
          input={input}
          style={style}
          tone={tone}
          absurdity={absurdity}
          loading={loading}
          hasResult={result !== null}
          onInputChange={setInput}
          onStyleChange={setStyle}
          onToneChange={setTone}
          onAbsurdityChange={setAbsurdity}
          onGenerate={handleGenerate}
          onRegenerateAll={handleRegenerateAll}
          onRewritePanel4={handleRewritePanel4}
        />
        <ResultPanel result={result} />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`, open http://localhost:3000:
1. Page shows left/right layout with header
2. Type text, click Generate — after 1.5s mock data appears in all 3 tabs
3. Chips fill the input
4. Style/Tone toggles highlight on click
5. Slider works
6. Copy Prompt copies to clipboard
7. Regenerate All re-triggers (mock delay)

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up main page with mock data"
```

---

## Task 7: Visual Polish Pass

**Files:**
- Modify: various component files as needed

- [ ] **Step 1: Check visual output against mockup**

Open the visual companion mockup at http://localhost:62561 side-by-side with http://localhost:3000. Compare:

1. Card colors match pastel palette
2. Fonts render correctly (Caveat for titles, Inter for body)
3. Rounded corners are consistent (20px cards, 14px buttons, 12px toggles)
4. White spacing feels generous
5. Tabs look correct (black active, gray inactive)
6. Slider renders properly

- [ ] **Step 2: Fix any visual discrepancies**

Adjust Tailwind classes as needed. Common fixes:
- shadcn Slider may need custom styling to match purple gradient
- Tab trigger styling may need overrides
- Card shadow depth

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style: visual polish to match design mockup"
```

---

## Task 8: Claude API Integration — 3-Step Pipeline

**Files:**
- Create: `lib/claude.ts`, `lib/prompts/idea-breakdown.ts`, `lib/prompts/storyboard.ts`, `lib/prompts/image-prompt.ts`

- [ ] **Step 1: Create lib/claude.ts**

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }
  return block.text;
}
```

- [ ] **Step 2: Create lib/prompts/idea-breakdown.ts**

```ts
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
```

- [ ] **Step 3: Create lib/prompts/storyboard.ts**

```ts
import { callClaude } from "@/lib/claude";
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
  return JSON.parse(raw);
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
  return JSON.parse(raw);
}
```

- [ ] **Step 4: Create lib/prompts/image-prompt.ts**

```ts
import { callClaude } from "@/lib/claude";
import type { IdeaBreakdown, StoryPanel, PromptResult, GenerateRequest } from "@/lib/types";

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
  return JSON.parse(raw);
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/claude.ts lib/prompts/
git commit -m "feat: add Claude SDK helper and 3-step prompt pipeline"
```

---

## Task 9: API Routes + Frontend Wiring

**Files:**
- Create: `app/api/generate/route.ts`, `app/api/rewrite-payoff/route.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create app/api/generate/route.ts**

```ts
import { NextResponse } from "next/server";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";
import { generateIdeaBreakdown } from "@/lib/prompts/idea-breakdown";
import { generateStoryboard } from "@/lib/prompts/storyboard";
import { generateImagePrompt } from "@/lib/prompts/image-prompt";

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { input, style, tone, absurdity } = body;

    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const idea = await generateIdeaBreakdown(input, style, tone, absurdity);
    const storyboard = await generateStoryboard(idea, style, tone, absurdity);
    const prompt = await generateImagePrompt(idea, storyboard, style);

    const response: GenerateResponse = { idea, storyboard, prompt };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create app/api/rewrite-payoff/route.ts**

```ts
import { NextResponse } from "next/server";
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
    return NextResponse.json(response);
  } catch (error) {
    console.error("Rewrite payoff error:", error);
    return NextResponse.json(
      { error: "Rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Update app/page.tsx — replace mock calls with real API calls**

Replace the `handleGenerate` function:

```ts
const handleGenerate = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, style, tone, absurdity }),
    });
    if (!res.ok) throw new Error("Generation failed");
    const data: GenerateResponse = await res.json();
    setResult(data);
  } catch {
    alert("Generation failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

Replace the `handleRewritePanel4` function:

```ts
const handleRewritePanel4 = async () => {
  if (!result) return;
  setLoading(true);
  try {
    const res = await fetch("/api/rewrite-payoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: result.idea,
        storyboard: result.storyboard,
        style,
        tone,
        absurdity,
      }),
    });
    if (!res.ok) throw new Error("Rewrite failed");
    const data: RewritePayoffResponse = await res.json();
    setResult({ ...result, storyboard: data.storyboard, prompt: data.prompt });
  } catch {
    alert("Rewrite failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

Remove the `MOCK_RESPONSE` import (no longer needed). Keep `mock-data.ts` in the repo for reference.

- [ ] **Step 4: Set real API key in .env.local**

```
ANTHROPIC_API_KEY=sk-ant-...your-real-key...
```

- [ ] **Step 5: End-to-end test**

Run `npm run dev`, open http://localhost:3000:
1. Type "Highest Priority", click Generate
2. Wait for Claude to respond (may take 5-10s for 3 calls)
3. Check all 3 tabs have real generated content
4. Click Rewrite Panel 4 — panel 4 updates, prompt regenerates
5. Click Regenerate All — fresh content appears
6. Try different styles/tones

- [ ] **Step 6: Commit**

```bash
git add app/api/ app/page.tsx
git commit -m "feat: connect API routes to Claude 3-step pipeline"
```

---

## Task 10: Loading State & Error Handling

**Files:**
- Modify: `components/result-panel.tsx`

- [ ] **Step 1: Add loading state to ResultPanel**

Update `ResultPanel` props and rendering:

```tsx
export function ResultPanel({
  result,
  loading,
}: {
  result: GenerateResponse | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="font-hand text-2xl text-gray-400 animate-pulse">
            Generating your comic...
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Breaking down the joke → Writing storyboard → Crafting prompts
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-300 text-lg font-hand">
          Enter an idea and hit Generate to get started
        </p>
      </div>
    );
  }

  // ... rest of Tabs rendering stays the same
```

- [ ] **Step 2: Pass loading prop from page.tsx**

In `app/page.tsx`, update the ResultPanel usage:

```tsx
<ResultPanel result={result} loading={loading} />
```

- [ ] **Step 3: Verify loading state in browser**

Click Generate — should show "Generating your comic..." with pulse animation during the API call.

- [ ] **Step 4: Commit**

```bash
git add components/result-panel.tsx app/page.tsx
git commit -m "feat: add loading state and empty state to result panel"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Full flow test**

1. Open http://localhost:3000
2. Click "Highest Priority" chip → fills input
3. Set style to "Office Satire", tone to "Deadpan", absurdity to 4
4. Click Generate → loading state → results appear
5. Check Idea tab — 5 cards with correct colors
6. Check Storyboard tab — 4 panels in 2x2 grid
7. Check Prompt tab — style + full prompt shown
8. Click Copy Prompt → paste in text editor, verify content
9. Click Rewrite Panel 4 → panel 4 content changes, prompt updates
10. Click Regenerate All → all content refreshes
11. Try with empty input → Generate button is disabled

- [ ] **Step 2: Commit final state**

```bash
git add -A
git commit -m "feat: Literal Comic Lab MVP complete"
```
