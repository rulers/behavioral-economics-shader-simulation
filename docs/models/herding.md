# Herding / Conformity

## Status

Second behavioral experiment candidate, after a stable Conway baseline and the first loss-aversion experiment.

## Concept

An agent's action is influenced by the observed actions or states of neighboring agents rather than only by its private signal.

The MVP treats this as a conformity model inspired by herding behavior. It should not be presented as a single canonical behavioral-economics equation.

## Minimal model

Let:
- `privateSignal` be the agent's own preferred action/state;
- `neighborMean` be the normalized mean state of its neighborhood;
- `c` be conformity strength in `[0, 1]`.

```text
decisionSignal =
    (1 - c) * privateSignal
    + c * neighborMean
```

Then convert `decisionSignal` into a state transition using an explicit threshold or another documented policy.

## Simulation operationalization

```text
current cell state
      + neighborhood states
      ↓
private signal + neighbor mean
      ↓
conformity weighting
      ↓
decision signal
      ↓
next state
```

For the first experiment, avoid memory, network topology, reputation, and stochastic imitation. Add them only if the simple local model cannot test the intended hypothesis.

## Parameters

Start with one parameter:
- `conformity`: `0.0` means private signal only; `1.0` means neighborhood signal only.

A threshold may be required by the state transition but should be treated as simulation policy, not automatically as part of the behavioral theory.

## GLSL seed

```glsl
float conformitySignal(
    float privateSignal,
    float neighborMean,
    float conformity
) {
    return mix(privateSignal, neighborMean, clamp(conformity, 0.0, 1.0));
}
```

## First experiment

Using the same seed and baseline transition policy, compare several conformity values such as:
- `0.0`;
- a moderate value;
- `1.0`.

Measure:
- population ratio;
- turnover;
- optionally cluster size only if the first two metrics cannot distinguish the behavior.

## Validation

- conformity `0.0` returns the private signal;
- conformity `1.0` returns the neighborhood mean;
- intermediate values remain between both signals;
- same seed + same parameters is reproducible.

## Open questions

- What represents the private signal in the Conway-derived environment?
- Which neighborhood definition is used?
- Does conformity modify a probability, utility, or direct state threshold?
- Is spatial clustering sufficient evidence of herding, or do we need a stronger metric?
