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

## Local Development and Check

The simple Life Game is a static HTML/CSS/JavaScript app. It has no npm dependencies or build step; Python 3 is only needed to serve it locally.

Check that Python 3 is available:

```sh
python3 --version
```

From the repository root, start the local server:

```sh
sh simulator/lifegame-simple/run-local.sh
```

Open <http://127.0.0.1:8000/> in a browser to see the simulation list, then open the Life Game from there. To use a different port:

```sh
PORT=8080 sh simulator/lifegame-simple/run-local.sh
```

Then open <http://127.0.0.1:8080/>. Press `Ctrl+C` in the terminal to stop the server. Check the app by opening it from the list, placing cells on the board, advancing one generation, starting and pausing playback, changing the speed, generating a random board, and clearing it. No automated test runner is configured for this standalone app.

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
