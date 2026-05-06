<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KQABwy4TVJpneINMep7_4f8YMyw8u36g

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Features
- **Tier 3 Autonomy (VULCAN SCOS Node)**: Integrates the Sovereign Cognitive Operating System (SCOS). VULCAN validates architectural intent and applies Failure-Informed Prompt Inversion (FIPI) using Cognitive Bytecode to prevent structural regressions like Shared Databases or Distributed Monoliths. It acts as an Epistemic Escrow, halting impossible requests (e.g. CAP Theorem violations) before they reach the generative layer.
- **Niche Validation**: Analyze a topic to find profitable niches, trending topics, keywords, and unique angles.
- **Outline Generation & CMDA Refinement**: Automatically generate a comprehensive book outline based on a validated topic. Apply Context-Mediated Domain Adaptation (CMDA) to inject human contradictory constraints while maintaining architectural rigor.
- **VIPER Conceptualization**: Implementation plans and strategies have been drafted in `viper_emergence_planning/` for integrating the Visual Intent & Physical Execution Router (V.I.P.E.R) agent, enforcing exact physical realism against ambiguous visual prompts.
