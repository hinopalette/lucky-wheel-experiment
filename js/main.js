// ==================================
// 開始
// ==================================

async function startGame() {

  if (!window.isSecureContext) {
    status.textContent =
      "HTTPS環境で開いてください。";
    return;
  }

  if (!("DeviceMotionEvent" in window)) {
    status.textContent =
      "モーションセンサー非対応です。";
    return;
  }

  startButton.disabled = true;

  try {

    if (
      typeof DeviceMotionEvent
        .requestPermission === "function"
    ) {
      const permission =
        await DeviceMotionEvent.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          "センサーの許可がありません。Safariが拒否を記憶している場合、" +
          "このボタンでは許可画面を再表示できません。" +
          "Safariのサイト設定で動作とモーションの許可を確認し、" +
          "ページを開き直してから、もう一度開始してください。"
        );
      }
    }

    window.addEventListener(
      "devicemotion",
      handleMotion
    );

    gameState = "ready";

    status.textContent =
      "準備完了！iPhoneを振ってください。";

    startButton.style.display = "none";

    lastFrameTime = null;

    animationFrame =
      requestAnimationFrame(
        animatePointer
      );

    checkTimer = setInterval(
      checkInactivity,
      100
    );

    debugTimer = setInterval(
      updateDebug,
      200
    );

  } catch (error) {

    status.textContent =
      "開始できません: " + error.message;

    startButton.disabled = false;
  }
}

startButton.addEventListener(
  "click",
  startGame
);
