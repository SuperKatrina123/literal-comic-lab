# Literal Comic Lab

Turn any joke or meme idea into a structured 4-panel comic breakdown with AI-generated image prompts.

## Features

- **Idea Breakdown** — Deconstructs your input into title, core joke, normal world, twist, and final payoff
- **4-Panel Storyboard** — Generates setup → trigger → twist → payoff with scene, action, and dialogue
- **Image Prompt Generation** — Produces style prompt + full prompt ready for Gemini / Midjourney / DALL-E
- **Rewrite Panel 4** — Regenerate just the punchline panel for a fresh take
- **Style & Tone Controls** — Cartoon / pixel art / manga styles, witty / absurd / dry tones, absurdity slider

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Anthropic Claude API (3-step generation pipeline)
- Inter + Caveat (Google Fonts)

## Getting Started

```bash
npm install
```

Create `.env.local`:

```env
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_BASE_URL=https://api.anthropic.com  # optional, for custom endpoints
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx              # Main single-page app
  api/generate/         # 3-step pipeline: idea → storyboard → prompt
  api/rewrite-payoff/   # Rewrite panel 4 only
components/
  input-panel.tsx       # Left: textarea, style/tone controls, buttons
  result-panel.tsx      # Right: tabbed results (Idea / Storyboard / Prompt)
  idea-tab.tsx          # Joke breakdown cards
  storyboard-tab.tsx    # 2x2 panel grid
  prompt-tab.tsx        # Copyable prompt blocks
lib/
  claude.ts             # Anthropic SDK wrapper
  types.ts              # TypeScript types
  mock-data.ts          # Mock response for development
  prompts/
    idea-breakdown.ts   # Step 1: comedy writer prompt
    storyboard.ts       # Step 2: storyboard artist prompt
    image-prompt.ts     # Step 3: image prompt expert
```
