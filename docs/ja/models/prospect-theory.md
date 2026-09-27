# プロスペクト理論 / 損失回避

## ステータス

最初の行動モデル実験候補です。

## 理論上の境界

Prospect Theory（プロスペクト理論）は、単なるLoss Aversion（損失回避）の価値関数より広い理論です。

最初のMVPでは、Reference Dependence（参照点依存）とLoss Aversionを中心とした簡略モデルを実装します。Probability Weighting（確率加重）まで実装していない段階で、完全なプロスペクト理論の実装とは扱いません。

## 基本価値関数

代表的な形式の一つとして次を利用できます。

```text
v(x) = x^alpha                    x >= 0
v(x) = -lambda * (-x)^beta       x < 0
```

- `x`: 参照点から見た結果
- `alpha`: 利得側の曲率
- `beta`: 損失側の曲率
- `lambda`: 損失回避の強さ

学術的に忠実な実装とする場合、採用する式とパラメータは原典・研究文献で確認します。

## Simulationへの変換

価値関数だけではAgent Behavior（エージェント行動）は決まりません。

次の対応関係を明示する必要があります。

```text
観測されたOutcome（結果）
      ↓
Reference Point（参照点）
      ↓
delta = outcome - reference
      ↓
Subjective Value（主観的価値）
      ↓
Transition / Action（状態遷移・行動）
```

## MVP案

Conwayを基準環境として利用します。

候補:

- Outcome: 近傍状態またはResource Signal
- Reference Point: 前世代値または局所期待値
- Delta: Outcome - Reference
- Subjective Value: 損失回避価値関数
- Action: 生存・誕生Thresholdまたは連続的Action Signalへ反映

実装前に、この中から一つの意味付けを選びます。複数の解釈を暗黙に混在させません。

## パラメータ

最初は以下だけを扱います。

- `lambda`: 損失回避係数
- `alpha`: 利得側曲率
- `beta`: 損失側曲率

比較実験では `lambda = 1` を損失と利得のScalingが対称な基準として利用できます。ただし、alpha / betaによる非線形性は別途存在します。

## GLSL実装起点

```glsl
float subjectiveValue(float delta, float alpha, float beta, float lambda) {
    return delta >= 0.0
        ? pow(delta, alpha)
        : -lambda * pow(-delta, beta);
}
```

これは価値関数の実装起点であり、Agent Policy全体ではありません。

## 最初の実験

同一Seedから以下を比較します。

- 中立的なLoss Scaling
- 高い `lambda`

最低限測定するもの:

- Population Ratio
- Turnover

見た目が面白いかではなく、パラメータ変更による差を再現可能に観測できることを優先します。

## 検証

- `v(0) == 0`
- 正のDelta → 正のValue
- 負のDelta → 負のValue
- lambdaを増加すると負側の絶対値だけが増加する
- 同一Seed + 同一Parameters → 同一Trajectory

## 未解決事項

- AgentにとってOutcomeとは何か
- Reference Pointを何にするか
- Subjective Valueを離散状態遷移へどう変換するか
- 確率的選択を導入するか
- Theory-faithful版でどの原典・パラメータを採用するか
