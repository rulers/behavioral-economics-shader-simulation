# Life Game GPU

WebGL2 + GLSLでConway's Game of LifeをGPU実行するための実装ディレクトリです。

既存の `lifegame-simple/` はCPU / Canvas 2DによるReference Implementation（参照実装）として残し、このGPU版の状態遷移が正しいことを比較検証するために利用します。

## 目的

最初の目的は高速化そのものではありません。

この実装を通して、以下を段階的に構築・理解します。

- WebGL2の初期化
- TextureをSimulation State（シミュレーション状態）として扱う方法
- Fragment Shaderによるセル単位の状態遷移
- Ping-Pong Texture / Framebuffer
- Simulation ShaderとRender Shaderの責務分離
- CPU版とGPU版の再現可能な比較

最終的には、このGPU基盤の上へ行動経済学のDecision Model（意思決定モデル）を追加します。

## 位置づけ

```text
lifegame-simple/
CPU / JavaScript
      ↓
Conway B3/S23
      ↓
Canvas 2D
      ↓
Reference Implementation

lifegame-gpu/
GPU / WebGL2
      ↓
Simulation Shader
      ↓
Ping-Pong Texture
      ↓
Render Shader
      ↓
Behavioral Model experiments
```

CPU版を削除・置換するのではなく、GPU版のRegression Test（回帰確認）の基準として利用します。

## MVPアーキテクチャ

```text
UI / Controls
      ↓
Simulation Controller (JavaScript / TypeScript)
      ↓
WebGL2
      ↓
State Texture A
      ↓
Simulation Fragment Shader
      ↓
State Texture B
      ↓
A / B swap
      ↓
Render Fragment Shader
      ↓
Canvas
```

### Simulation Shader

Conway B3/S23の状態遷移を担当します。

各Fragmentは基本的に1セルを担当し、前世代Textureから自身と8近傍を読み取って次状態を出力します。

### Ping-Pong Texture

同一Textureを1ステップ内で読み書きせず、2枚のTextureを交互に利用します。

```text
Generation N

Texture A (read)
    ↓
Simulation Shader
    ↓
Texture B (write)

Generation N + 1

Texture B (read)
    ↓
Simulation Shader
    ↓
Texture A (write)
```

### Render Shader

Simulation Stateを画面へ描画するだけにします。

Conwayルールや将来の行動経済学モデルをRender Shaderへ入れません。

## 実装ステップ

### Step 1 — WebGL2 Canvas

- WebGL2 Contextを取得
- Fullscreen Quadを描画
- 最小Vertex / Fragment Shaderを動かす

### Step 2 — State Texture

- 60 × 36のセル状態をTextureへ格納
- CPU側から初期状態をUpload
- NEAREST samplingを利用

### Step 3 — Conway Simulation Shader

Fragment ShaderへB3/S23を実装します。

```text
Birth:    dead + 3 neighbors
Survival: alive + 2 or 3 neighbors
Death:    otherwise
```

境界条件はCPU版と合わせ、盤外を死亡として扱います。

### Step 4 — Ping-Pong

Texture / Framebufferを2組用意し、GenerationごとにRead / Writeを交換します。

### Step 5 — CPU / GPU比較

同じPresetを利用し、複数Generation後の盤面がCPU版と一致することを確認します。

最低限:

- BlockなどのStill Life
- BlinkerなどのOscillator
- Glider
- R-pentomino

### Step 6 — Reproducible Random

`Math.random()` 依存を避け、明示的なSeedから同じ初期状態を生成できるようにします。

CPU版とGPU版へ同じ初期盤面を入力できる状態を目標にします。

### Step 7 — Behavioral Model

Conway GPU baselineが検証できてから、以下へ進みます。

1. Prospect Theory / Loss Aversion
2. Herding / Conformity
3. Reference Dependence
4. Probability Weighting

## 検証項目

GPU版の完了条件:

- Conway B3/S23がCPU版と一致する
- 境界条件がCPU版と一致する
- Ping-Pong更新でRead / Writeが混在しない
- 同一初期状態から同一結果を再現できる
- SimulationとRenderingが分離されている
- GenerationとPopulationを取得できる

見た目が正しそうであることだけを検証結果にはしません。

## 実装方針

MVPでは以下を導入しません。

- WebGPU
- Three.js
- 汎用Shader Framework
- 汎用Agent Plugin System
- Backend
- Database
- MCP

まずWebGL2 / GLSLを直接扱い、GPU Simulationの仕組みを理解できる小さな実装を優先します。

## 関連ドキュメント

- [Architecture](../docs/architecture.md)
- [アーキテクチャ日本語版](../docs/ja/architecture.md)
- [Prospect Theory / Loss Aversion](../docs/models/prospect-theory.md)
- [プロスペクト理論 / 損失回避 日本語版](../docs/ja/models/prospect-theory.md)

## 次の作業

最初の実装は **Step 1 — WebGL2 Canvas** です。

この時点ではConwayルールまで実装せず、

1. WebGL2 Context取得
2. Shader compile / link
3. Fullscreen描画

までを動作確認します。
