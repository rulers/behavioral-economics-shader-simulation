const columns = 60;
const rows = 36;
const canvas = document.querySelector('#field');
const context = canvas.getContext('2d');
const generationOutput = document.querySelector('#generation');
const populationOutput = document.querySelector('#population');
const toggleButton = document.querySelector('#toggle-button');
const toggleIcon = document.querySelector('#toggle-icon');
const toggleLabel = document.querySelector('#toggle-label');
const speedInput = document.querySelector('#speed');
const speedValue = document.querySelector('#speed-value');
const presetSelect = document.querySelector('#preset-select');
const presetDescription = document.querySelector('#preset-description');
const loadPresetButton = document.querySelector('#load-preset-button');

/** @typedef {boolean[][]} CellGrid 盤面の生死状態。 */
/** @typedef {{ x: number, y: number }} CellPosition 盤面上のセル座標。 */
/** @typedef {[number, number]} PatternPoint パターン内の列と行。 */

/** @type {CellGrid} */
let cells = Array.from({ length: rows }, () => Array(columns).fill(false));
let generation = 0;
let timer = null;
let isPainting = false;
let paintValue = true;

/** @typedef {{ width: number, height: number, points: PatternPoint[], description: string }} PatternPreset */

/** @type {Record<string, PatternPreset>} */
const presets = {
  glider: {
    width: 3,
    height: 3,
    points: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
    description: '5つのセルが斜め方向へ移動する、基本的なパターンです。',
  },
  'r-pentomino': {
    width: 3,
    height: 3,
    points: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
    description: '5セルから始まり、長い過渡状態のあいだ複雑な形へ広がります。',
  },
  'gosper-gun': {
    width: 36,
    height: 9,
    points: [
      [24, 0], [22, 1], [24, 1], [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3], [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
      [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5], [10, 6], [16, 6], [24, 6],
      [11, 7], [15, 7], [12, 8], [13, 8],
    ],
    description: '周期的にグライダーを発射し続ける、Gosperグライダー銃です。',
  },
  sierpinski: {
    width: 32,
    height: 32,
    points: createSierpinskiPoints(32),
    description: 'パスカル三角形の奇数項から作ったフラクタル形状の初期配置です。配置後は通常のLifeルールで変化します。',
  },
};

/**
 * パスカル三角形の奇数項をセルにしたSierpinski型の座標を作る。
 * @param {number} size 三角形の高さと幅。
 * @returns {CellPosition[]} 生存セルのローカル座標。
 */
function createSierpinskiPoints(size) {
  const points = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x <= y; x++) {
      if ((x & y) === x) points.push([x, y]);
    }
  }
  return points;
}

/**
 * 現在の盤面をCanvasに描画する。高密度ディスプレイでは解像度を補正し、セルとグリッドを表示する。
 * @returns {void}
 */
function draw() {
  const bounds = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(bounds.width * pixelRatio));
  const height = Math.max(1, Math.round(bounds.height * pixelRatio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // CSS上の座標を維持したまま、実ピクセルの解像度をピクセル比に合わせる。
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = '#e7eade';
  context.fillRect(0, 0, bounds.width, bounds.height);

  const cellWidth = bounds.width / columns;
  const cellHeight = bounds.height / rows;
  context.fillStyle = '#718342';
  cells.forEach((row, y) => row.forEach((alive, x) => {
    if (alive) context.fillRect(x * cellWidth + 1, y * cellHeight + 1, Math.max(1, cellWidth - 2), Math.max(1, cellHeight - 2));
  }));

  context.beginPath();
  context.strokeStyle = '#d2d7c9';
  context.lineWidth = 1 / pixelRatio;
  for (let x = 0; x <= columns; x++) {
    const position = Math.round(x * cellWidth) + 0.5 / pixelRatio;
    context.moveTo(position, 0);
    context.lineTo(position, bounds.height);
  }
  for (let y = 0; y <= rows; y++) {
    const position = Math.round(y * cellHeight) + 0.5 / pixelRatio;
    context.moveTo(0, position);
    context.lineTo(bounds.width, position);
  }
  context.stroke();
}

/**
 * 世代数と生存セル数を盤面上の表示に反映する。
 * @returns {void}
 */
function updateStats() {
  const population = cells.reduce((total, row) => total + row.filter(Boolean).length, 0);
  generationOutput.textContent = String(generation).padStart(4, '0');
  populationOutput.textContent = String(population);
}

/**
 * Conwayのルール（B3/S23）で全セルを同時に更新し、世代数と表示を進める。
 * 盤外は死亡セルとして扱う。
 * @returns {void}
 */
function nextGeneration() {
  const next = Array.from({ length: rows }, () => Array(columns).fill(false));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let neighbors = 0;
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          if (offsetX === 0 && offsetY === 0) continue;
          const neighborY = y + offsetY;
          const neighborX = x + offsetX;
          if (neighborY >= 0 && neighborY < rows && neighborX >= 0 && neighborX < columns && cells[neighborY][neighborX]) neighbors++;
        }
      }

      // 誕生は近傍3、生存は近傍2または3。
      next[y][x] = neighbors === 3 || (cells[y][x] && neighbors === 2);
    }
  }

  cells = next;
  generation++;
  updateStats();
  draw();
}

