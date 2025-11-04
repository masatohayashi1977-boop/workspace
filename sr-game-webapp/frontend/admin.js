/**
 * 社労士ゲームアプリ - 管理者画面 JavaScript
 */

// Google Apps Script のデプロイURL（実際のURLに置き換えてください）
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL';

// サンプルデータ（開発用）
let sampleUsers = [
    { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
    { id: 2, name: '鈴木花子', email: 'suzuki@example.com' },
    { id: 3, name: '佐藤次郎', email: '' }
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('管理者画面初期化中...');
    initializeAdmin();
});

/**
 * 管理者画面の初期化
 */
async function initializeAdmin() {
    // イベントリスナーの設定
    setupEventListeners();

    // データの読み込み
    await loadUsers();
    updateStats();

    console.log('初期化完了');
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // ユーザー登録フォーム
    document.getElementById('registerForm').addEventListener('submit', handleUserRegistration);

    // ユーザーリスト更新
    document.getElementById('refreshUsers').addEventListener('click', loadUsers);

    // スプレッドシートを開く
    document.getElementById('openSpreadsheet').addEventListener('click', () => {
        const url = document.getElementById('spreadsheetUrl').value;
        if (url) {
            window.open(url, '_blank');
        } else {
            showError('スプレッドシートURLを入力してください');
        }
    });
}

/**
 * ユーザー登録処理
 */
async function handleUserRegistration(e) {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();

    if (!name) {
        showError('名前を入力してください');
        return;
    }

    try {
        showLoading(true);

        // 開発モード：サンプルデータに追加
        const newId = sampleUsers.length > 0
            ? Math.max(...sampleUsers.map(u => u.id)) + 1
            : 1;

        const newUser = { id: newId, name, email };
        sampleUsers.push(newUser);

        console.log('ユーザー登録（開発モード）:', newUser);
        await new Promise(resolve => setTimeout(resolve, 500)); // 疑似遅延

        // 本番環境ではAPIにPOST
        /*
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'registerUser',
                name: name,
                email: email
            })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'ユーザー登録に失敗しました');
        }

        console.log('登録成功:', result.user);
        */

        showLoading(false);
        showSuccess(`${name} を登録しました`);

        // フォームをリセット
        document.getElementById('registerForm').reset();

        // ユーザーリストを更新
        await loadUsers();
        updateStats();

    } catch (error) {
        showLoading(false);
        console.error('登録エラー:', error);
        showError('ユーザー登録に失敗しました: ' + error.message);
    }
}

/**
 * ユーザーリストの読み込み
 */
async function loadUsers() {
    try {
        showLoading(true);

        // 開発モード：サンプルデータを使用
        console.log('ユーザーリスト読み込み（開発モード）');
        await new Promise(resolve => setTimeout(resolve, 500)); // 疑似遅延
        const users = sampleUsers;

        // 本番環境ではAPIから取得
        /*
        const response = await fetch(`${API_URL}?action=getUsers`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'ユーザーリストの取得に失敗しました');
        }

        const users = data.users;
        */

        // ユーザーリストを表示
        displayUsers(users);

        showLoading(false);

    } catch (error) {
        showLoading(false);
        console.error('読み込みエラー:', error);
        showError('ユーザーリストの読み込みに失敗しました: ' + error.message);
    }
}

/**
 * ユーザーリストの表示
 */
function displayUsers(users) {
    const listContainer = document.getElementById('userList');

    if (!users || users.length === 0) {
        listContainer.innerHTML = '<p class="info-text">登録されているユーザーはいません</p>';
        return;
    }

    listContainer.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-name">${escapeHtml(user.name)}</div>
                ${user.email ? `<div class="user-email">${escapeHtml(user.email)}</div>` : ''}
            </div>
            <div class="user-id">ID: ${user.id}</div>
        </div>
    `).join('');
}

/**
 * 統計情報の更新
 */
function updateStats() {
    // 開発モード：サンプルデータ
    document.getElementById('totalUsers').textContent = sampleUsers.length;
    document.getElementById('totalPlays').textContent = '0';
    document.getElementById('todayPlays').textContent = '0';

    // 本番環境ではAPIから取得
    /*
    fetch(`${API_URL}?action=getStats`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('totalUsers').textContent = data.stats.totalUsers;
                document.getElementById('totalPlays').textContent = data.stats.totalPlays;
                document.getElementById('todayPlays').textContent = data.stats.todayPlays;
            }
        })
        .catch(error => {
            console.error('統計情報の取得エラー:', error);
        });
    */
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ローディング表示の切り替え
 */
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

/**
 * 成功メッセージの表示
 */
function showSuccess(message) {
    const successEl = document.getElementById('successMessage');
    successEl.textContent = message;
    successEl.style.display = 'block';

    setTimeout(() => {
        successEl.style.display = 'none';
    }, 3000);
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
    window.debugAdmin = {
        users: () => sampleUsers,
        loadUsers: () => loadUsers(),
        updateStats: () => updateStats()
    };
}
