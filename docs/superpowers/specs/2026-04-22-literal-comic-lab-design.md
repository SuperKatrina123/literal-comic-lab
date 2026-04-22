# Literal Comic Lab — MVP Design Spec

## Overview

Single-page app that takes a joke/meme idea and generates: a joke breakdown, a 4-panel comic storyboard, and image-gen prompts for Gemini or similar models.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Anthropic SDK (Claude API)

## Architecture

Single Next.js project — frontend + API Routes in one codebase.

## Visual Style

Kinetic-inspired: white background, pastel/macaron-colored cards (blue, peach, green, purple, pink), Caveat handwritten font for titles, large rounded corners, soft shadows, black CTA button, generous whitespace.

## Page Structure

Single page with left/right split layout.

### Header

- Product name: **Literal Comic Lab**
- Subtitle: *Turn a simple joke into a 4-panel comic storyboard and image prompt*

### Left Panel — Input

1. **Text input** — textarea with placeholder: "Enter a phrase, slogan, or comic idea..."
2. **Example chips** — clickable presets: Highest Priority, Fast Response, Human in the Loop, Open Office
3. **Controls**
   - Style: Minimal Webcomic | Office Satire | AI Comic | Indie Comic (toggle group)
   - Tone: Deadpan | Playful | More Absurd (toggle group)
   - Absurdity: slider 1–5
4. **Buttons**
   - Generate (primary, black)
   - Regenerate All (secondary)
   - Rewrite Panel 4 (secondary)

### Right Panel — Results

Three tabs: **Idea** | **Storyboard** | **Prompt**

**Idea tab** — pastel cards showing:
- Title (blue card)
- Core Joke (peach card)
- Normal World (green card)
- Twist (purple card)
- Final Payoff (pink card)

**Storyboard tab** — 2x2 grid of pastel cards, each panel showing:
- Panel number + purpose tag (setup / trigger / twist / payoff)
- Scene, Action, Dialogue fields

**Prompt tab** — monospace blocks showing:
- Style Prompt
- Full Prompt
- Copy Prompt button + Copy Style Only button

## TypeScript Types

```ts
type IdeaBreakdown = {
  rawInput: string
  title: string
  coreJoke: string
  normalWorld: string
  twist: string
  finalPayoff: string
}

type StoryPanel = {
  panel: 1 | 2 | 3 | 4
  purpose: "setup" | "trigger" | "twist" | "payoff"
  scene: string
  action: string
  dialogue: string
}

type PromptResult = {
  title: string
  stylePrompt: string
  fullPrompt: string
}

type GenerateResponse = {
  idea: IdeaBreakdown
  storyboard: StoryPanel[]
  prompt: PromptResult
}

type GenerateRequest = {
  input: string
  style: "minimal_webcomic" | "office_satire" | "ai_comic" | "indie_comic"
  tone: "deadpan" | "playful" | "absurd"
  absurdity: number // 1-5
}

type RewritePayoffRequest = {
  idea: IdeaBreakdown
  storyboard: StoryPanel[] // all 4 panels; backend uses first 3
  style: GenerateRequest["style"]
  tone: GenerateRequest["tone"]
  absurdity: number
}

type RewritePayoffResponse = {
  storyboard: StoryPanel[]
  prompt: PromptResult
}
```

## API Endpoints

### POST /api/generate

Request: `GenerateRequest`
Response: `GenerateResponse`

Internally runs a 3-step pipeline:
1. **ideaBreakdown** — input → IdeaBreakdown
2. **generateStoryboard** — IdeaBreakdown → StoryPanel[]
3. **generateImagePrompt** — IdeaBreakdown + StoryPanel[] → PromptResult

### POST /api/rewrite-payoff

Request: `RewritePayoffRequest`
Response: `RewritePayoffResponse`

Internally:
1. Takes first 3 panels from request
2. Generates new panel 4 via Claude
3. Regenerates image prompt for updated storyboard

## 3-Step Generation Pipeline

Each step is an independent module in `lib/prompts/`:

```
lib/prompts/
├── idea-breakdown.ts     # Step 1
├── storyboard.ts         # Step 2
└── image-prompt.ts       # Step 3
```

Each module exports:
- `SYSTEM_PROMPT` — the system message
- `buildUserPrompt(...)` — constructs the user message
- `generate*(...)` — async function that calls Claude and returns typed result

Step 3 (image prompt) emphasizes:
- Clean 4-panel layout
- Simple indie webcomic style
- Deadpan humor
- Character consistency across panels

## Directory Structure

```
literal-comic-lab/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Single page, manages global state
│   ├── globals.css
│   └── api/
│       ├── generate/
│       │   └── route.ts
│       └── rewrite-payoff/
│           └── route.ts
├── components/
│   ├── input-panel.tsx
│   ├── result-panel.tsx
│   ├── idea-tab.tsx
│   ├── storyboard-tab.tsx
│   ├── prompt-tab.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── types.ts
│   ├── claude.ts             # Anthropic SDK init + shared call helper
│   ├── mock-data.ts          # Mock response for UI development
│   └── prompts/
│       ├── idea-breakdown.ts
│       ├── storyboard.ts
│       └── image-prompt.ts
├── .env.local                # ANTHROPIC_API_KEY
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## MVP Scope — Included

- Single page app with left input / right results layout
- Generate button → calls /api/generate → shows results in 3 tabs
- Regenerate All → re-calls /api/generate with same input
- Rewrite Panel 4 → calls /api/rewrite-payoff
- Copy Prompt button
- Example chips fill the input
- Style / Tone toggle + Absurdity slider
- Loading state during generation

## MVP Scope — Excluded

- Auth / login
- Database / persistence
- Image generation
- History / cloud sync
- Community sharing
- Comic editor

## Working Approach

1. Write implementation plan before coding
2. Scaffold MVP skeleton first, wire up with mock data
3. Then connect real Claude API calls
4. Keep structure clear, avoid over-abstraction
5. Straightforward naming for components and files
6. Report progress after each step
7. Default to simple, stable approach — no complex architecture
