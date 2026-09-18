# 18. Personal Knowledge Corpus (PKC) Framework Integration

Date: 2024-05-25

## Status

Accepted

## Context

Traditional generative AI workflows operate as stateless machines, retrieving flattened statistical data and suffering from "hegemonic memory flattening" where internal weights override user-specific definitions. As the project involves a complex, multi-layered cognitive structure, treating our project documentation as a mere "bag of words" results in semantic drift and context erosion.

To formalize the human-AI interaction and ensure the prompt operates as a stateful, aligned cognitive processor, we need a mechanism to explicitly bind our structured text documents into a verifiable semantic contract.

## Decision

We are adopting the **Personal Knowledge Corpus (PKC) Framework**, guided by Context Engineering 2.0 Design.

We will achieve this through the following implementations:
1.  **Sovereign PKC YAML Schema Specification (`pkc_manifest.yml`)**: This file serves as a manifest that enforces strict boundaries on our personal library. It tracks the cryptographic hashing of source documents, sets neuro-symbolic boundaries via meaning space anchors, defines strict relational edges between notes, and maintains a Symbolic Scar Tissue Registry to track operational failures.
2.  **Git-Anchored Context Hashing Pipeline**: To avoid manual checksum verification, a `pre-commit` Git hook automatically scans the markdown nodes defined in `pkc_manifest.yml` and updates their SHA-256 hashes within the manifest.

## Consequences

*   **Positive:**
    *   **Trust-by-Design Versioning:** Local context files are cryptographically sealed with each commit, preventing silent semantic drift ("data drift").
    *   **Design by Contract:** The corpus now operates under a strict, dual-layer contract ensuring verifiable boundaries, reducing the risk of "hegemonic memory flattening."
    *   **Automated Validation:** Context integrity checks execute transparently during normal version control actions.
*   **Negative:**
    *   Adds a dependency on PyYAML for developers committing changes locally (must be installed to run the pre-commit hook).
    *   Introduces an additional configuration surface (`pkc_manifest.yml`) that must be maintained.
