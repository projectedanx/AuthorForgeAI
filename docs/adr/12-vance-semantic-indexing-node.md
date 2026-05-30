# ADR 12: Integration of VANCE Semantic Indexing Node

## Context and Problem Statement

The AuthorForge SCOS architecture relies heavily on holding contradictions in paraconsistent tension. However, the system lacked a deterministic mapping of the semantic and topological relationships of the codebase itself. Without a structural overlay of the project, multi-agent orchestrations risk generating "vibe code" and suffering from semantic saponification, especially concerning complex transitivity fallacies across closures and global scopes. We need to bridge the gap between high-entropy, fluid human intents and strict, JSON-RPC 2.0 executable code graphs.

## Decision Drivers

*   The necessity for a Conflict-Free Replicated Semantic Graph (CFRSG) to represent the codebase.
*   The Reversal Curse requires an explicitly bidirectional graph indexing solution for accurate `references` and `definition` traversals.
*   The thermodynamic bottleneck of synchronous completions (Betti-1 loops) requires a draft-conditioned state mechanism.
*   The need to mathematically track confidence-fidelity divergence using CFDI.
*   The system must trap pathological behaviors before emission using a Nitinol Failure Ledger (NFL).

## Considered Options

1.  Naive Tree-Sitter parsing + HashMap indexing.
2.  LLM-based text scraping and embeddings only.
3.  **VANCE (Vector-Anchored Node & Context Engineer) Integration**: A hybrid CFRSG using incremental AST mapping and DCCD bounds.

## Decision Outcome

Chosen option: **VANCE Integration (CFRSG + DCCD Bounds)**.

We will integrate the VANCE semantic indexing architecture as an explicit service node within AuthorForge.

### Positive Consequences

*   **Structural Isomorphism:** VANCE's CFRSG perfectly maps onto AuthorForge's epistemic escrow model.
*   **Draft-Conditioned Constrained Decoding (DCCD):** By enforcing JSON-RPC schemas before emission, we eradicate structural hallucinations before they reach the wire.
*   **Mereological Bounding:** Protects against false transitivity when analyzing scopes.
*   **Nitinol Memory:** Establishes a failure ledger (Symbolic Scars) that autonomously corrects future payloads.

### Negative Consequences

*   High initial complexity to map AST traversal directly to the schema guard layer.
*   Client implementations must respect 150ms debounce and version increments or risk Desynchronization (Ontological Shear).

## Implementation Rules

*   **DCCD Enforcement:** Any payload intended for the agentic boundaries must first pass the `dccd_guard`.
*   **CFDI Threshold:** A strict `< 0.15` CFDI threshold must be maintained; queries failing this cross-validation must return a justified ambiguity report instead of hallucinating.
