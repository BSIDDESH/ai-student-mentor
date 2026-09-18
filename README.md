# AI Student Life Mentor 🎓

> **First Commit Hackathon · Sep 17–20, 2026**
> Team: Manjunath (Frontend / UI / UX) + Siddu (AWS Bedrock / DynamoDB / API)
> Tracks: Best UI · Best Use of AI · Ship It

---

## What it is

An adaptive AI learning companion for school students, Classes 1–10. The core loop:

1. Student opens the app → dashboard shows exactly which topics are weak (score < 60%), flagged red
2. They tap a weak topic → mentor chat already knows about it → starts a quiz
3. After the quiz, the score animates from 45% to 68% in real time — the red flag clears to green
4. Log out, log back in → still 68%. The system remembered.

That one sequence — weak topic flagged → practiced → score lifts → memory persists — is the entire value proposition made visible.

---

## Demo script (for judges)

**1. Load the app** — you'll see Arjun's dashboard. Notice:
- "Focus areas" card (rose tinted, different shape from other cards) — Fractions 45%, Light & Optics 41%
- Progress bars in red/amber/green colour bands
- 3-day streak 🔥, 120 XP at Level 1

**2. Tap "Fractions 45% → Practice" chip** — goes directly to quiz, pre-filled for Fractions

**3. Answer 5 quiz questions** — instant per-question feedback with explanations

**4. Watch the results screen** — score counts up from 45% → 68% (cubic eased animation). The "weak topic" banner clears. +50 XP awarded. "First Quiz" badge unlocks.

**5. Return to Dashboard** — Fractions is no longer in the Focus Areas card. XP updated. Badge earned.

**6. Tap "Mentor" tab** — AI already knows Fractions was weak. Starter prompts reflect the student's real data.

**7. Tap "Wellness"** — log water glasses (hydration goal ticks), try a micro-break card, watch XP update live.

---

## Architecture

```
Frontend (Manjunath)          Backend (Siddu)
─────────────────────         ──────────────────────────
Next.js 16 App Router         AWS API Gateway + Lambda
lib/api.ts (single gateway)   Amazon Bedrock (Claude 3)
lib/types.ts (CONTRACT.md)    Amazon DynamoDB
lib/mocks.ts (fake data)      Amazon Cognito
lib/helpers.ts (pure fns)     AWS Amplify Hosting
```

**Golden rule:** No component ever calls `fetch()` directly. Every data operation goes through `lib/api.ts`, which returns mocks on Day 1 and flips to live API endpoints per-endpoint when Siddu's routes go live.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.5 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Auth | AWS Amplify + Cognito (Day 2) |
| AI | Amazon Bedrock — Claude 3 Sonnet |
| Database | Amazon DynamoDB |
| Hosting | AWS Amplify Hosting |
| Fonts | Space Grotesk (display/numbers) + Inter (body) |

---

## Design system (locked, shared with backend)

- **Score bands:** red < 60% · amber 60–79% · green 80%+ — consistent everywhere
- **Primary accent:** Indigo-600 (`#4f46e5`)
- **Page background:** Chalk (`#faf9f7`) — warm white, not cold grey
- **Type:** Space Grotesk for all numbers (XP, streaks, scores) — feels like a scoreboard
- **Motion:** exactly 3 animations — score counting up, progress bar filling, badge unlock. Nothing else.
- **Mobile first:** all screens tested at 390px

---

## Running locally

```bash
git clone <repo>
cd ai-student-mentor
npm install
npm run dev
# → http://localhost:3000
```

No environment variables needed on Day 1. Mock data loads automatically.

**To connect live backend (Day 2):**
1. Put `amplifyconfiguration.json` in project root (from Siddu)
2. In `app/lib/api.ts`, flip `USE_MOCKS` per-endpoint to `false`
3. Wrap layout with `<Authenticator>` from `@aws-amplify/ui-react`

---

## File structure

```
app/
  lib/
    types.ts          — CONTRACT.md TypeScript types
    mocks.ts          — Fake profile with weak topics seeded in 40s
    api.ts            — THE only place fetch() lives. Per-endpoint USE_MOCKS.
    helpers.ts        — weakTopics(), dayArc(), useCountUp(), bandLabel()
  components/
    DashboardShell.tsx    — Tab nav, profile state holder
    DayArcHero.tsx        — Morning/afternoon/evening greeting hero
    WeakTopicFlags.tsx    — Urgent rose card, one-tap to quiz
    SubjectProgress.tsx   — Score bands, topic progress bars
    DailyGoals.tsx        — Auto-updating checklist
    BadgeShelf.tsx        — Earned (glow) vs locked (preview) badges
    MentorChat.tsx        — Chat UI, typing indicator, starter prompts
    QuizFlow.tsx          — 4-state quiz: pick → load → questions → results
    WellnessPanel.tsx     — Hydration tracker, break nudges, session timer
    Onboarding.tsx        — Class chip picker, name input
  page.tsx              — Gate: getProfile() → onboarding or dashboard
LEARNING.md             — Hackathon learning log (judged criterion)
```

---

## What makes this different

Most "AI tutor" submissions at this hackathon are chatbots with a nice UI on top. This one has **adaptive memory** — the system tracks which topics each student has scored below 60% across quiz attempts and surfaces them as urgent action items the moment they open the app. The AI mentor already knows your weak topics before you say a word. The quiz result isn't just a score — it's a visible before/after on a data model that persists across sessions.

---

*Built at First Commit Hackathon, Polaris School of Technology, Sep 19, 2026*
