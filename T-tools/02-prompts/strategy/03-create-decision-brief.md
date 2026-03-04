# Prompt: Create a Strategic Decision Brief

Copy and paste this into your chat (fill in your decision first):

---

```
I need to make a strategic decision. Here's what I'm facing:

---
Decision: [What decision do you need to make?]

Options I'm considering:
- Option A: [describe]
- Option B: [describe]
- Option C (optional): [describe]

Context: [Why is this decision coming up now? What's the timeline?]

What's at stake: [What happens if we get this wrong?]
---

Please follow this process:

1. Pre-flight check: Read C-core/project-brief.md, C-core/voice-dna.md, and C-core/icp-profile.md. If any of these files are empty or still have placeholder text, STOP and tell me which files need to be filled first.

2. Read the workflow in T-tools/03-workflows/strategic-decision-workflow.md to understand the full process

3. Read my business context (already loaded from step 1):
   - C-core/project-brief.md
   - C-core/voice-dna.md
   - C-core/icp-profile.md
   - B-brain/02-writing-samples/ (check all subfolders — read whatever samples are available)

4. Read the Strategic Decision skill: T-tools/01-skills/strategic-decision-skill/strategic-decision-skill.md

5. Read past decisions and learnings: M-memory/decisions.md and M-memory/learning-log.md

6. Now work as the Strategist (read A-agents/strategist-agent.md first):
   - Analyze each option from a business and growth perspective
   - Evaluate market implications, resource needs, competitive impact
   - Include the "do nothing" option
   - Produce a clear recommendation with reasoning
   - Create a new folder in O-output/ with the next available number (e.g., 01-strategy-[topic])
   - Save your analysis as strategist-analysis.md

7. Then work as the Devil's Advocate (read A-agents/devils-advocate-agent.md first):
   - Read the Strategist's analysis you just created
   - Challenge every major assumption
   - Identify risks the Strategist missed or downplayed
   - Propose at least one alternative nobody mentioned
   - Run a pre-mortem: if this fails in 12 months, what went wrong?
   - Ask one Hard Question the decision-maker needs to answer
   - Save as devils-advocate-review.md

8. Then work as the Chief of Staff (read A-agents/chief-of-staff-agent.md first):
   - Read both the Strategist and the Devil's Advocate
   - Synthesize into a single decision brief
   - Resolve conflicts between the two perspectives
   - Highlight where advisors agree (high confidence) vs. disagree (needs your judgment)
   - Produce a clear recommendation with confidence level
   - Save as chief-of-staff-brief.md

9. Then work as the Gatekeeper (read A-agents/gatekeeper-agent.md first):
   - Review the decision brief against quality standards
   - Check: Is the decision clearly framed? Are options fully explored? Are risks quantified? Is the recommendation justified? Are next steps actionable?
   - Save your review as gatekeeper-review.md
   - If approved, create final-decision-brief.md
   - If not approved, explain what needs to change and revise

10. Update M-memory/learning-log.md with what you learned from this process
    Update M-memory/decisions.md with this decision (even if not yet decided — log the analysis)

Show me the final decision brief and tell me if it's ready to use or needs revision.
```

---

> **© Tom Even**
> Workshops & future dates: [www.getagents.today](https://www.getagents.today)
> Newsletter: [www.agentsandme.com](https://www.agentsandme.com)
