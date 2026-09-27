# Architecture

## Objective

Provide the smallest architecture that can run GPU cellular/agent simulations while allowing behavioral decision rules to evolve independently from visualization.

## MVP data flow

```text
UI / Controls
      ↓
Simulation Controller (TypeScript)
      ↓
Behavior Parameters
      ↓
Simulation Shader (GLSL)
      ↓
Ping-Pong Texture State
      ↓
Render Shader (GLSL)
      ↓
Canvas
```

## Responsibilities

### UI / Controls

Start, stop, reset, simulation speed, seed, and behavioral-model parameters. The UI must not contain model equations.

### Simulation Controller

Owns WebGL lifecycle, frame/generation stepping, uniforms, framebuffer swaps, reset/seed handling, and metrics collection.

### Behavior / Decision Model

Defines how observable state becomes subjective value or an action signal. For the MVP this may live inside a focused simulation shader plus typed TypeScript parameter definitions. Do not build a plugin framework yet.

### Simulation Shader

Reads the previous state texture and neighborhood, applies the current transition/decision rule, and writes the next state.

### Ping-Pong State

Two textures/framebuffers alternate between read and write roles. State updates never read and write the same texture in one simulation step.

### Render Shader

Maps simulation state to pixels. It must not change the behavioral state or contain decision rules.

## State

Begin with the minimum state required by Conway. Add additional channels only when a behavioral experiment requires them.

Possible later encoding:

```text
R: alive / action state
G: resource or outcome
B: reference / memory
A: reserved
```

This is not an upfront commitment; validate each additional channel against an experiment.

## Reproducibility

Experiments should record:
- initial seed;
- grid size;
- model parameters;
- generation count;
- relevant metrics.

Prefer deterministic transitions. If stochastic choice is introduced, derive pseudo-randomness from explicit seed + cell coordinate + generation.

## Metrics

MVP:
- generation;
- alive/population ratio;
- turnover (state changes per generation).

Add clustering, entropy, spatial autocorrelation, or utility metrics only when needed to answer a concrete experiment question.

## Evolution path

```text
Conway baseline
→ ping-pong GPU simulation
→ measurable baseline metrics
→ Prospect/Loss Aversion experiment
→ Herding experiment
→ extract shared model interface only if duplication appears
```

## Non-goals for the MVP

- WebGPU migration
- Three.js abstraction
- backend service
- database
- MCP server
- generalized agent framework
- production-scale distributed simulation
