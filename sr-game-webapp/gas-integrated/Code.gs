/**
 * 社労士ゲームアプリ - Google Apps Script 統合版
 * すべてのコードをGAS内で完結
 */

// スプレッドシートIDを設定（初回実行後に自動的に設定されます）
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

// CardNameのリスト
const CARD_NAMES = [
  '手続き業務',
  '就業規則チェック',
  '助成金',
  '雇用契約書',
  'メンタルヘルス勉強会',
  'ハラスメント勉強会',
  '労務相談・コンサルティング',
  '年金に関するアドバイス',
  '労働トラブルの解決支援',
  '労働安全衛生管理',
  '採用支援',
  '労務監査',
  '給与計算・勤怠管理',
  '労働基準法対応支援',
  '職場環境改善提案',
  '労働時間管理',
  '育児・介護両立支援',
  '企業年金制度',
  '社会保険対応支援',
  '教育訓練給付金支援',
  '高年齢者雇用促進',
  '変形労働時間制導入支援',
  '正社員化促進',
  '女性活躍化支援',
  '有給休暇取得促進',
  '外国人労働者雇用支援'
];

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

  // 相談内容マスタシートの作成
  createConsultationSheet(spreadsheet);

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
 * 相談内容マスタシートの作成
 */
function createConsultationSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Consultations');

  if (!sheet) {
    sheet = spreadsheet.insertSheet('Consultations');

    // ヘッダー行とデータ
    const data = [
      ['ID', 'ConsultationText'],
      ['Q01', '社員育成や社員の成長をもっと促すにはどうすればよいでしょうか？'],
      ['Q02', '65歳までの雇用確保措置の現状について教えてください'],
      ['Q03', '本意ではない解雇を予告してしまいましたが、どうすればいいでしょうか？'],
      ['Q04', '人材の定着率を上げるにはどうすればよいでしょうか？'],
      ['Q05', '定年退職した社員を再雇用するときの一般的な勤務条件はどのようにすればいいですか？'],
      ['Q06', '中途採用の社員の給料は、どのように決めればよいのでしょうか？'],
      ['Q07', '採用の内定を取り消すことはできますか？'],
      ['Q08', '若い女性社員のやる気のでるような福利厚生を教えてください'],
      ['Q09', '派遣社員を活用するうえでの留意点を教えてください。'],
      ['Q10', '年俸制を採用すれば、残業代を支払う必要はないのですか？'],
      ['Q11', '業績連動型の給与体系を導入する際の注意点について教えてください。'],
      ['Q12', '成果主義を導入したのに業績がよくならないのはなぜでしょうか？'],
      ['Q13', '働くママへの支援策にはどのようなものがありますか？'],
      ['Q14', '月末の残業を減らし、賃金コストを抑える方法を教えてください。'],
      ['Q15', '社員の能力が伸びる職場環境を構築したいのですが、どうすればよいでしょうか？'],
      ['Q16', '正社員にマネジメント業務を十分に行わせるにはどうすればよいですか？'],
      ['Q17', '接客マニュアルをつくる際の注意点について教えてください'],
      ['Q18', '長時間労働を改善するための取り組みを教えてください'],
      ['Q19', '残業手当の未払い問題を起こさないための留意点はありますか？'],
      ['Q20', '会議時に出席者の発言が少なく、困っています'],
      ['Q21', '有給を使う人とそうでない人の差が激しくなっています。どうすればいいですか？'],
      ['Q22', '社員同士の仲が悪くて困っています。よい解決方法はありませんか？'],
      ['Q23', '社員研修の効果的な方法を教えてください。'],
      ['Q24', 'パートを成長させて有用な人材として活用するには、どうしたらよいでしょうか？'],
      ['Q25', '無駄な業務をなくして効率化を図るには、どのようにすればよいでしょうか？'],
      ['Q26', 'コンプライアンスってなんですか？'],
      ['Q27', 'うちの業界で起きやすい労災事故ってどんなものがありますか？'],
      ['Q28', '書類や文字で表現できない技術を若手に継承したいのですがどうすればいいですか？'],
      ['Q29', '社労士に業務を依頼するメリットを教えてください'],
      ['Q30', '社内コミュニケーションがうまくいかない場合の改善策を教えてください'],
      ['Q31', '新入社員がすぐ辞めてしまうので、定着率を高める方法を教えてください。'],
      ['Q32', '休日出勤が多く、どのように管理すればいいのかわかりません'],
      ['Q33', '固定残業代制度と通常の残業代の違いについて知りたい。'],
      ['Q34', '定期的なストレスチェックはどのように運用すべきですか？'],
      ['Q35', '部下に指導、注意ができない上司が多いです。どうすればよいでしょう？'],
      ['Q36', '社員が管理職になりたがりません。どうすればよいでしょう？'],
      ['Q37', '昇給しても社会保険料や税金が上がって社員に実感してもらえません。何か良い策はないですか？'],
      ['Q38', '将来、会社を子どもに継ぎたいのですが、どうすればよいでしょうか？'],
      ['Q39', '外国人を採用していきたいのですが、注意点はありますか？'],
      ['Q40', 'フレックスタイム制を導入しようと思うのですが、注意すべき点はありますか？'],
      ['Q41', '社内会議の時間が多く、その割にはなかなか物事が進みません。どうすればよいでしょうか？'],
      ['Q42', '社員がレポートラインを守ってくれません。報連相もないです。何か良い改善策はありますか？'],
      ['Q43', '管理職が上からの指示待ちなど受け身な姿勢で心配です。意識を改めるにはどうすればよいでしょうか？'],
      ['Q44', '出来の悪い新入社員を即刻やめさせたいのですが、なにか気を付けることはあるでしょうか？'],
      ['Q45', '男性にも育児休業取得させたいが、なかなか取得する社員がいません。どうしたら取得させることができますか？'],
      ['Q46', '「副業したい」と社員から申し出を受けました。どのように対応したらよいでしょうか？'],
      ['Q47', '総務部に長年勤務していた社員を営業に異動させたいのですが、問題ないでしょうか？'],
      ['Q48', '働き方改革を推進してきたが、若手社員から「この会社では成長できない。」と言われてしまいました。何か良い解決策はありませんか？']
    ];

    sheet.getRange(1, 1, data.length, 2).setValues(data);

    // ヘッダーのスタイル設定
    sheet.getRange(1, 1, 1, 2)
      .setBackground('#fbbc04')
      .setFontColor('#ffffff')
      .setFontWeight('bold');

    // 列幅の自動調整
    sheet.autoResizeColumns(1, 2);

    Logger.log('Consultationsシート作成完了');
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
 * 全相談内容を取得
 */
function getAllConsultations() {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Consultations');

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  return data.map(row => ({
    id: row[0],
    text: row[1]
  }));
}

/**
 * ランダムにCardNameを2つ取得
 */
function getRandomCardNames() {
  // Fisher-Yatesシャッフルアルゴリズムで配列をシャッフル
  const shuffled = CARD_NAMES.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 最初の2つを返す
  return [shuffled[0], shuffled[1]];
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
 * 現在のスクリプトURLを取得
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
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
