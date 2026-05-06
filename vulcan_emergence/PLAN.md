# VULCAN Implementation Plan

This plan outlines the steps to integrate the VULCAN Sovereign Cognitive Operating System (SCOS) framework into the existing AuthorForge AI pipeline, transitioning the application to Tier 3 Autonomy.

## 1. Domain Modeling & Type Definitions
**File:** `types.ts`
- Define the `VSAHypervector` and `SymbolicScar` interfaces.
- Define the `JustifiedUncertaintyReport` structure (for Epistemic Escrow).
- Expand `CMDARefinementResult` to include the `bettiNumber` and the injected `pdlDecorators`.

## 2. Implement the VULCAN Core Validator
**File:** `services/vulcanValidator.ts` (New File)
- **Component:** `VulcanTopologyValidator`
- **Functionality:**
  - Implement a mock Vector Symbolic Architecture (VSA) Scar Archive (e.g., `SCAR-001` to `SCAR-010`).
  - Create the `assessIntentTopology` method. This takes the user's raw input (niche topic) and compares it against the STA.
  - Implement **Failure-Informed Prompt Inversion (FIPI)**: If a scar is triggered (e.g., the user suggests a "distributed monolith" niche for a software book), prepend the necessary Cognitive Bytecode decorators (`+++MereologyRoute`, `+++AutonymicIsolate`) to the generative prompt.
  - Implement the **EpistemicEscrow** circuit breaker. Calculate a mock Confidence-Fidelity Divergence Index (CFDI). If > 0.15, throw a `TopologyViolationError`.

## 3. Invert the Generative Pipeline
**File:** `services/geminiService.ts`
- Import `VulcanTopologyValidator`.
- Modify `validateNiche` and `generateBookOutline`:
  - Before calling the Google GenAI model, pass the user input through `VulcanTopologyValidator.assessIntentTopology`.
  - Handle `TopologyViolationError` by returning the `JustifiedUncertaintyReport` instead of proceeding to generation.
  - If validation passes, inject the dynamically returned PDL decorators from VULCAN into the system instructions sent to Gemini, enforcing the topological constraints on the downstream generation.

## 4. UI Surfacing (The Epistemic Window)
**Files:** `components/NicheValidator.tsx`, `components/OutlineGenerator.tsx`
- Update error handling to catch and gracefully display the `JustifiedUncertaintyReport` when the EpistemicEscrow circuit breaker fires. This communicates VULCAN's architectural rejection directly to the human user.
- Visually indicate when FIPI (Failure-Informed Prompt Inversion) has modified the prompt by displaying the active PDL decorators in the UI (e.g., an "Active VULCAN Constraints" badge).

## 5. Document Cognitive Integration
**Files:** `README.md`, `docs/LESSONS_LEARNED.md`
- Document the shift to the SCOS architecture.
- Detail the integration of the AEW (Antifragile Epistemic Weaver) and the STA (Scar Tissue Archive) within the codebase.
