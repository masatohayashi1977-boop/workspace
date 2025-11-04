// ==========================================
// タイムトラッキングアプリ AI評価フィードバックシステム（修正版）
// ==========================================

// 【設定】ここで情報を指定してください
const CONFIG = {
  GEMINI_API_KEY: 'AIzaSyAZzrhy7i84LllJ6x622yU361ShETQJ0eI', // ご自身のキーに変更
  SHEET_NAME: {
    aggregation: '集計',      // 業務実績データシート
    users: 'ユーザー管理',     // ユーザー情報シート
    types: '種別',            // 作業種別シート
    customers: '顧客'         // 顧客シート
  },
  ADMIN_EMAIL: 'masatohayashi1977@gmail.com', // 管理者メールアドレス
  FEEDBACK_TIME: 8               // フィードバック送信時刻（8:00）
};

// ==========================================
// メイン実行関数：毎日8:00にトリガー実行
// ==========================================
function sendDailyFeedback() {
  try {
    Logger.log('=== フィードバック配信開始 ===');

    // 前日のデータを取得
    const yesterday = getYesterdayString();
    Logger.log('対象日付: ' + yesterday);

    // 前日のデータを集計シートから取得
    const yesterdayData = getYesterdayData(yesterday);

    Logger.log('取得データ件数: ' + yesterdayData.length);

    if (yesterdayData.length === 0) {
      Logger.log('前日のデータがありません');
      return;
    }

    // ユーザーごとにグループ化
    const userGroups = groupDataByUser(yesterdayData);
    Logger.log('ユーザーグループ数: ' + Object.keys(userGroups).length);

    // マスターデータを取得
    const users = getUserMaster();
    const types = getTypeMaster();
    const customers = getCustomerMaster();

    // 個々のユーザーにフィードバックを送信
    const individualFeedbacks = [];
    for (const userId in userGroups) {
      const userData = userGroups[userId];
      const user = users.find(u => u.id === userId);

      if (!user || !user.email) {
        Logger.log('ユーザー ' + userId + ' のメールアドレスが見つかりません');
        continue;
      }

      // AI評価を取得
      const feedback = generateAIFeedback(userData, types, customers);

      // メール送信
      const subject = yesterday + ' の業務フィードバック';
      const htmlBody = formatFeedbackEmail(user.name, feedback, yesterday, userData, types, customers);

      GmailApp.sendEmail(user.email, subject, '', { htmlBody: htmlBody });
      Logger.log(user.name + ' (' + user.email + ') にメール送信完了');

      individualFeedbacks.push({
        userName: user.name,
        feedback: feedback
      });
    }

    // 管理者へ全体サマリーを送信
    if (individualFeedbacks.length > 0) {
      sendAdminSummary(yesterday, individualFeedbacks, userGroups, types, customers);
    }

    Logger.log('=== フィードバック配信完了 ===');

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error);
    Logger.log('スタックトレース: ' + error.stack);
    sendErrorNotification(error);
  }
}

// ==========================================
// 日付ユーティリティ
// ==========================================
function getYesterdayString() {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const date = String(yesterday.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + date;
}

// ==========================================
// データ取得関数
// ==========================================

// 前日のデータを集計シートから取得
function getYesterdayData(dateString) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.aggregation);

  if (!sheet) {
    Logger.log('エラー: 集計シートが見つかりません');
    return [];
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('集計シートにデータがありません');
    return [];
  }

  const headers = data[0];

  // カラムインデックスを取得
  const dateIndex = headers.indexOf('年月日');
  const nameIndex = headers.indexOf('氏名');
  const typeIndex = headers.indexOf('種別');
  const customerIndex = headers.indexOf('顧客');
  const contentIndex = headers.indexOf('業務内容');
  const targetIndex = headers.indexOf('目標');
  const startTimeIndex = headers.indexOf('開始時間');
  const impressionIndex = headers.indexOf('所感');
  const endTimeIndex = headers.indexOf('終了時間');
  const durationIndex = headers.indexOf('所要時間');
  const completeIndex = headers.indexOf('完了');

  // 必須カラムのチェック
  if (dateIndex === -1 || nameIndex === -1 || durationIndex === -1) {
    Logger.log('エラー: 必須カラムが見つかりません');
    Logger.log('dateIndex: ' + dateIndex + ', nameIndex: ' + nameIndex + ', durationIndex: ' + durationIndex);
    return [];
  }

  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // 空行をスキップ
    if (!row[dateIndex] && !row[nameIndex]) {
      continue;
    }

    // 日付が前日かチェック
    const cellDate = row[dateIndex];
    const formattedDate = formatDateForComparison(cellDate);

    if (formattedDate === dateString) {
      const durationValue = row[durationIndex];

      Logger.log('マッチ行 ' + (i + 1) + ': ' + row[contentIndex] + ', 所要時間値: ' + JSON.stringify(durationValue));

      result.push({
        date: formattedDate,
        userId: row[nameIndex],  // 集計シートの「氏名」列にはユーザーIDが入っている
        type: row[typeIndex],
        customer: row[customerIndex],
        content: row[contentIndex],
        target: row[targetIndex],
        startTime: row[startTimeIndex],
        impression: row[impressionIndex],
        endTime: row[endTimeIndex],
        duration: durationValue,
        completed: row[completeIndex]
      });
    }
  }

  Logger.log('対象日のレコード数: ' + result.length);
  return result;
}

