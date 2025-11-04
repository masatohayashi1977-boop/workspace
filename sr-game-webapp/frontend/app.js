/**
 * 社労士ゲームアプリ - フロントエンド JavaScript
 */

// グローバル変数
let currentStep = 1;
let selectedPlayer = null;
let selectedIndustries = [];
let transcriptText = '';
let recognition = null;
let recordingTimer = null;
let recordingStartTime = null;
const MAX_RECORDING_TIME = 90; // 1.5分 = 90秒

// Google Apps Script のデプロイURL（実際のURLに置き換えてください）
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL';

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('アプリ初期化中...');
    initializeApp();
});

/**
 * アプリの初期化
 */
async function initializeApp() {
    // 音声認識の初期化
    initializeSpeechRecognition();

    // イベントリスナーの設定
    setupEventListeners();

    // ユーザーリストの読み込み（仮のデータ）
    await loadUsers();

    console.log('初期化完了');
}

/**
 * Web Speech API の初期化
 */
function initializeSpeechRecognition() {
    // ブラウザの音声認識APIサポートチェック
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        showError('お使いのブラウザは音声認識に対応していません。Chrome、Edge、Safariをお使いください。');
        console.error('Speech Recognition not supported');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // 音声認識イベントハンドラー
    recognition.onstart = () => {
        console.log('音声認識開始');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        transcriptText += finalTranscript;
        updateTranscriptDisplay(transcriptText + interimTranscript);
    };

    recognition.onerror = (event) => {
        console.error('音声認識エラー:', event.error);
        if (event.error === 'no-speech') {
            // 無音が続いた場合は自動的に再開
            if (isRecording()) {
                recognition.start();
            }
        } else if (event.error !== 'aborted') {
            showError('音声認識エラー: ' + event.error);
        }
    };

    recognition.onend = () => {
        console.log('音声認識終了');
        // 録音中の場合は自動的に再開（1.5分経過まで）
        if (isRecording() && getRecordingTime() < MAX_RECORDING_TIME) {
            recognition.start();
        }
    };
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // ステップ1: プレイヤー選択
    document.getElementById('playerSelect').addEventListener('change', (e) => {
        selectedPlayer = e.target.value;
        document.getElementById('nextToIndustry').disabled = !selectedPlayer;
    });

    document.getElementById('nextToIndustry').addEventListener('click', () => {
        goToStep(2);
    });

    // ステップ2: 業界選択
    document.querySelectorAll('input[name="industry"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateIndustrySelection);
    });

    document.getElementById('backToPlayer').addEventListener('click', () => {
        goToStep(1);
    });

    document.getElementById('nextToRecording').addEventListener('click', () => {
        goToStep(3);
    });

    // ステップ3: 録音
    document.getElementById('micButton').addEventListener('click', toggleRecording);

    document.getElementById('backToIndustry').addEventListener('click', () => {
        if (!isRecording()) {
            goToStep(2);
        } else {
            showError('録音を停止してから戻ってください');
        }
    });

    document.getElementById('submitData').addEventListener('click', submitPlayData);

    // ステップ4: 完了
    document.getElementById('restart').addEventListener('click', resetApp);
}

/**
 * ユーザーリストの読み込み
 */
async function loadUsers() {
    try {
        // 開発中はサンプルデータを使用
        const sampleUsers = [
            { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
            { id: 2, name: '鈴木花子', email: 'suzuki@example.com' },
            { id: 3, name: '佐藤次郎', email: '' }
        ];

        const select = document.getElementById('playerSelect');
        select.innerHTML = '<option value="">選択してください...</option>';

        sampleUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.name;
            select.appendChild(option);
        });

        // 本番環境ではAPIからデータ取得
        /*
        showLoading(true);
        const response = await fetch(`${API_URL}?action=getUsers`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('playerSelect');
            select.innerHTML = '<option value="">選択してください...</option>';

            data.users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.name;
                option.textContent = user.name;
                select.appendChild(option);
            });
        }
        showLoading(false);
        */
    } catch (error) {
        console.error('ユーザー読み込みエラー:', error);
        showError('ユーザーリストの読み込みに失敗しました');
    }
}

/**
 * 業界選択の更新
 */
function updateIndustrySelection() {
    selectedIndustries = Array.from(
        document.querySelectorAll('input[name="industry"]:checked')
    ).map(cb => cb.value);

    document.getElementById('nextToRecording').disabled = selectedIndustries.length === 0;
}

/**
 * ステップ遷移
 */
