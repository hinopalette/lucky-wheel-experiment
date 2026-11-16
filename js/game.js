// ==================================
// 状態
// ==================================

let gameState = "idle";

let shakeCount = 0;

let firstGestureTime = null;
let lastGestureTime = null;

let lastShakeTime = -Infinity;
let lastMovementTime = -Infinity;

let lastAcceleration = null;

// 針の回転角度
let currentAngle = 0;

// 現在の角速度（度/秒）
let angularVelocity = 0;

let lastFrameTime = null;
let motionLevel = 0;

let checkTimer = null;
let debugTimer = null;
let animationFrame = null;


// ==================================
// DOM
// ==================================

const pointer =
  document.getElementById("pointer");

const status =
  document.getElementById("status");

const startButton =
  document.getElementById("startButton");

const resultModal =
  document.getElementById("resultModal");

const debug =
  document.getElementById("debug");


// ==================================
// ライト生成
// ==================================

const lights =
  document.getElementById("lights");

for (let i = 0; i < 16; i++) {
  const angle = i * Math.PI / 8;

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  circle.setAttribute(
    "cx",
    150 + 103 * Math.sin(angle)
  );

  circle.setAttribute(
    "cy",
    137 - 103 * Math.cos(angle)
  );

  circle.setAttribute("r", "5.2");
  circle.setAttribute("fill", "#fff5c0");

  lights.appendChild(circle);
}


// ==================================
// 針の表示
// ==================================

function setPointerAngle(angle) {
  pointer.setAttribute(
    "transform",
    `rotate(${angle} 150 145)`
  );
}


// ==================================
// 慣性回転アニメーション
// ==================================

function animatePointer(timestamp) {

  if (lastFrameTime === null) {
    lastFrameTime = timestamp;
  }

  // フレーム間隔を秒に変換
  const dt = Math.min(
    (timestamp - lastFrameTime) / 1000,
    0.05
  );

  lastFrameTime = timestamp;

  if (angularVelocity > 0) {

    // 指数関数的に減速
    const decay = Math.exp(-FRICTION * dt);

    const newVelocity =
      angularVelocity * decay;

    // フレーム内の回転角を計算
    const angleStep =
      (angularVelocity - newVelocity) /
      FRICTION;

    currentAngle =
      (currentAngle + angleStep) % 360;

    angularVelocity = newVelocity;

    if (angularVelocity < STOP_VELOCITY) {
      angularVelocity = 0;
    }

    setPointerAngle(currentAngle);
  }

  if (gameState !== "finished") {
    animationFrame =
      requestAnimationFrame(animatePointer);
  }
}


// ==================================
// デバッグ表示
// ==================================

function updateDebug() {

  const now = performance.now();

  const elapsed =
    lastGestureTime === null
      ? "--"
      : Math.round(now - lastGestureTime);

  const duration =
    firstGestureTime === null
      ? "--"
      : Math.round(
          lastGestureTime - firstGestureTime
        );

  debug.innerHTML =
    "Shake count: " + shakeCount + "<br>" +
    "Motion level: " +
      motionLevel.toFixed(2) + "<br>" +
    "Angular velocity: " +
      angularVelocity.toFixed(1) +
      " deg/s<br>" +
    "Last shake: " + elapsed + " ms ago<br>" +
    "Interaction time: " + duration + " ms";
}

// ==================================
// Shake登録
// ==================================

function registerShake(now) {

  if (gameState === "ready") {
    gameState = "playing";
    firstGestureTime = now;
  }

  lastGestureTime = now;
  shakeCount++;

  // Shakeごとに一定の角速度を加算
  angularVelocity = Math.min(
    angularVelocity + ANGULAR_IMPULSE,
    MAX_ANGULAR_VELOCITY
  );

  status.textContent =
    "ルーレット回転中！";

  updateDebug();
}


// ==================================
// 終了判定
// ==================================

function checkInactivity() {

  if (gameState !== "playing") {
    return;
  }

  const now = performance.now();

  const sinceShake =
    now - lastGestureTime;

  const sinceMovement =
    now - lastMovementTime;

  if (
    sinceShake >= INACTIVITY_MS &&
    sinceMovement >= INACTIVITY_MS
  ) {
    finishGame();
  }
}


// ==================================
// ゲーム終了
// ==================================

function finishGame() {

  if (gameState !== "playing") {
    return;
  }

  gameState = "finished";

  clearInterval(checkTimer);
  clearInterval(debugTimer);

  window.removeEventListener(
    "devicemotion",
    handleMotion
  );

  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  // 終了時に残っている角速度を停止
  angularVelocity = 0;

  // 針の最終位置は自然な角度のまま保持
  setPointerAngle(currentAngle);

  resultModal.classList.add("visible");

  status.textContent = "";
  startButton.style.display = "none";

  updateDebug();

  const record = {
    condition: "shake_certain",
    reward: "Cola",
    shakeCount: shakeCount,
    interactionTimeMs:
      lastGestureTime - firstGestureTime,
    completed: true
  };

  console.log(
    "Experiment record:",
    record
  );
}
