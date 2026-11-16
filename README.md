# Lucky Wheel Experiment

卒業論文向けルーレット実験の開発版。現時点では **shake_certain** 条件のみ実装済み。

## 構成
- `index.html`：画面のHTMLと外部ファイル読み込み
- `css/style.css`：既存デザイン（原型のCSSを変更せず抽出）
- `js/config.js`：Shake閾値、終了時間、慣性などの定数
- `js/game.js`：状態、ルーレット描画、アニメーション、記録、終了判定
- `js/input.js`：iPhoneの加速度イベントによるShake検出
- `js/main.js`：センサー許可とゲーム開始処理

## 重要
JavaScriptは従来どおりの通常の `<script>` を順に読み込み、**config → game → input → main** の順序を維持してください。
各JSファイルの関数・状態は従来と同じグローバルスコープを共有します。
分割以外のロジック・文言・CSSは変更していません。

## 確認
GitHub Pages (HTTPS) に公開し、iPhone Safariで開始・Shake・慣性・3秒終了・コーラ獲得ポップアップを再テストしてください。
これは実機テスト済みという意味ではありません。

## 将来
TouchとUncertainは未実装。追加時は共通ロジックと条件固有処理を分け、実験設計に応じて条件割当を実装します。
データは現時点でブラウザコンソールに出力するだけで、サーバーに保存されません。
