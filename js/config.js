"use strict";

// ==================================
// 設定
// ==================================

// Shake検出感度：従来の60%
const SHAKE_THRESHOLD = 5.4;

// Shakeの連続検出を抑制
const SHAKE_COOLDOWN = 220;

// 終了判定
const INACTIVITY_MS = 3000;
const MOVEMENT_THRESHOLD = 3;

// ==================================
// 新しい慣性回転パラメータ
// ==================================

// Shake1回で追加する角速度（度/秒）
const ANGULAR_IMPULSE = 540;

// 最大角速度（度/秒）
const MAX_ANGULAR_VELOCITY = 1080;

// 摩擦による減速係数（1/秒）
// 約2〜3秒で十分低速になる設定
const FRICTION = 2.2;

// この速度以下になったら停止
const STOP_VELOCITY = 3;
