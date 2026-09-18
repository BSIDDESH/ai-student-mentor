# LEARNING.md
# AI Student Life Mentor — Hackathon Learning Log
# First Commit Hackathon · Sep 17–20, 2026
# Add 2 lines at the end of every work block. Specifics, not sentiment.
# These are free points in the Learning criterion — don't skip this.

---

## Thursday 17 Sep — Day 1 (Setup + Foundation)

**Block B — lib foundation (types, mocks, api, helpers)**
- Learned that a per-endpoint USE_MOCKS object (not a single boolean) lets you flip one route live at a time, so backend and frontend can integrate without coordinating a big-bang switch.
- Learned to add artificial `sleep()` delays in mock calls — this forces you to build real loading states on Day 1, so real API latency on Friday doesn't expose missing skeletons.

**Block C — Dashboard Shell & Adaptive Visual Identity**
- Learned to drive time-of-day themes (Day Arc) from device clock without hydration mismatches, giving the app life before any student interaction.
- Discovered that styling weak-topic warnings with distinct silhouettes and rose drop shadows creates visual urgency that draws focus compared to neutral status cards.

**Block D — Mentor Chat**
- Learned that seeding starter prompts directly from client-computed weak topics establishes the "adaptive memory" value proposition immediately upon opening chat.
- Kept 10-turn message history with an active typing indicator to accommodate Bedrock latency without feeling unresponsive.

**Block E — Quiz Flow & Count-Up Animation**
- Discovered that driving both the progress bar width and the score text from a single requestAnimationFrame cubic-eased hook ensures smooth 45% -> 68% animation without layout desync.
- Immediate per-question feedback with explanation banners creates a continuous learning loop rather than an exam-like waiting experience.

**Block F — Onboarding & Wellness Panel**
- Built class-band selection with 10 tappable chips instead of a dropdown, drastically reducing time-to-onboard and making class level visually tangible on mobile touchscreens.
- Implemented study timers with non-blocking dismissible break nudges and glass-by-glass hydration tracking that automatically triggers daily goal progress.