// 日付を文字列に統一
function formatDateForComparison(dateValue) {
  if (!dateValue) return '';

  let date;
  if (typeof dateValue === 'string') {
    // 文字列の場合はパース
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return '';
  }

  // 無効な日付チェック
  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + day;
}

// ユーザーマスターデータを取得
function getUserMaster() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.users);

  if (!sheet) {
    Logger.log('エラー: ユーザー管理シートが見つかりません');
    return [];
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('ユーザー管理シートにデータがありません');
    return [];
  }

  const headers = data[0];

  const idIndex = headers.indexOf('ID');
  const nameIndex = headers.indexOf('氏名');
  const emailIndex = headers.indexOf('メールアドレス');

  if (nameIndex === -1 || emailIndex === -1) {
    Logger.log('エラー: ユーザー管理シートに必須カラムがありません');
    return [];
  }

  const result = [];
  for (let i = 1; i < data.length; i++) {
    // 空行をスキップ
    if (!data[i][nameIndex]) {
      continue;
    }

    result.push({
      id: data[i][idIndex],
      name: data[i][nameIndex],
      email: data[i][emailIndex]
    });
  }

  Logger.log('ユーザーマスター取得: ' + result.length + '件');
  return result;
}

// 種別マスターデータを取得
function getTypeMaster() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.types);

  if (!sheet) {
    Logger.log('警告: 種別シートが見つかりません');
    return {};
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('種別シートにデータがありません');
    return {};
  }

  const headers = data[0];

  const idIndex = headers.indexOf('ID');
  const typeIndex = headers.indexOf('種別');

  const result = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex]) {
      result[data[i][idIndex]] = data[i][typeIndex];
    }
  }

  Logger.log('種別マスター取得: ' + Object.keys(result).length + '件');
  return result;
}

// 顧客マスターデータを取得
function getCustomerMaster() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.customers);

  if (!sheet) {
    Logger.log('警告: 顧客シートが見つかりません');
    return {};
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('顧客シートにデータがありません');
    return {};
  }

  const headers = data[0];

  const idIndex = headers.indexOf('ID');
  const nameIndex = headers.indexOf('顧客名');

  const result = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex]) {
      result[data[i][idIndex]] = data[i][nameIndex];
    }
  }

  Logger.log('顧客マスター取得: ' + Object.keys(result).length + '件');
  return result;
}

// ==========================================
// データ集計・グループ化
// ==========================================

// ユーザーごとにデータをグループ化
function groupDataByUser(data) {
  const grouped = {};

  for (const record of data) {
    const userId = record.userId;  // 集計シートの「氏名」列にはユーザーIDが入っている
    if (!userId) {
      continue;
    }

    if (!grouped[userId]) {
      grouped[userId] = [];
    }
    grouped[userId].push(record);
  }

  Logger.log('グループ化完了: ' + Object.keys(grouped).length + 'ユーザー');
  return grouped;
}

