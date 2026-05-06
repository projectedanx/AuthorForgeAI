# VULCAN Integration Checklist

## 1. Domain Modeling Verification
- [ ] `VSAHypervector` interface is rigorously defined in `types.ts`.
- [ ] `SymbolicScar` interface includes `scarId`, `pattern`, `betti1`, and `fipiVector` definitions.
- [ ] `JustifiedUncertaintyReport` type accurately captures violated constraints and corrective proposals.

## 2. DRP-LEXICON-992 Standard Compliance
- [ ] `VulcanTopologyValidator` implements the core VSA Scar Archive.
- [ ] **Mereological Mandate:** Ensure no transitivity of state/network access is implied in the generated outputs (`+++MereologyRoute(relation_type="Component-Object", transitivity_check=true)`).
- [ ] **Shared Database Anathema:** Test that queries implying shared schemas trigger `SCAR-002` and `+++AutonymicIsolate(forbidden_content=["shared_database_pattern"])`.
- [ ] **Bricolage Lens:** Ensure `+++AdjectivalBound(max=0)` logic is present to strip hype words ("cloud-native", "scalable") from prompts if complexity is unwarranted.

## 3. Circuit Breaker Testing (EpistemicEscrow)
- [ ] Write a test/simulate an input designed to violate CAP Theorem (e.g., demanding perfect consistency and availability during partition).
- [ ] Verify `assessIntentTopology` calculates CFDI > 0.15 for this input.
- [ ] Verify `EpistemicEscrow` throws `TopologyViolationError`.
- [ ] Ensure the generative pipeline halts immediately (no API calls to Gemini).
- [ ] Confirm the UI surfaces the `JustifiedUncertaintyReport` clearly to the user.

## 4. Failure-Informed Prompt Inversion (FIPI)
- [ ] Simulate an input triggering `SCAR-001` (Distributed Monolith).
- [ ] Verify `assessIntentTopology` returns the correct `pdlDecorators` for `SCAR-001`.
- [ ] Inspect the final prompt sent to Gemini (via `console.log` or test mocks) to confirm decorators are accurately prepended before submission.

## 5. Build & Code Quality
- [ ] TypeScript compiles without errors (`npm run build`).
- [ ] Linter passes without warnings.
- [ ] Code strictly follows project standards (no "vibe coding").
- [ ] `docs/LESSONS_LEARNED.md` updated with the architecture inversion strategy.
- [ ] `README.md` updated to reflect the presence of the SCOS framework and VULCAN node.
