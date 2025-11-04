/**
 * 社労士ゲームアプリ - Google Apps Script 統合版
 * すべてのコードをGAS内で完結
 */

// スプレッドシートIDを設定（初回実行後に自動的に設定されます）
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

/**
 * スプレッドシートの初期化
 * 初回のみ実行してスプレッドシートを作成
 */
function initializeSpreadsheet() {
  let spreadsheet;

  // 既存のスプレッドシートIDがあるかチェック
  const existingId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

  if (existingId) {
    try {
      spreadsheet = SpreadsheetApp.openById(existingId);
      Logger.log('既存のスプレッドシートを使用: ' + spreadsheet.getUrl());
    } catch (e) {
      Logger.log('既存のスプレッドシートが見つかりません。新規作成します。');
      spreadsheet = null;
    }
  }

  // スプレッドシートが存在しない場合は新規作成
  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create('社労士ゲーム - データベース');
    const newId = spreadsheet.getId();
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', newId);
    Logger.log('新規スプレッドシート作成: ' + spreadsheet.getUrl());
  }

  // ユーザーシートの作成
  createUsersSheet(spreadsheet);

  // メインDBシートの作成
  createMainSheet(spreadsheet);

  Logger.log('スプレッドシートの初期化完了: ' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

/**
 * ユーザー管理シートの作成
 */
function createUsersSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Users');

  if (!sheet) {
    sheet = spreadsheet.insertSheet('Users');

    // ヘッダー行
    const headers = ['ID', '名前', 'メール', '登録日時'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // ヘッダーのスタイル設定
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#4285f4')
      .setFontColor('#ffffff')
      .setFontWeight('bold');

    // 列幅の自動調整
    sheet.autoResizeColumns(1, headers.length);

    Logger.log('Usersシート作成完了');
  }

  return sheet;
}

/**
 * メインDBシートの作成
 */
function createMainSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('MainDB');

  if (!sheet) {
    sheet = spreadsheet.insertSheet('MainDB');

    // ヘッダー行
    const headers = [
      'SelectionID',
      'PlayerName',
      'Industry',
      'ConsultationText',
      'CardName',
      'Response',
      'CreatedAt',
      'Score',
      'Comment',
      'Advice',
      'Demo'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // ヘッダーのスタイル設定
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#34a853')
      .setFontColor('#ffffff')
      .setFontWeight('bold');

    // 列幅の自動調整
    sheet.autoResizeColumns(1, headers.length);

    Logger.log('MainDBシート作成完了');
  }

  return sheet;
}

/**
 * スプレッドシートを取得
 */
function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) {
    throw new Error('スプレッドシートが初期化されていません。initializeSpreadsheet()を実行してください。');
  }
  return SpreadsheetApp.openById(id);
}

/**
 * ユーザー登録（管理者用）
 */
function registerUser(name, email = '') {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Users');

  // 最後のIDを取得して自動採番
  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;

  // 新規ユーザーを追加
  const newRow = [
    newId,
    name,
    email,
    new Date()
  ];

  sheet.appendRow(newRow);

  Logger.log('ユーザー登録完了: ID=' + newId + ', Name=' + name);
  return { id: newId, name: name, email: email };
}

/**
 * 全ユーザーを取得
 */
function getAllUsers() {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Users');

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  return data.map(row => ({
    id: row[0],
    name: row[1],
    email: row[2]
  }));
}

/**
 * プレイデータの保存
 */
function savePlayData(data) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName('MainDB');

  // SelectionIDを自動生成
  const lastRow = sheet.getLastRow();
  const selectionId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;

  // 業界を配列から文字列に変換（カンマ区切り）
  const industryStr = Array.isArray(data.industry) ? data.industry.join(', ') : data.industry;

  const newRow = [
    selectionId,
    data.playerName || '',
    industryStr || '',
    data.consultationText || '',
    data.cardName || '',
    data.response || '',
    new Date(),
    data.score || '',
    data.comment || '',
    data.advice || '',
    data.demo || ''
  ];

  sheet.appendRow(newRow);

  Logger.log('プレイデータ保存完了: SelectionID=' + selectionId);
  return { selectionId: selectionId };
}

/**
 * スプレッドシートURLを取得
 */
function getSpreadsheetUrl() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) {
    return null;
  }
  const spreadsheet = SpreadsheetApp.openById(id);
  return spreadsheet.getUrl();
}

/**
 * Web API - GET リクエスト処理
 * メイン画面または管理画面を表示
 */
function doGet(e) {
  const page = e.parameter.page || 'index';

  if (page === 'admin') {
    return HtmlService.createTemplateFromFile('admin')
      .evaluate()
      .setTitle('管理者画面 - 社労士ゲーム')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('社労士ゲーム')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * HTMLファイルの内容を取得（インクルード用）
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * テスト用：サンプルユーザーを登録
 */
function testRegisterUsers() {
  registerUser('田中太郎', 'tanaka@example.com');
  registerUser('鈴木花子', 'suzuki@example.com');
  registerUser('佐藤次郎');
  Logger.log('テストユーザー登録完了');
}