// 稼働時間を計算
function calculateTotalDuration(userData) {
  if (!userData || !Array.isArray(userData)) {
    return 0;
  }

  let total = 0;

  Logger.log('稼働時間計算: ' + userData.length + '件');

  for (let idx = 0; idx < userData.length; idx++) {
    const record = userData[idx];
    let duration = 0;

    // パターン1: 所要時間が数値の場合
    if (typeof record.duration === 'number') {
      duration = record.duration;
      Logger.log('  [' + idx + '] 数値: ' + duration.toFixed(2) + '時間');
    }
    // パターン2: 所要時間が文字列の場合
    else if (typeof record.duration === 'string' && record.duration) {
      const durationStr = String(record.duration).trim();

      if (durationStr.includes(':')) {
        // "1:30" 形式
        const parts = durationStr.split(':');
        if (parts.length === 2) {
          const hours = parseInt(parts[0]) || 0;
          const minutes = parseInt(parts[1]) || 0;
          duration = hours + (minutes / 60);
          Logger.log('  [' + idx + '] H:M形式: ' + durationStr + ' → ' + duration.toFixed(2) + '時間');
        }
      } else {
        // 数値文字列
        const numValue = parseFloat(durationStr);
        if (!isNaN(numValue)) {
          duration = numValue;
          Logger.log('  [' + idx + '] 数値文字列: ' + duration.toFixed(2) + '時間');
        }
      }
    }
    // パターン3: Date型の場合（Googleスプレッドシートの時刻形式）
    else if (record.duration instanceof Date) {
      // 時刻として扱う（0:00からの経過時間）
      const hours = record.duration.getHours();
      const minutes = record.duration.getMinutes();
      duration = hours + (minutes / 60);
      Logger.log('  [' + idx + '] Date型: ' + duration.toFixed(2) + '時間');
    }

    total += duration;
  }

  Logger.log('合計稼働時間: ' + total.toFixed(2) + '時間');
  return total;
}

// 最も時間がかかったタスクを取得
function getMostTimeConsumingTask(userData, customers) {
  if (!userData || !Array.isArray(userData) || userData.length === 0) {
    return null;
  }

  let maxDuration = 0;
  let maxTask = null;

  for (const record of userData) {
    let duration = 0;

    if (typeof record.duration === 'number') {
      duration = record.duration;
    } else if (typeof record.duration === 'string' && record.duration) {
      const durationStr = String(record.duration).trim();
      if (durationStr.includes(':')) {
        const parts = durationStr.split(':');
        if (parts.length === 2) {
          duration = parseInt(parts[0]) + parseInt(parts[1]) / 60;
        }
      } else {
        duration = parseFloat(durationStr) || 0;
      }
    } else if (record.duration instanceof Date) {
      const hours = record.duration.getHours();
      const minutes = record.duration.getMinutes();
      duration = hours + (minutes / 60);
    }

    if (duration > maxDuration) {
      maxDuration = duration;
      maxTask = record;
    }
  }

  return maxTask;
}

// ==========================================
// AI評価生成（Gemini API使用）
// ==========================================

function generateAIFeedback(userData, types, customers) {
  const totalDuration = calculateTotalDuration(userData);
  const taskCount = userData ? userData.length : 0;
  const mostTimeTask = getMostTimeConsumingTask(userData, customers);

  // 評価プロンプトを作成
  const prompt = buildPrompt(userData, types, customers, totalDuration, taskCount, mostTimeTask);

  // Gemini APIを呼び出し
  const feedback = callGeminiAPI(prompt);

  return {
    totalDuration: totalDuration,
    taskCount: taskCount,
    mostTimeTask: mostTimeTask,
    aiComment: feedback
  };
}

// 評価プロンプトを構築
function buildPrompt(userData, types, customers, totalDuration, taskCount, mostTimeTask) {
  let prompt = '前日の業務データを分析し、ポジティブなフィードバックを提供してください。\n\n';
  prompt += '【業務サマリー】\n';
  prompt += '稼働時間: ' + totalDuration.toFixed(2) + '時間\n';
  prompt += 'タスク数: ' + taskCount + '件\n\n';

  prompt += '【タスク詳細】\n';
  if (userData && Array.isArray(userData)) {
    for (let i = 0; i < userData.length; i++) {
      const record = userData[i];
      const typeName = types[record.type] || record.type || '未分類';
      const customerName = customers[record.customer] || record.customer || '未指定';

      let duration = record.duration;
      if (typeof duration === 'number') {
        duration = duration.toFixed(2) + '時間';
      } else if (duration instanceof Date) {
        const hours = duration.getHours();
        const minutes = duration.getMinutes();
        duration = hours + ':' + String(minutes).padStart(2, '0');
      }

      prompt += (i + 1) + '. ' + customerName + ' - ' + typeName + '\n';
      prompt += '   内容: ' + (record.content || '（内容なし）') + '\n';
      prompt += '   所要時間: ' + duration + '\n';

      if (record.target) {
        prompt += '   目標: ' + record.target + '\n';
      }

      if (record.impression) {
        prompt += '   所感: ' + record.impression + '\n';
      }

      prompt += '\n';
    }
  }

  prompt += '【フィードバック指針】\n';
  prompt += '・基本的に褒める内容で\n';
  prompt += '・稼働時間やタスク数の達成状況を評価\n';
  prompt += '・最も時間がかかったタスクについて言及\n';
  prompt += '・目標に対しての所感を踏まえた励まし\n';
  prompt += '・日本語で、150〜300字程度で\n\n';

  prompt += '【重要】思考プロセスや分析過程は含めず、フィードバック文のみを直接出力してください。';

  return prompt;
}

