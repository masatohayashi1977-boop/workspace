/**
 * 設定ファイルのサンプル
 *
 * このファイルをコピーして config.js を作成し、
 * 実際のデプロイURLに変更してください。
 *
 * 使い方:
 * 1. cp config.sample.js config.js
 * 2. config.js の API_URL を実際のURLに変更
 * 3. index.html と admin.html で config.js を読み込む
 */

const CONFIG = {
    // Google Apps Script のデプロイURL
    API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',

    // 録音の最大時間（秒）
    MAX_RECORDING_TIME: 90, // 1.5分

    // 業界の選択肢
    INDUSTRIES: [
        '製造業界',
        '運送業界',
        '建設業界',
        '介護業界'
    ],

    // デバッグモード（本番環境では false に設定）
    DEBUG_MODE: true,

    // サンプルユーザー（開発用）
    SAMPLE_USERS: [
        { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
        { id: 2, name: '鈴木花子', email: 'suzuki@example.com' },
        { id: 3, name: '佐藤次郎', email: '' }
    ]
};

// config.js を使用する場合は、以下のように参照できます:
// const API_URL = CONFIG.API_URL;
// const MAX_RECORDING_TIME = CONFIG.MAX_RECORDING_TIME;