/**
 * 自動進行タイマーを停止し、再生ボタンの表示を戻す。
 * @returns {void}
 */
function stop() {
  window.clearInterval(timer);
  timer = null;
  toggleIcon.textContent = '▶';
  toggleLabel.textContent = '再生';
  toggleButton.setAttribute('aria-label', '再生');
}

/**
 * 盤面の自動進行を開始する。すでに進行中ならタイマーを重ねて作らない。
 * @returns {void}
 */
function start() {
  if (timer !== null) return;
  toggleIcon.textContent = 'Ⅱ';
  toggleLabel.textContent = '一時停止';
  toggleButton.setAttribute('aria-label', '一時停止');
  timer = window.setInterval(nextGeneration, 1100 - Number(speedInput.value) * 100);
}

/**
 * ポインターの画面座標を盤面上のセル座標に変換する。
 * @param {PointerEvent} event Canvas上のポインターイベント。
 * @returns {CellPosition} 対応するセルの列と行。
 */
function getCellFromPointer(event) {
  const bounds = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - bounds.left) / bounds.width * columns);
  const y = Math.floor((event.clientY - bounds.top) / bounds.height * rows);
  return { x, y };
}

/**
 * ポインター位置のセルを指定状態にし、人口表示と盤面を更新する。
 * @param {PointerEvent} event Canvas上のポインターイベント。
 * @returns {void}
 */
function paint(event) {
  const { x, y } = getCellFromPointer(event);
  if (x < 0 || x >= columns || y < 0 || y >= rows || cells[y][x] === paintValue) return;
  cells[y][x] = paintValue;
  updateStats();
  draw();
}

/**
 * 選択中のパターンを盤面中央に配置し、自動進行と世代数をリセットする。
 * @returns {void}
 */
function loadPreset() {
  const preset = presets[presetSelect.value];
  if (!preset) return;

  stop();
  cells = Array.from({ length: rows }, () => Array(columns).fill(false));
  const offsetX = Math.floor((columns - preset.width) / 2);
  const offsetY = Math.floor((rows - preset.height) / 2);
  preset.points.forEach(([x, y]) => {
    cells[y + offsetY][x + offsetX] = true;
  });
  generation = 0;
  updateStats();
  draw();
}

// 再生ボタンで自動進行を切り替え、ボタン表示も現在の状態に合わせる。
toggleButton.addEventListener('click', () => timer === null ? start() : stop());

// 1ステップボタンで、自動再生の状態にかかわらず1世代だけ進める。
document.querySelector('#step-button').addEventListener('click', nextGeneration);

// ランダムボタンで盤面を約22%の生存率で初期化し、世代数をリセットする。
document.querySelector('#random-button').addEventListener('click', () => {
  cells = Array.from({ length: rows }, () => Array.from({ length: columns }, () => Math.random() < 0.22));
  generation = 0;
  updateStats();
  draw();
});

// クリアボタンで自動進行を止め、全セルを死亡状態にして世代数をリセットする。
document.querySelector('#clear-button').addEventListener('click', () => {
  stop();
  cells = Array.from({ length: rows }, () => Array(columns).fill(false));
  generation = 0;
  updateStats();
  draw();
});

// パターン選択時に説明を更新し、選択がある場合だけ配置ボタンを有効にする。
presetSelect.addEventListener('change', () => {
  const preset = presets[presetSelect.value];
  presetDescription.textContent = preset?.description ?? 'パターンを選ぶと説明が表示されます。';
  loadPresetButton.disabled = !preset;
});

// 配置ボタンで、選択したサンプルを中央に読み込む。
loadPresetButton.addEventListener('click', loadPreset);

// スライダー値を表示し、自動進行中なら新しい速度でタイマーを設定し直す。
speedInput.addEventListener('input', () => {
  speedValue.textContent = speedInput.value;
  if (timer !== null) {
    stop();
    start();
  }
});

// セル上の押下で塗る状態を決め、ドラッグ中も同じ状態を適用できるようポインターを捕捉する。
canvas.addEventListener('pointerdown', (event) => {
  isPainting = true;
  const { x, y } = getCellFromPointer(event);
  paintValue = !cells[y]?.[x];
  canvas.setPointerCapture(event.pointerId);
  paint(event);
});

// 押下中の移動先に選択した状態を塗り、盤面を連続して編集できるようにする。
canvas.addEventListener('pointermove', (event) => { if (isPainting) paint(event); });

// ポインターを離したらドラッグ編集を終了する。
canvas.addEventListener('pointerup', () => { isPainting = false; });

// タッチ操作の中断などでもドラッグ状態が残らないようにする。
canvas.addEventListener('pointercancel', () => { isPainting = false; });

// ウィンドウサイズ変更後にCanvasの表示サイズに合わせて描き直す。
window.addEventListener('resize', draw);

// 初期表示用に統計と盤面を描画する。
updateStats();
draw();