// 管理者向けマネジメント分析プロンプトを構築
function buildManagementPrompt(individualFeedbacks, userGroups, totalHours, totalTaskCount, userCount, types, customers) {
  let prompt = 'あなたはチームマネージャーです。以下のチームの業務データを分析し、マネジメント視点でのフィードバックを提供してください。\n\n';

  prompt += '【チーム全体サマリー】\n';
  prompt += '対象メンバー: ' + userCount + '名\n';
  prompt += '総稼働時間: ' + totalHours.toFixed(2) + '時間\n';
  prompt += '総タスク数: ' + totalTaskCount + '件\n';
  prompt += '平均稼働時間: ' + (userCount > 0 ? (totalHours / userCount).toFixed(2) : '0.00') + '時間/人\n';
  prompt += '平均タスク数: ' + (userCount > 0 ? (totalTaskCount / userCount).toFixed(1) : '0.0') + '件/人\n\n';

  prompt += '【メンバー別データ】\n';
  for (let i = 0; i < individualFeedbacks.length; i++) {
    const member = individualFeedbacks[i];
    const feedback = member.feedback;

    prompt += (i + 1) + '. ' + member.userName + '\n';
    prompt += '   稼働時間: ' + (feedback.totalDuration ? feedback.totalDuration.toFixed(2) : '0.00') + '時間\n';
    prompt += '   タスク数: ' + (feedback.taskCount || 0) + '件\n';

    if (feedback.mostTimeTask) {
      let duration = feedback.mostTimeTask.duration;
      if (typeof duration === 'number') {
        duration = duration.toFixed(2) + '時間';
      }
      prompt += '   最長タスク: ' + feedback.mostTimeTask.content + ' (' + duration + ')\n';
    }

    prompt += '\n';
  }

  prompt += '【分析指針】\n';
  prompt += '・チーム全体の生産性や業務バランスについて評価\n';
  prompt += '・メンバー間の稼働時間やタスク量の偏りがあれば指摘\n';
  prompt += '・チームの強みや改善点を具体的に提案\n';
  prompt += '・今後のチーム運営に向けたアドバイス\n';
  prompt += '・マネージャーとして注目すべきポイントを明確に\n';
  prompt += '・日本語で、300〜500字程度で、客観的かつ建設的な内容で\n\n';

  prompt += '【重要】思考プロセスや分析過程は含めず、マネジメント分析の文章のみを直接出力してください。';

  return prompt;
}

// 管理者向けマネジメント分析を生成
function generateManagementInsight(individualFeedbacks, userGroups, totalHours, totalTaskCount, userCount, types, customers) {
  const prompt = buildManagementPrompt(individualFeedbacks, userGroups, totalHours, totalTaskCount, userCount, types, customers);
  const insight = callGeminiAPI(prompt);
  return insight;
}

