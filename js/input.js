// ==================================
// センサー処理
// ==================================

function handleMotion(event) {

  if (
    gameState !== "ready" &&
    gameState !== "playing"
  ) {
    return;
  }

  const a =
    event.accelerationIncludingGravity;

  if (
    !a ||
    a.x === null ||
    a.y === null ||
    a.z === null
  ) {
    return;
  }

  const current = {
    x: a.x,
    y: a.y,
    z: a.z
  };

  if (lastAcceleration === null) {
    lastAcceleration = current;
    return;
  }

  const dx = current.x - lastAcceleration.x;
  const dy = current.y - lastAcceleration.y;
  const dz = current.z - lastAcceleration.z;

  const delta = Math.sqrt(
    dx * dx +
    dy * dy +
    dz * dz
  );

  motionLevel = delta;
  lastAcceleration = current;

  const now = performance.now();

  // 小さな動きも終了判定に使用
  if (delta >= MOVEMENT_THRESHOLD) {
    lastMovementTime = now;
  }

  // Shake検出
  if (
    delta >= SHAKE_THRESHOLD &&
    now - lastShakeTime >= SHAKE_COOLDOWN
  ) {
    lastShakeTime = now;
    registerShake(now);
  }
}