function goToStep(step) {
    // 現在のステップを非表示
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    // 新しいステップを表示
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 録音の開始/停止
 */
function toggleRecording() {
    if (!recognition) {
        showError('音声認識が利用できません');
        return;
    }

    if (isRecording()) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * 録音開始
 */
function startRecording() {
    console.log('録音開始');

    // UIの更新
    document.getElementById('micButton').classList.add('recording');
    document.getElementById('recordingIndicator').classList.add('recording');
    document.querySelector('.status-text').textContent = '録音中';
    document.getElementById('progressFill').classList.add('recording');
    document.getElementById('transcriptContainer').style.display = 'block';

    // タイマー開始
    recordingStartTime = Date.now();
    recordingTimer = setInterval(updateTimer, 100);

    // 音声認識開始
    transcriptText = '';
    recognition.start();
}

/**
 * 録音停止
 */
function stopRecording() {
    console.log('録音停止');

    // UIの更新
    document.getElementById('micButton').classList.remove('recording');
    document.getElementById('recordingIndicator').classList.remove('recording');
    document.querySelector('.status-text').textContent = '録音完了';
    document.getElementById('progressFill').classList.remove('recording');

    // タイマー停止
    clearInterval(recordingTimer);
    recordingTimer = null;
    recordingStartTime = null;

    // 音声認識停止
    if (recognition) {
        recognition.stop();
    }

    // 送信ボタンを有効化
    document.getElementById('submitData').disabled = transcriptText.trim() === '';
}

/**
 * 録音中かどうか
 */
function isRecording() {
    return recordingTimer !== null;
}

/**
 * 録音時間を取得（秒）
 */
function getRecordingTime() {
    if (!recordingStartTime) return 0;
    return Math.floor((Date.now() - recordingStartTime) / 1000);
}

/**
 * タイマー更新
 */
function updateTimer() {
    const elapsed = getRecordingTime();

    // 時間表示の更新
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // プログレスバーの更新
    const progress = Math.min((elapsed / MAX_RECORDING_TIME) * 100, 100);
    document.getElementById('progressFill').style.width = `${progress}%`;

    // 最大時間に達したら自動停止
    if (elapsed >= MAX_RECORDING_TIME) {
        stopRecording();
        showError('録音時間が1.5分に達しました');
    }
}

/**
 * 文字起こしテキストの更新
 */
function updateTranscriptDisplay(text) {
    document.getElementById('transcriptText').textContent = text;
    // 自動スクロール
    const container = document.getElementById('transcriptText');
    container.scrollTop = container.scrollHeight;
}

/**
 * データの送信
 */
async function submitPlayData() {
    if (!selectedPlayer || selectedIndustries.length === 0 || !transcriptText.trim()) {
        showError('必要な情報が不足しています');
        return;
    }

    const playData = {
        action: 'savePlayData',
        playerName: selectedPlayer,
        industry: selectedIndustries,
        response: transcriptText.trim(),
        consultationText: '',
        cardName: '',
        score: '',
        comment: '',
        advice: '',
        demo: ''
    };

    console.log('送信データ:', playData);

    try {
        showLoading(true);

        // 開発中はコンソールに出力のみ
        console.log('データ送信（開発モード）:', playData);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 疑似遅延

        // 本番環境ではAPIにPOST
        /*
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playData)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'データ送信に失敗しました');
        }

        console.log('送信成功:', result);
        */

        showLoading(false);
        goToStep(4);

    } catch (error) {
        showLoading(false);
        console.error('送信エラー:', error);
        showError('データの送信に失敗しました: ' + error.message);
    }
}

/**
 * アプリのリセット
 */
function resetApp() {
    // 変数のリセット
    currentStep = 1;
    selectedPlayer = null;
    selectedIndustries = [];
    transcriptText = '';

    // フォームのリセット
    document.getElementById('playerSelect').value = '';
    document.querySelectorAll('input[name="industry"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('transcriptText').textContent = '';
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('progressFill').style.width = '0%';

    // ボタンの無効化
    document.getElementById('nextToIndustry').disabled = true;
    document.getElementById('nextToRecording').disabled = true;
    document.getElementById('submitData').disabled = true;

    // ステップ1に戻る
    goToStep(1);
}

/**
 * ローディング表示の切り替え
 */
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

/**
 * エラーメッセージの表示
 */
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';

    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

// デバッグ用（開発時のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('開発モード: サンプルデータを使用');
    window.debugApp = {
        currentStep: () => currentStep,
        selectedPlayer: () => selectedPlayer,
        selectedIndustries: () => selectedIndustries,
        transcriptText: () => transcriptText,
        goToStep: (step) => goToStep(step),
        resetApp: () => resetApp()
    };
}
