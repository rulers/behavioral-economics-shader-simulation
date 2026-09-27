# Prospect Theory / Loss Aversion

## Status

First behavioral experiment candidate.

## Theory boundary

Prospect Theory is broader than a loss-aversion value function. The first MVP intentionally implements only a simplified value/reference-dependent experiment unless probability weighting is explicitly added later.

Do not label the MVP as a complete Prospect Theory implementation.

## Core value function

A common parameterization is:

```text
v(x) = x^alpha                    if x >= 0
v(x) = -lambda * (-x)^beta       if x < 0
```

where:
- `x` is an outcome relative to a reference point;
- `alpha` and `beta` control curvature;
- `lambda` controls loss aversion.

Exact formula choice and parameter values must be source-verified before claiming academic fidelity.

## Simulation operationalization

The formula alone does not define agent behavior. The experiment must define:

```text
observable outcome
      ↓
reference point
      ↓
delta = outcome - reference
      ↓
subjective value v(delta)
      ↓
transition / action
```

### MVP proposal

Use Conway as the baseline environment.

Candidate mapping:
- outcome: local neighborhood condition or resource signal;
- reference point: previous-generation value or local expected value;
- delta: outcome minus reference;
- subjective value: loss-aversion function;
- action: modify a survival/birth threshold or continuous action signal.

Choose one mapping and document it before coding. Do not silently combine multiple interpretations.

## Parameters

Start with:
- `lambda`: loss-aversion coefficient;
- `alpha`: gain curvature;
- `beta`: loss curvature.

Use `lambda = 1` as a useful neutral comparison where losses and gains receive symmetric scaling, while noting that curvature may still make the model nonlinear.

## GLSL seed

```glsl
float subjectiveValue(float delta, float alpha, float beta, float lambda) {
    return delta >= 0.0
        ? pow(delta, alpha)
        : -lambda * pow(-delta, beta);
}
```

This function is an implementation seed, not a complete agent policy.

## First experiment

Compare identical seeded initial states under:
- baseline/neutral loss scaling;
- higher `lambda`.

Measure at minimum:
- population ratio;
- turnover.

The useful result is not a visually interesting pattern by itself, but a reproducible difference attributable to the parameter change.

## Validation

- `v(0) == 0`
- positive delta produces positive value;
- negative delta produces negative value;
- increasing `lambda` increases the magnitude of negative value without changing positive value;
- same seed + same parameters produces the same trajectory.

## Open questions

- What exactly is the agent's outcome?
- What is the reference point?
- How does subjective value alter a discrete transition?
- Should the model remain deterministic or introduce stochastic choice?
- Which academic source/parameterization will define the theory-faithful version?
