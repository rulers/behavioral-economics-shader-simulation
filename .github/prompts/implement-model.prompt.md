---
description: Implement one behavioral decision model as a minimal reproducible simulation experiment.
---

Implement the requested behavioral model using the repository's existing architecture.

Before editing:
1. Read `AGENTS.md`, `.github/copilot-instructions.md`, `docs/architecture.md`, and the relevant `docs/models/<model>.md`.
2. Inspect only the implementation files needed for this model.
3. State the operationalization: what simulation state corresponds to the theory's inputs, reference point, utility/value, and resulting action.

Implementation rules:
- Build the smallest runnable experiment.
- Reuse the Conway/WebGL2 baseline rather than introducing a new engine.
- Keep behavioral logic separate from rendering.
- Expose only parameters needed to test the hypothesis.
- Prefer deterministic transitions; if randomness is necessary, use a fixed/explicit seed.
- Do not introduce a generic model framework unless existing implementations already require it.
- Clearly label any theory-inspired simplification.

Validation:
- Add the smallest appropriate test or numerical check.
- Compare a neutral/baseline parameter setting against the behavioral setting.
- Report what changed, what was tested, and any remaining fidelity limitations.

When uncertain about an academic formula or parameter, do not invent certainty. Mark it for source verification.