// Gemini APIを呼び出し
function callGeminiAPI(prompt) {
  // Gemini 2.5 Flash Latest を使用（Thinking機能なし）
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=' + CONFIG.GEMINI_API_KEY;

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    systemInstruction: {
      parts: [{
        text: 'あなたは業務フィードバックを提供するアシスタントです。思考プロセスや分析の過程は一切出力せず、完成したフィードバック文のみを直接出力してください。内部の推論や考察は含めないでください。'
      }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,  // トークン数をさらに増やす
      topP: 0.95,
      topK: 40,
      responseMimeType: 'text/plain'
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    Logger.log('Gemini API呼び出し開始');
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log('APIレスポンスコード: ' + responseCode);

    if (responseCode !== 200) {
      Logger.log('APIエラーレスポンス: ' + responseText);
      return 'フィードバック生成に失敗しました。(エラーコード: ' + responseCode + ')';
    }

    const result = JSON.parse(responseText);

    if (result.candidates && result.candidates.length > 0) {
      const candidate = result.candidates[0];
      const content = candidate.content;

      // finishReasonをチェック
      if (candidate.finishReason === 'MAX_TOKENS') {
        Logger.log('警告: トークン数上限に達しました。出力が途中で切れている可能性があります。');
        Logger.log('thoughtsTokenCount: ' + (result.usageMetadata ? result.usageMetadata.thoughtsTokenCount : 'なし'));
      }

      if (content && content.parts && content.parts.length > 0) {
        const responseText = content.parts[0].text;
        Logger.log('生成成功。出力文字数: ' + responseText.length);
        if (result.usageMetadata && result.usageMetadata.thoughtsTokenCount) {
          Logger.log('注意: Thinking機能が使用されました (' + result.usageMetadata.thoughtsTokenCount + 'トークン)');
        }
        return responseText;
      }

      // content.partsが存在しない場合のエラーメッセージ
      Logger.log('エラー: content.partsが存在しません。finishReason: ' + candidate.finishReason);
      Logger.log('レスポンス全体: ' + JSON.stringify(result));
      return 'フィードバック生成に失敗しました。(理由: 出力が生成されませんでした)';
    }

    Logger.log('Gemini API 予期しないレスポンス: ' + responseText);
    return 'フィードバック生成に失敗しました。';

  } catch (error) {
    Logger.log('API呼び出しエラー: ' + error);
    Logger.log('エラー詳細: ' + error.stack);
    return 'フィードバック生成中にエラーが発生しました: ' + error.message;
  }
}

// ==========================================
// メールフォーマッティング
// ==========================================

// 個人用フィードバックメールのHTMLを作成
function formatFeedbackEmail(userName, feedback, dateString, userData, types, customers) {
  let html = '<html><head><meta charset="utf-8"></head><body style="font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">';

  // ヘッダー
  html += '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">';
  html += '<h1 style="margin: 0; font-size: 24px;">お疲れさまでした、' + userName + 'さん!</h1>';
  html += '<p style="margin: 10px 0 0 0; opacity: 0.9;">' + dateString + ' の業務フィードバック</p>';
  html += '</div>';

  // 業務サマリー
  html += '<div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 5px;">';
  html += '<h2 style="margin-top: 0; color: #333;">📊 業務サマリー</h2>';
  html += '<table style="width: 100%; border-collapse: collapse;">';
  html += '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6;"><strong>稼働時間:</strong></td><td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6; text-align: right; font-size: 18px; color: #667eea;">' + (feedback.totalDuration ? feedback.totalDuration.toFixed(2) : '0.00') + ' 時間</td></tr>';
  html += '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6;"><strong>完了タスク数:</strong></td><td style="padding: 12px 8px; border-bottom: 1px solid #dee2e6; text-align: right; font-size: 18px; color: #667eea;">' + (feedback.taskCount || 0) + ' 件</td></tr>';

  if (feedback.mostTimeTask) {
    let taskDuration = feedback.mostTimeTask.duration;
    if (typeof taskDuration === 'number') {
      taskDuration = taskDuration.toFixed(2) + '時間';
    } else if (taskDuration instanceof Date) {
      const hours = taskDuration.getHours();
      const minutes = taskDuration.getMinutes();
      taskDuration = hours + ':' + String(minutes).padStart(2, '0');
    }
    html += '<tr><td style="padding: 12px 8px;"><strong>最も時間をかけたタスク:</strong></td><td style="padding: 12px 8px; text-align: right; color: #495057;">' + (feedback.mostTimeTask.content || '（内容なし）') + '<br><span style="font-size: 14px; color: #6c757d;">(' + taskDuration + ')</span></td></tr>';
  }

  html += '</table>';
  html += '</div>';

  // タスク一覧
  if (userData && Array.isArray(userData) && userData.length > 0) {
    html += '<div style="margin-bottom: 30px;">';
    html += '<h2 style="color: #333;">📝 本日のタスク一覧</h2>';

    for (let i = 0; i < userData.length; i++) {
      const task = userData[i];
      const typeName = types[task.type] || task.type || '未分類';
      const customerName = customers[task.customer] || task.customer || '未指定';

      let taskDuration = task.duration;
      if (typeof taskDuration === 'number') {
        taskDuration = taskDuration.toFixed(2) + '時間';
      } else if (taskDuration instanceof Date) {
        const hours = taskDuration.getHours();
        const minutes = taskDuration.getMinutes();
        taskDuration = hours + ':' + String(minutes).padStart(2, '0');
      }

      html += '<div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 15px; margin-bottom: 15px; border-radius: 5px;">';
      html += '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">';
      html += '<strong style="color: #495057;">' + (i + 1) + '. ' + (task.content || '（内容なし）') + '</strong>';
      html += '<span style="color: #667eea; font-weight: bold;">' + taskDuration + '</span>';
      html += '</div>';
      html += '<div style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">';
      html += '顧客: ' + customerName + ' | 種別: ' + typeName;
      html += '</div>';

      if (task.target) {
        html += '<div style="font-size: 14px; color: #495057; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #dee2e6;">';
        html += '<strong>目標:</strong> ' + task.target;
        html += '</div>';
      }

      if (task.impression) {
        html += '<div style="font-size: 14px; color: #495057; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #dee2e6;">';
        html += '<strong>所感:</strong> ' + task.impression;
        html += '</div>';
      }

      html += '</div>';
    }
    html += '</div>';
  }

  // AI評価
  html += '<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px;">';
  html += '<h2 style="margin-top: 0;">✨ AIからのフィードバック</h2>';
  html += '<div style="background-color: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 5px; line-height: 1.8;">';
  html += (feedback.aiComment || 'フィードバック取得中...').replace(/\n/g, '<br>');
  html += '</div>';
  html += '</div>';

  // フッター
  html += '<div style="text-align: center; padding-top: 20px; border-top: 2px solid #dee2e6;">';
  html += '<p style="font-size: 12px; color: #6c757d; margin: 5px 0;">このメールは業務管理システムから自動送信されています</p>';
  html += '<p style="font-size: 12px; color: #6c757d; margin: 5px 0;">明日も頑張りましょう!</p>';
  html += '</div>';

  html += '</body></html>';

  return html;
}

// ==========================================
// 管理者向けサマリー
// ==========================================

function sendAdminSummary(dateString, individualFeedbacks, userGroups, types, customers) {
  const adminEmail = CONFIG.ADMIN_EMAIL;

  if (!adminEmail) {
    Logger.log('管理者メールアドレスが設定されていません');
    return;
  }

  if (!userGroups) {
    Logger.log('警告: userGroupsが無効です');
    userGroups = {};
  }

  if (!individualFeedbacks || !Array.isArray(individualFeedbacks)) {
    Logger.log('警告: individualFeedbacksが無効です');
    individualFeedbacks = [];
  }

  // 統計データを計算
  const userCount = Object.keys(userGroups).length || 0;

  let totalTaskCount = 0;
  for (const userId in userGroups) {
    if (userGroups.hasOwnProperty(userId) && Array.isArray(userGroups[userId])) {
      totalTaskCount += userGroups[userId].length;
    }
  }

  let totalHours = 0;
  for (const userId in userGroups) {
    if (userGroups.hasOwnProperty(userId)) {
      totalHours += calculateTotalDuration(userGroups[userId]);
    }
  }

  // 管理者向けAI分析を生成
  const managementInsight = generateManagementInsight(individualFeedbacks, userGroups, totalHours, totalTaskCount, userCount, types, customers);

  // サマリーHTMLを作成
  let html = '<html><head><meta charset="utf-8"></head><body style="font-family: sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px;">';

  // ヘッダー
  html += '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">';
  html += '<h1 style="margin: 0; font-size: 28px;">管理者レポート</h1>';
  html += '<p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">' + dateString + ' チーム業務サマリー</p>';
  html += '</div>';

  // 全体統計
  html += '<div style="background-color: #f8f9fa; padding: 25px; margin-bottom: 30px; border-radius: 10px;">';
  html += '<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">■ 全体統計</h2>';
  html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">';

  html += '<div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
  html += '<div style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">対象メンバー</div>';
  html += '<div style="font-size: 28px; font-weight: bold; color: #667eea;">' + userCount + ' <span style="font-size: 16px;">名</span></div>';
  html += '</div>';

  html += '<div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
  html += '<div style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">総稼働時間</div>';
  html += '<div style="font-size: 28px; font-weight: bold; color: #667eea;">' + totalHours.toFixed(1) + ' <span style="font-size: 16px;">時間</span></div>';
  html += '</div>';

  html += '<div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
  html += '<div style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">総タスク数</div>';
  html += '<div style="font-size: 28px; font-weight: bold; color: #667eea;">' + totalTaskCount + ' <span style="font-size: 16px;">件</span></div>';
  html += '</div>';

  html += '<div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
  html += '<div style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">平均稼働時間</div>';
  html += '<div style="font-size: 28px; font-weight: bold; color: #667eea;">' + (userCount > 0 ? (totalHours / userCount).toFixed(1) : '0.0') + ' <span style="font-size: 16px;">時間/人</span></div>';
  html += '</div>';

  html += '</div>';
  html += '</div>';

  // AIによるマネジメント分析
  html += '<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px;">';
  html += '<h2 style="margin-top: 0;">★ AIマネジメント分析</h2>';
  html += '<div style="background-color: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 8px; line-height: 1.8;">';
  html += managementInsight.replace(/\n/g, '<br>');
  html += '</div>';
  html += '</div>';

  // メンバー別詳細
  html += '<div style="background-color: white; padding: 25px; margin-bottom: 30px; border-radius: 10px; border: 1px solid #dee2e6;">';
  html += '<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">■ メンバー別詳細</h2>';

  for (let i = 0; i < individualFeedbacks.length; i++) {
    const feedback = individualFeedbacks[i];
    html += '<div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 5px;">';
    html += '<h3 style="margin-top: 0; color: #495057;">' + (feedback.userName || '不明') + '</h3>';

    html += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">';

    html += '<div>';
    html += '<div style="font-size: 12px; color: #6c757d;">稼働時間</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: #667eea;">' + (feedback.feedback && feedback.feedback.totalDuration ? feedback.feedback.totalDuration.toFixed(2) : '0.00') + ' 時間</div>';
    html += '</div>';

    html += '<div>';
    html += '<div style="font-size: 12px; color: #6c757d;">タスク数</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: #667eea;">' + (feedback.feedback && feedback.feedback.taskCount ? feedback.feedback.taskCount : 0) + ' 件</div>';
    html += '</div>';

    html += '<div>';
    html += '<div style="font-size: 12px; color: #6c757d;">平均タスク時間</div>';
    html += '<div style="font-size: 20px; font-weight: bold; color: #667eea;">' + (feedback.feedback && feedback.feedback.taskCount > 0 ? (feedback.feedback.totalDuration / feedback.feedback.taskCount).toFixed(2) : '0.00') + ' 時間</div>';
    html += '</div>';

    html += '</div>';

    if (feedback.feedback && feedback.feedback.mostTimeTask) {
      html += '<div style="background-color: white; padding: 12px; border-radius: 5px; margin-top: 10px;">';
      html += '<div style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">最も時間をかけたタスク</div>';
      html += '<div style="color: #495057;">' + (feedback.feedback.mostTimeTask.content || '（内容なし）') + '</div>';
      html += '</div>';
    }

    html += '</div>';
  }

  html += '</div>';

  // フッター
  html += '<div style="text-align: center; padding-top: 20px; border-top: 2px solid #dee2e6;">';
  html += '<p style="font-size: 12px; color: #6c757d; margin: 5px 0;">管理者向け業務レポート - 自動生成</p>';
  html += '<p style="font-size: 12px; color: #6c757d; margin: 5px 0;">送信日時: ' + new Date().toLocaleString('ja-JP') + '</p>';
  html += '</div>';

  html += '</body></html>';

  try {
    GmailApp.sendEmail(adminEmail, '[管理者レポート] ' + dateString + ' チーム業務サマリー', '', { htmlBody: html });
    Logger.log('管理者へのサマリーメール送信完了: ' + adminEmail);
  } catch (error) {
    Logger.log('管理者メール送信エラー: ' + error);
    Logger.log('エラー詳細: ' + error.stack);
  }
}

// ==========================================
// エラー通知
// ==========================================

function sendErrorNotification(error) {
  const adminEmail = CONFIG.ADMIN_EMAIL;

  // 修正: 管理者メールが設定されていれば送信
  if (adminEmail) {
    try {
      const errorMessage = 'エラーが発生しました:\n\n' +
                          'メッセージ: ' + error.toString() + '\n\n' +
                          'スタックトレース:\n' + (error.stack || '（なし）');

      GmailApp.sendEmail(adminEmail, 'タイムトラッキングフィードバック送信エラー', errorMessage);
      Logger.log('エラー通知送信完了');
    } catch (e) {
      Logger.log('エラー通知送信失敗: ' + e);
    }
  }
}

// ==========================================
// トリガー設定用関数
// ==========================================

// 毎日8:00に実行するトリガーを設定
function setupDailyTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyFeedback') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // 新しいトリガーを作成
  ScriptApp.newTrigger('sendDailyFeedback')
    .timeBased()
    .atHour(CONFIG.FEEDBACK_TIME)
    .everyDays(1)
    .create();

  Logger.log('トリガー設定完了: 毎日' + CONFIG.FEEDBACK_TIME + ':00に実行');
}

