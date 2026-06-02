# 15 - CI/CD Pipeline and Infrastructure Automation Requirements

## Context and Problem Statement
The 0xCARTO Mycelial Ingestion Protocol (DRP-2026-CARTO-0.0.1) traversal revealed severe structural deficits within the AuthorForge AI repository: a complete absence of an automated CI/CD pipeline and Infrastructure-as-Code (IaC) definitions. Currently, the system relies on manual, biological developer invocation for testing (`vitest`) and deployment. This is a direct violation of the VORTEX "Fix Until Green" autonomic loop and introduces unacceptable levels of Thermodynamic Entropy (L3).

## Decision Drivers
*   **Topological Layer Inversion:** Base deterministic layers (Testing, CI/CD) MUST be established before generative capabilities are trusted.
*   **Eradication of Phantom Test Infrastructure:** Tests that are not automatically enforced on push/PR provide false confidence.
*   **Eradication of Implicit Build Knowledge:** Deployment must be mathematically documented in IaC, not held in human memory.

## Considered Options
1.  Maintain the status quo (manual testing and deployment).
2.  Implement rudimentary shell scripts for local testing prior to commit.
3.  **Implement a full CI/CD Pipeline (e.g., GitHub Actions) and IaC Definitions.**

## Decision Outcome
Chosen option: **Implement a full CI/CD Pipeline and IaC Definitions**.

We mandate the creation of a deterministic CI/CD pipeline to enforce the structural integrity of the SCOS node.

### Positive Consequences
*   **Zero-Entropy Extrusion:** Guarantees that no code merges into the main branch without passing the deterministic testing layer (`vitest`, `tsc --noEmit`).
*   **Ground Truth Isomorphism:** Aligning the codebase reality with the documentation's assertions.
*   **Enables Autonomic Agentic Loops:** A requirement for agents to autonomously iterate and verify their code ("Fix Until Green").

### Negative Consequences
*   Requires investment in DevOps engineering time.
*   Increases the friction of merging code, as all code must pass rigorous automated checks.

## Implementation Rules
*   A CI workflow (e.g., `.github/workflows/ci.yml`) must be created to execute `npm run test` and type checking on every PR and push to `main`.
*   A deployment workflow (e.g., `.github/workflows/deploy.yml`) must be created to handle automated builds.
*   Infrastructure requirements must be codified (e.g., via `Dockerfile` or `terraform`) to eliminate "Hidden Environmental Constraints."
