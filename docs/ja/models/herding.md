# 群集行動 / 同調

## ステータス

Conway基準実装と最初の損失回避実験が安定した後の、第2候補です。

## コンセプト

Agent自身のPrivate Signal（私的シグナル）だけではなく、周囲のAgentの行動・状態を観測して意思決定を変化させます。

MVPではHerding（群集行動）から着想したConformity Model（同調モデル）として扱います。単一の「行動経済学における標準公式」とは扱いません。

## 最小モデル

- `privateSignal`: Agent自身が選好する状態・行動
- `neighborMean`: 近傍Agent状態の正規化平均
- `c`: Conformity Strength（同調強度）、0〜1

```text
decisionSignal =
    (1 - c) * privateSignal
    + c * neighborMean
```

得られたDecision Signalを、明示的なThresholdなどのPolicyによって次状態へ変換します。

## Simulationへの変換

```text
Current Cell State
      + Neighborhood States
      ↓
Private Signal + Neighbor Mean
      ↓
Conformity Weighting
      ↓
Decision Signal
      ↓
Next State
```

最初の実験ではMemory、Network Topology、Reputation、Stochastic Imitationなどは追加しません。

単純なLocal Modelで仮説を検証できないと確認されてから追加します。

## パラメータ

最初は一つだけです。

- `conformity`

意味:

- `0.0`: Private Signalのみ
- `1.0`: Neighborhood Signalのみ

状態遷移にThresholdが必要な場合、それはSimulation Policyとして扱い、自動的に行動経済学理論の一部とはみなしません。

## GLSL実装起点

```glsl
float conformitySignal(
    float privateSignal,
    float neighborMean,
    float conformity
) {
    return mix(privateSignal, neighborMean, clamp(conformity, 0.0, 1.0));
}
```

## 最初の実験

同一Seedと同一Baseline Policyを利用し、例えば以下を比較します。

- conformity = 0.0
- 中程度
- conformity = 1.0

測定:

- Population Ratio
- Turnover
- 必要になった場合のみCluster Size

## 検証

- conformity = 0.0 → Private Signal
- conformity = 1.0 → Neighbor Mean
- 中間値 → 両Signalの間
- 同一Seed + 同一Parameters → 再現可能

## 未解決事項

- Conway由来の環境でPrivate Signalを何と定義するか
- Neighborhoodをどの範囲にするか
- ConformityがProbability、Utility、Thresholdのどれを変更するか
- Spatial ClusteringだけでHerdingを評価できるか、それとも別Metricsが必要か
