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
      action:
        "PM stands confidently at whiteboard, team seated around table with laptops",
      dialogue: "Let's prioritize today's tasks.",
    },
    {
      panel: 2,
      purpose: "trigger",
      scene: "Close-up of whiteboard, red P0 stickers multiplying rapidly",
      action:
        "PM slaps a red P0 sticker on every single item with increasing enthusiasm",
      dialogue: "This is highest priority. And this. And this too.",
    },
    {
      panel: 3,
      purpose: "twist",
      scene: "Whiteboard completely covered in red, barely readable underneath",
      action:
        "Junior dev points at a sticky note reading 'Order lunch' — also marked P0",
      dialogue: "Wait... lunch is highest priority too?",
    },
    {
      panel: 4,
      purpose: "payoff",
      scene:
        "PM holding a gold sparkly sticker with 'P0 Ultra' written in glitter",
      action:
        "PM proudly presents the new tier to the exhausted, dead-eyed team",
      dialogue: "Introducing: Highest Priority Plus Ultra\u2122!",
    },
  ],
  prompt: {
    title: "The Priority Paradox",
    stylePrompt:
      "Minimal webcomic style, clean lines, muted office colors, simple character designs with exaggerated expressions, 4-panel grid layout, white gutters between panels, consistent character appearance across all panels",
    fullPrompt:
      'A 4-panel comic strip in minimal webcomic style with clean lines and muted office colors. Panel 1 (top-left): Office meeting room with whiteboard and sticky notes. A project manager stands confidently at the whiteboard, team seated around table. Speech bubble: "Let\'s prioritize today\'s tasks." Panel 2 (top-right): Close-up of whiteboard filling with red P0 stickers. PM slaps stickers with increasing enthusiasm. Speech bubble: "This is highest priority. And this. And this too." Panel 3 (bottom-left): Whiteboard completely covered in red stickers. Junior dev points at "Order lunch" also marked P0. Speech bubble: "Wait... lunch is highest priority too?" Panel 4 (bottom-right): PM holds a gold sparkly "P0 Ultra" sticker, presenting to exhausted team. Speech bubble: "Introducing: Highest Priority Plus Ultra\u2122!" Consistent character designs throughout. Deadpan humor. White gutters between panels.',
  },
};
