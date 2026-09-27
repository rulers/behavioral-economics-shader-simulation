# Behavioral Economics Shader Simulation

GPU-accelerated agent simulations that translate behavioral economics models into executable decision rules using TypeScript, WebGL2, and GLSL.

## Goal

This project explores how behavioral economics models can be expressed as local agent rules and observed as emergent behavior in GPU-accelerated simulations.

The initial baseline is Conway's Game of Life. Behavioral models are introduced incrementally so their effects can be compared against a deterministic cellular automaton.

## Planned models

Initial implementation priority:

1. Prospect Theory / Loss Aversion
2. Herding / Conformity
3. Reference Dependence
4. Probability Weighting
5. Present Bias / Hyperbolic Discounting

Future candidates include anchoring, availability heuristic, representativeness, status quo bias, endowment effect, reciprocity, inequity aversion, and reinforcement learning.

## Architecture

```text
Simulation State
      ↓
Decision Model
      ↓
State Transition
      ↓
GPU Texture
      ↓
Render Shader
```

The simulation/decision logic is kept separate from rendering so behavioral models can be compared and replaced independently.

## MVP

- TypeScript
- WebGL2
- GLSL
- Conway's Game of Life baseline
- Ping-pong textures for GPU state updates
- Start / Stop / Reset
- Simulation speed control
- Parameter controls for behavioral models
- Fixed random seed for reproducible experiments
- Basic metrics such as generation, population, and clustering

## Documentation

The design notes and behavioral-model implementation backlog are maintained in Notion:

https://app.notion.com/p/3e8cb2f8131981a2b46ce16680678dc8?pvs=204

## Development approach

The project follows an MVP-first approach:

```text
Conway baseline
→ pluggable Decision Model
→ Loss Aversion
→ Herding / Conformity
→ additional behavioral models
→ experiment and visualization tooling
```

Mathematical definitions should be verified against appropriate primary or academic sources before treating an implementation as a faithful behavioral-economics model.

## License

MIT License. See [LICENSE](LICENSE).
