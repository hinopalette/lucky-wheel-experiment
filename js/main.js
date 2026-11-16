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
          "センサーの許可がありません。"+
          "ページを閉じてブラウザを終了し、再度URLを開き直してください。"+
          "センサー検知の許可を求めるポップアップが出てきたら「許可」を押してください。"+
          "（この許可はページを開いている間のみ、一時的に有効になります。）"
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
