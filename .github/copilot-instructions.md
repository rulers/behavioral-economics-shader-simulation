# Copilot repository instructions

This repository is an experimental TypeScript + WebGL2 + GLSL simulation project.

## Priorities

1. Correctness and reproducibility.
2. Small, testable MVP increments.
3. Clear separation of responsibilities.
4. Minimal dependencies and abstractions.
5. Performance optimization only after a measurable need.

## Repository exploration

- Do not read the entire repository by default.
- Start from the requested feature, error, changed files, or referenced documentation.
- Use targeted search to locate symbols and dependencies.
- Expand the search only when evidence requires it.

## Architecture

Keep these concerns separate:

```text
UI / Controls
    ↓
Application / Simulation orchestration
    ↓
Behavior / Decision model
    ↓
WebGL2 state transition
    ↓
GPU textures / framebuffer
    ↓
Render shader
```

Rendering must not define behavioral rules.

## Behavioral models

Before implementing a model:
- read its file under `docs/models/`;
- identify the state variables and reference point;
- define how theoretical quantities map to simulation quantities;
- label simplifications explicitly;
- avoid presenting an ad-hoc transition rule as canonical behavioral economics.

Prefer uniforms/configuration for a small number of model parameters. Avoid a generalized plugin framework until at least two working models demonstrate the need.

## GLSL

- Keep simulation and render fragment shaders separate.
- Use nearest-neighbor texture sampling for discrete cell state unless the model explicitly needs interpolation.
- Make boundary behavior explicit.
- Avoid hidden randomness. If randomness is needed, make it reproducible from a seed.
- Keep shader branching understandable before attempting micro-optimization.

## TypeScript

Use TypeScript for WebGL setup, lifecycle, parameter validation, experiment configuration, metrics, and deterministic rules that do not benefit from GPU execution.

## Testing

Select tests according to risk:
- pure decision/value functions: unit tests;
- WebGL state transitions: focused integration tests where practical;
- bugs: reproduction test first when feasible;
- visual behavior: supplement, never replace, deterministic numerical checks.

Do not add broad test infrastructure before there is behavior worth testing.
