# AGENTS.md

## Project goal

Build an MVP-first GPU simulation for exploring behavioral-economics-inspired agent decision models with TypeScript, WebGL2, and GLSL.

## Working principles

- Read only the files needed for the current task. Search before broad repository exploration.
- Prefer the smallest runnable change that tests the current hypothesis.
- Keep simulation/decision logic separate from rendering and UI.
- Treat WebGL2/GLSL as the simulation engine; keep deterministic validation and orchestration in TypeScript where practical.
- Do not add frameworks, abstractions, state libraries, or infrastructure solely for possible future use.
- When a second implementation creates real duplication, extract a shared interface then.
- Preserve reproducibility: prefer fixed seeds and explicit parameters.
- Distinguish a theory-faithful model from a behavioral-economics-inspired heuristic. Do not claim academic fidelity without verified sources.
- For bugs: reproduce → identify evidence → fix → run the smallest relevant regression test.
- Explain design trade-offs briefly; avoid repeating repository documentation.

## Initial implementation order

1. Conway baseline
2. GPU ping-pong state update
3. Prospect Theory / Loss Aversion experiment
4. Herding / Conformity experiment
5. Additional models only after the first experiments are measurable

## Definition of done

A model change should have:
- explicit inputs, outputs, and parameters;
- documented operationalization of the behavioral concept;
- deterministic or seeded reproduction where applicable;
- a minimal validation method;
- no unnecessary coupling to rendering.