// トリガーを削除
function deleteDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyFeedback') {
      ScriptApp.deleteTrigger(triggers[i]);
      Logger.log('トリガー削除完了');
    }
  }
}

// ==========================================
// テスト実行関数
// ==========================================

// テスト用: 今日のデータで動作確認
function testFeedbackToday() {
  Logger.log('=== テスト実行（今日のデータ） ===');

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const todayString = year + '-' + month + '-' + date;

  Logger.log('対象日付: ' + todayString);

  // 今日のデータを取得してテスト
  const todayData = getYesterdayData(todayString);
  Logger.log('取得データ件数: ' + todayData.length);

  if (todayData.length === 0) {
    Logger.log('今日のデータがありません');
    return;
  }

  const userGroups = groupDataByUser(todayData);
  const users = getUserMaster();
  const types = getTypeMaster();
  const customers = getCustomerMaster();

  Logger.log('ユーザーグループ数: ' + Object.keys(userGroups).length);

  // 最初のユーザーのみテスト送信
  for (const userId in userGroups) {
    const userData = userGroups[userId];
    const user = users.find(u => u.id === userId);

    if (!user || !user.email) {
      Logger.log('ユーザー ' + userId + ' のメールアドレスが見つかりません');
      continue;
    }

    Logger.log('テストユーザー: ' + user.name);

    const feedback = generateAIFeedback(userData, types, customers);
    Logger.log('フィードバック生成完了');
    Logger.log('AIコメント: ' + feedback.aiComment);

    // メール送信（コメントアウトを外すと実際に送信される）
    // const subject = todayString + ' の業務フィードバック（テスト）';
    // const htmlBody = formatFeedbackEmail(user.name, feedback, todayString);
    // GmailApp.sendEmail(user.email, subject, '', { htmlBody: htmlBody });
    // Logger.log('テストメール送信完了');

    break; // 最初のユーザーのみ
  }

  Logger.log('=== テスト完了 ===');
}

