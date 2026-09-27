# アーキテクチャ

## 目的

行動モデルと描画処理を分離しながら、GPU上でCellular Automata（セル・オートマトン）およびAgent Simulation（エージェント・シミュレーション）を実行できる最小構成を作ります。

## MVPのデータフロー

```text
UI / Controls（操作・パラメータ）
      ↓
Simulation Controller（TypeScript）
      ↓
Behavior Parameters（行動モデルのパラメータ）
      ↓
Simulation Shader（GLSL）
      ↓
Ping-Pong Texture State（GPU状態）
      ↓
Render Shader（GLSL）
      ↓
Canvas
```

## 責務

### UI / Controls

開始、停止、リセット、速度、Seed（乱数シード）、行動モデルのパラメータを扱います。

モデルの数式や意思決定ロジックはUIへ入れません。

### Simulation Controller

TypeScript側で以下を管理します。

- WebGLのライフサイクル
- Generation（世代）の更新
- Uniform
- Framebufferの切り替え
- Reset / Seed
- Metrics（測定値）

### Behavior / Decision Model

観測可能な状態から、Subjective Value（主観的価値）やAction Signal（行動シグナル）を計算する責務です。

MVPでは、専用Simulation ShaderとTypeScriptの型付きパラメータで十分です。最初から汎用Plugin Frameworkは作りません。

### Simulation Shader

前世代のTextureと近傍セルを読み、現在の意思決定・状態遷移ルールを適用して次世代を書き込みます。

### Ping-Pong State

2枚のTexture / FramebufferをReadとWriteで交互に使用します。

同じSimulation Stepで同じTextureを読み書きしない構成にします。

### Render Shader

Simulation State（シミュレーション状態）を画面上のPixelへ変換します。

行動モデルや状態遷移ロジックはRender Shaderへ入れません。

## State設計

最初はConwayに必要な最小状態だけを持ちます。

将来的には例えば次のようなTexture Channel利用が考えられます。

```text
R: alive / action state
G: resource / outcome
B: reference / memory
A: reserved
```

ただし、これは将来の候補であり、最初からこの構造へ固定しません。実験で必要になった状態だけ追加します。

## 再現性

実験では最低限、以下を記録します。

- 初期Seed
- Grid Size
- Model Parameters
- Generation Count
- Metrics

可能な限り決定論的な状態遷移を優先します。

確率的な意思決定が必要な場合は、Seed + Cell Coordinate + Generationから再現可能なPseudo Random（疑似乱数）を生成します。

## MVP Metrics

まず測定するものは以下です。

- Generation
- Alive / Population Ratio（生存・人口比率）
- Turnover（1世代あたりの状態変化率）

Cluster Size、Entropy、Spatial Autocorrelation、Utilityなどは、具体的な実験で必要になってから追加します。

## 発展順序

```text
Conway baseline
→ GPU Ping-Pong Simulation
→ 基準Metrics
→ Prospect / Loss Aversion実験
→ Herding実験
→ 重複が確認された場合のみ共通Model Interfaceを抽出
```

## MVPではやらないこと

- WebGPU移行
- Three.js導入
- Backend Service
- Database
- MCP Server
- 汎用Agent Framework
- 分散シミュレーション

将来必要になる可能性だけを理由に追加しません。
