# 11 - Architectural Risks and Technical Debt (0xCARTO Analysis)

## Context
During the 0xCARTO Mycelial Ingestion Protocol (DRP-2026-CARTO-0.0.1) traversal, several structural deficits and unmanaged entropy vectors were identified in the AuthorForge AI repository. This ADR documents these findings to prevent them from becoming permanently calcified "Petrified Intentions" (QP14).

## Decision
We formally acknowledge and document the structural risks discovered during the 0xCARTO traversal. We categorize them according to the 0xCARTO Lenses (L1-L5) and set immediate requirements for future iterations to rectify them, ensuring the repository moves toward a zero-entropy state.

## Identified Risks & Debts

### 1. Phantom Test Infrastructure (L3 Thermodynamic Entropy)
*   **Observation (QP15/QP02):** The repository defines tests (e.g., `services/viperService.test.ts`), and testing libraries (`vitest`) are listed in `package.json`. However, there is **no automated CI/CD pipeline** (no `.github/workflows/` directory) to execute these tests on push or pull request.
*   **Risk:** Tests are entirely reliant on manual developer execution. This is a severe "Phantom Documentation Delta" where the codebase implies tests are passing, but there is no ground-truth automation enforcing it. This violates the 'Fix Until Green' autonomic loop.
*   **Resolution Requirement:** Implement GitHub Actions (or equivalent) to enforce the testing layer deterministically.

### 2. SILENT_REQUIRED_ENV Variables (L1 Epistemic Graph Theory)
*   **Observation (QP03/QP12):** The application requires `API_KEY` and `GEMINI_API_KEY` in the environment to function. Prior to this analysis, there was no `.env.example` file communicating these requirements.
*   **Risk:** This creates a "Hidden Boot Requirement" and "Operator Knowledge Trap." New developers or deployment environments will silently fail without tribal knowledge of the required parameters.
*   **Resolution:** (Resolved) A `.env.example` file has been added explicitly detailing the required keys.

### 3. Orphaned/Missing Infrastructure and Deployment Layer (L1/L2)
*   **Observation (QP08/QP18):** There are no IaC (Infrastructure as Code) templates (e.g., Terraform, Dockerfile, docker-compose.yml) and no deployment workflows.
*   **Risk:** Deployment is entirely manual and undocumented. This creates an "Implicit Build Knowledge" bottleneck.
*   **Resolution Requirement:** Define the production environment topologically (e.g., via Docker) and automate the deployment pipeline to eliminate manual operator traps.

### 4. Dependency Entropy (L3 Thermodynamic Entropy)
*   **Observation (QP09):** The `package.json` file uses unpinned ranges (e.g., `^19.2.0`, `^6.2.0`). While a `package-lock.json` is present, the loose semver definitions in `package.json` introduce long-term drift risk.
*   **Risk:** "Non-Deterministic Build Risk" if the lockfile is ever lost or ignored during an install.
*   **Resolution Requirement:** Move towards stricter dependency pinning or automated dependency update/validation mechanisms in the (yet to be created) CI pipeline.

## Consequences
*   The system's current "Ground Truth Isomorphism" is low due to the missing CI and deployment automations.
*   Until CI/CD is implemented, all test passing claims are contingent on manual adherence, violating SCOS deterministic requirements.