// 標準のテスト関数（前日データ）
function testFeedback() {
  Logger.log('=== テスト開始（前日データ） ===');
  sendDailyFeedback();
  Logger.log('=== テスト完了 ===');
}

// データ取得のみテスト
function testDataRetrieval() {
  Logger.log('=== データ取得テスト ===');

  const yesterday = getYesterdayString();
  Logger.log('対象日: ' + yesterday);

  const data = getYesterdayData(yesterday);
  Logger.log('データ件数: ' + data.length);

  if (data.length > 0) {
    Logger.log('サンプルデータ[0]:');
    Logger.log('  userId: "' + data[0].userId + '"');
    Logger.log('  content: "' + data[0].content + '"');
  }

  const users = getUserMaster();
  Logger.log('ユーザー数: ' + users.length);

  const types = getTypeMaster();
  Logger.log('種別数: ' + Object.keys(types).length);

  const customers = getCustomerMaster();
  Logger.log('顧客数: ' + Object.keys(customers).length);

  Logger.log('=== テスト完了 ===');
}

// ユーザーマスター詳細確認用
function testUserMaster() {
  Logger.log('=== ユーザーマスター詳細テスト ===');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.users);

  if (!sheet) {
    Logger.log('エラー: ユーザー管理シートが見つかりません');
    return;
  }

  const data = sheet.getDataRange().getValues();

  Logger.log('行数: ' + data.length);
  Logger.log('ヘッダー行: ' + JSON.stringify(data[0]));

  if (data.length > 1) {
    Logger.log('データ行[1]: ' + JSON.stringify(data[1]));
  }

  const users = getUserMaster();
  Logger.log('取得結果: ' + JSON.stringify(users));

  Logger.log('=== テスト完了 ===');
}
