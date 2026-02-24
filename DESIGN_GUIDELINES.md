# KodNest Premium Build System — Design Guidelines

Design Philosophy
- Calm, Intentional, Coherent, Confident
- No flashy or playful elements; no gradients, neon, or glassmorphism
- Consistency: everything should feel like one mind designed it

Color System (max 4 colors)
- Background: #F7F6F3
- Primary text: #111111
- Accent: #8B0000 (deep red)
- Success: #4B8F6F (muted green)
- Warning: #C47A00 (muted amber)

Typography
- Headings: Serif (large, generous spacing)
- Body: Clean sans-serif, 16–18px, line-height 1.6–1.8, max 720px text blocks
- No decorative fonts or random sizes

Spacing System
- Strict scale: 8px, 16px, 24px, 40px, 64px

Global Layout
- Page order: [Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
- Primary Workspace width: 70%; Secondary Panel width: 30%

Top Bar
- Left: Project name
- Center: Progress indicator (Step X / Y)
- Right: Status badge (Not Started / In Progress / Shipped)

Secondary Panel (30%)
- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot

Proof Footer (persistent bottom)
- Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
- Each checkbox requires proof input

Components & Interaction Rules
- Primary button: solid deep red; Secondary: outlined
- Same hover effect and border radius everywhere
- Inputs: clean borders, clear focus state, no heavy shadows
- Cards: subtle border, balanced padding
- Transitions: 150–200ms ease-in-out, no bounce

Error & Empty States
- Errors explain what went wrong + how to fix
- Empty states provide the next action

Do not add product features here — this repo is the design system scaffold only.
