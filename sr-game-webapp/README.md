# 社労士ゲーム WEBアプリ

社労士向けのプレゼンテーション練習用ゲームアプリ（スマホ・タブレット対応）

## 📋 機能概要

### 実装済み機能

1. **ユーザー管理**
   - Google Sheetsでのユーザー登録（ID自動採番、名前、メール）
   - プレイヤー選択画面

2. **業界選択**
   - 複数選択可能
   - 対応業界：製造業界、運送業界、建設業界、介護業界

3. **音声録音・文字起こし**
   - Web Speech APIによる音声認識
   - 約1.5分（90秒）の録音制限
   - リアルタイム文字起こし表示
   - プログレスバー付きタイマー

4. **データ保存**
   - Google Sheetsへのデータ保存
   - SelectionID自動採番

### データベース構造

#### Usersシート
- ID（自動採番）
- 名前
- メール（任意）
- 登録日時

#### MainDBシート
- SelectionID（自動採番）
- PlayerName
- Industry
- ConsultationText
- CardName
- Response（文字起こしテキスト）
- CreatedAt
- Score
- Comment
- Advice
- Demo

## 🚀 セットアップ手順

### 1. Google Apps Script のデプロイ

1. Google Apps Script にアクセス
   - https://script.google.com にアクセス

2. 新しいプロジェクトを作成
   - 「新しいプロジェクト」をクリック

3. コードをコピー
   - `backend/Code.gs` の内容をコピーして貼り付け

4. スプレッドシートの初期化
   - エディタ上部の関数選択で `initializeSpreadsheet` を選択
   - 実行ボタンをクリック
   - 初回実行時に権限の承認が必要です
   - 実行ログにスプレッドシートのURLが表示されます

5. Webアプリとしてデプロイ
   - 右上の「デプロイ」→「新しいデプロイ」をクリック
   - 種類：「ウェブアプリ」を選択
   - 設定：
     - 説明：「社労士ゲームAPI」
     - 次のユーザーとして実行：「自分」
     - アクセスできるユーザー：「全員」
   - 「デプロイ」をクリック
   - **ウェブアプリのURLをコピー**（後で使用）

### 2. フロントエンドの設定

1. `frontend/app.js` を編集
   - 6行目の `API_URL` を上記でコピーしたURLに変更

```javascript
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

2. ローカルサーバーで起動（開発時）

```bash
cd sr-game-webapp/frontend
python3 -m http.server 8000
```

または

```bash
cd sr-game-webapp/frontend
npx serve
```

3. ブラウザでアクセス
   - http://localhost:8000 にアクセス

### 3. ユーザーの登録（管理者用）

Google Apps Script エディタから：

```javascript
// 関数選択で testRegisterUsers を選択して実行
testRegisterUsers();

// または個別に登録
registerUser('田中太郎', 'tanaka@example.com');
registerUser('鈴木花子', 'suzuki@example.com');
registerUser('佐藤次郎'); // メールなし
```

## 📱 使い方

### プレイヤー側の操作

1. **プレイヤー選択**
   - ドロップダウンから自分の名前を選択
   - 「次へ」をクリック

2. **業界選択**
   - 対象となる業界を1つ以上選択（複数選択可）
   - 「次へ」をクリック

3. **プレゼンテーション録音**
   - マイクボタンをタップして録音開始
   - 約1.5分間のプレゼンテーションを実施
   - リアルタイムで文字起こしが表示されます
   - 録音を停止する場合は再度マイクボタンをタップ
   - 「送信」をクリックしてデータを保存

4. **完了**
   - 送信完了画面が表示されます
   - 「最初から始める」で新しいセッションを開始

## 🔧 技術スタック

- **フロントエンド**
  - HTML5
  - CSS3（レスポンシブデザイン）
  - Vanilla JavaScript
  - Web Speech API（音声認識）

- **バックエンド**
  - Google Apps Script
  - Google Sheets（データベース）

## 📱 対応デバイス

- スマートフォン（iOS Safari 14.5+、Android Chrome 90+）
- タブレット（iPad、Android Tablet）
- PC（Chrome、Edge、Safari）

### 音声認識対応ブラウザ

- ✅ Google Chrome（推奨）
- ✅ Microsoft Edge
- ✅ Safari（iOS 14.5+、macOS 12+）
- ❌ Firefox（Web Speech API未対応）

## 🔒 権限

音声認識を使用するため、初回アクセス時にマイクの使用許可が必要です。

## 📝 開発モード

開発時はサンプルデータを使用してローカルでテストできます：

```javascript
// ブラウザのコンソールで利用可能（localhost時のみ）
debugApp.currentStep()        // 現在のステップを確認
debugApp.selectedPlayer()     // 選択中のプレイヤーを確認
debugApp.selectedIndustries() // 選択中の業界を確認
debugApp.transcriptText()     // 文字起こしテキストを確認
debugApp.goToStep(2)          // ステップ移動
debugApp.resetApp()           // アプリをリセット
```

## 🔄 今後の拡張予定

- カード選択機能
- スコアリング機能
- コメント・アドバイス機能
- デモモード
- 履歴閲覧機能
- データエクスポート機能

## 📂 ディレクトリ構造

```
sr-game-webapp/
├── backend/
│   └── Code.gs          # Google Apps Script バックエンド
├── frontend/
│   ├── index.html       # メインHTML
│   ├── styles.css       # スタイルシート
│   └── app.js           # JavaScript ロジック
└── README.md            # このファイル
```

## 🐛 トラブルシューティング

### 音声認識が動作しない

- マイクの使用許可を確認してください
- 対応ブラウザ（Chrome、Edge、Safari）を使用してください
- HTTPSまたはlocalhostでアクセスしてください（HTTPでは動作しません）

### データが保存されない

- Google Apps Script のデプロイURLが正しく設定されているか確認してください
- `app.js` の `API_URL` を確認してください
- Google Apps Script の実行権限を確認してください

### ユーザーが表示されない

- Google Apps Script で `initializeSpreadsheet()` を実行してください
- `testRegisterUsers()` でテストユーザーを登録してください

## 📄 ライセンス

このプロジェクトは社労士向けの教育・トレーニング目的で作成されています。

## 👨‍💻 開発者向けメモ

### Google Apps Script の更新

コードを更新した後は、必ず新しいバージョンとしてデプロイしてください：

1. 「デプロイ」→「デプロイを管理」
2. 既存のデプロイの右側の鉛筆アイコンをクリック
3. 「バージョン」→「新バージョン」を選択
4. 「デプロイ」をクリック

### CORS対応

Google Apps Script は自動的にCORSに対応しているため、フロントエンドから直接APIを呼び出せます。

### スプレッドシートのURL取得

```javascript
// Google Apps Script エディタで実行
function getSpreadsheetUrl() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(id);
  Logger.log(spreadsheet.getUrl());
}
```
