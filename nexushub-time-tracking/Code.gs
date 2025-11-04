// NexusHub Time Tracking System
// タイムトラッキングシステム

// スプレッドシートのIDを設定（初回実行時に自動作成）
const SPREADSHEET_ID_PROPERTY = 'TIME_TRACKING_SPREADSHEET_ID';

function doGet(e) {
  const page = e.parameter.page || 'personal';

  if (page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('Admin')
      .setTitle('NexusHub - 勤怠管理ダッシュボード')
      .setFaviconUrl('https://img.icons8.com/fluency/96/clock.png');
  }

  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('NexusHub - タイムトラッキング')
    .setFaviconUrl('https://img.icons8.com/fluency/96/clock.png');
}

// スプレッドシートを取得または作成
function getOrCreateSpreadsheet() {
  const scriptProperties = PropertiesService.getScriptProperties();
  let spreadsheetId = scriptProperties.getProperty(SPREADSHEET_ID_PROPERTY);

  if (!spreadsheetId) {
    // スプレッドシートを新規作成
    const ss = SpreadsheetApp.create('NexusHub Time Tracking Data');
    spreadsheetId = ss.getId();
    scriptProperties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheetId);

    // タイムエントリーシート
    const timeSheet = ss.getActiveSheet();
    timeSheet.setName('TimeEntries');
    timeSheet.getRange('A1:H1').setValues([[
      'ID', 'ユーザーメール', 'ユーザー名', '開始時刻', '終了時刻',
      'プロジェクト', 'タスク', 'メモ'
    ]]);
    timeSheet.setFrozenRows(1);
    timeSheet.getRange('A1:H1').setFontWeight('bold');

    // プロジェクトシート
    const projectSheet = ss.insertSheet('Projects');
    projectSheet.getRange('A1:C1').setValues([['プロジェクト名', '説明', '作成日']]);
    projectSheet.setFrozenRows(1);
    projectSheet.getRange('A1:C1').setFontWeight('bold');

    Logger.log('新しいスプレッドシートを作成しました: ' + ss.getUrl());
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

// ユーザー情報を取得
function getUserInfo() {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();

    return {
      email: email,
      name: email.split('@')[0]
    };
  } catch (error) {
    Logger.log('Error fetching user info: ' + error.toString());
    const user = Session.getActiveUser();
    return {
      email: user.getEmail(),
      name: user.getEmail().split('@')[0]
    };
  }
}

// タイムトラッキング: 開始
function startTimeTracking(project, task, memo) {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    // 既に開始中のエントリーがあるかチェック
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][1] === user.email && !data[i][4]) {
        return {
          success: false,
          error: '既に進行中のタイムトラッキングがあります'
        };
      }
    }

    const id = Utilities.getUuid();
    const startTime = new Date();

    sheet.appendRow([
      id,
      user.email,
      user.name,
      startTime,
      '', // 終了時刻は空
      project || '',
      task || '',
      memo || ''
    ]);

    return {
      success: true,
      message: 'タイムトラッキングを開始しました',
      id: id,
      startTime: startTime.getTime()
    };
  } catch (error) {
    Logger.log('Error starting time tracking: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// タイムトラッキング: 停止
function stopTimeTracking() {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][1] === user.email && !data[i][4]) {
        const endTime = new Date();
        sheet.getRange(i + 1, 5).setValue(endTime);

        const startTime = new Date(data[i][3]);
        const duration = (endTime - startTime) / 1000 / 60; // 分

        return {
          success: true,
          message: 'タイムトラッキングを停止しました',
          duration: Math.round(duration),
          startTime: startTime.getTime(),
          endTime: endTime.getTime()
        };
      }
    }

    return {
      success: false,
      error: '進行中のタイムトラッキングが見つかりません'
    };
  } catch (error) {
    Logger.log('Error stopping time tracking: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// 現在進行中のタイムトラッキングを取得
function getCurrentTimeTracking() {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][1] === user.email && !data[i][4]) {
        return {
          success: true,
          tracking: {
            id: data[i][0],
            startTime: new Date(data[i][3]).getTime(),
            project: data[i][5],
            task: data[i][6],
            memo: data[i][7]
          }
        };
      }
    }

    return {
      success: true,
      tracking: null
    };
  } catch (error) {
    Logger.log('Error getting current time tracking: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// タイムエントリーの一覧を取得（個人用）
function getTimeEntries(startDate, endDate) {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    const entries = [];

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === user.email && data[i][4]) {
        const entryDate = new Date(data[i][3]);
        if (entryDate >= start && entryDate <= end) {
          const startTime = new Date(data[i][3]);
          const endTime = new Date(data[i][4]);
          const duration = (endTime - startTime) / 1000 / 60; // 分

          entries.push({
            id: data[i][0],
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
            duration: Math.round(duration),
            project: data[i][5],
            task: data[i][6],
            memo: data[i][7]
          });
        }
      }
    }

    // 新しい順にソート
    entries.sort((a, b) => b.startTime - a.startTime);

    return {
      success: true,
      entries: entries
    };
  } catch (error) {
    Logger.log('Error getting time entries: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      entries: []
    };
  }
}

// 今日の作業時間サマリーを取得
function getTodaySummary() {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const data = sheet.getDataRange().getValues();
    let totalMinutes = 0;
    let entryCount = 0;
    const projectTime = {};

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === user.email && data[i][4]) {
        const entryDate = new Date(data[i][3]);
        if (entryDate >= today && entryDate < tomorrow) {
          const startTime = new Date(data[i][3]);
          const endTime = new Date(data[i][4]);
          const duration = (endTime - startTime) / 1000 / 60;

          totalMinutes += duration;
          entryCount++;

          const project = data[i][5] || '未分類';
          projectTime[project] = (projectTime[project] || 0) + duration;
        }
      }
    }

    return {
      success: true,
      totalMinutes: Math.round(totalMinutes),
      totalHours: (totalMinutes / 60).toFixed(1),
      entryCount: entryCount,
      projectTime: projectTime
    };
  } catch (error) {
    Logger.log('Error getting today summary: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// 週のサマリーを取得
function getWeeklySummary() {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const data = sheet.getDataRange().getValues();
    const dailyTime = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateKey = formatDateKey(date);
      dailyTime[dateKey] = 0;
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === user.email && data[i][4]) {
        const entryDate = new Date(data[i][3]);
        if (entryDate >= monday && entryDate < nextMonday) {
          const startTime = new Date(data[i][3]);
          const endTime = new Date(data[i][4]);
          const duration = (endTime - startTime) / 1000 / 60;

          const dateKey = formatDateKey(entryDate);
          dailyTime[dateKey] = (dailyTime[dateKey] || 0) + duration;
        }
      }
    }

    return {
      success: true,
      dailyTime: dailyTime
    };
  } catch (error) {
    Logger.log('Error getting weekly summary: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// タイムエントリーを編集
function updateTimeEntry(id, project, task, memo) {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id && data[i][1] === user.email) {
        sheet.getRange(i + 1, 6).setValue(project || '');
        sheet.getRange(i + 1, 7).setValue(task || '');
        sheet.getRange(i + 1, 8).setValue(memo || '');

        return {
          success: true,
          message: 'タイムエントリーを更新しました'
        };
      }
    }

    return {
      success: false,
      error: 'タイムエントリーが見つかりません'
    };
  } catch (error) {
    Logger.log('Error updating time entry: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// タイムエントリーを削除
function deleteTimeEntry(id) {
  try {
    const user = getUserInfo();
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id && data[i][1] === user.email) {
        sheet.deleteRow(i + 1);

        return {
          success: true,
          message: 'タイムエントリーを削除しました'
        };
      }
    }

    return {
      success: false,
      error: 'タイムエントリーが見つかりません'
    };
  } catch (error) {
    Logger.log('Error deleting time entry: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// プロジェクト一覧を取得
function getProjects() {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('Projects');

    const data = sheet.getDataRange().getValues();
    const projects = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        projects.push({
          name: data[i][0],
          description: data[i][1] || '',
          createdAt: data[i][2] ? new Date(data[i][2]).getTime() : null
        });
      }
    }

    return {
      success: true,
      projects: projects
    };
  } catch (error) {
    Logger.log('Error getting projects: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      projects: []
    };
  }
}

// プロジェクトを追加
function addProject(name, description) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('Projects');

    sheet.appendRow([name, description || '', new Date()]);

    return {
      success: true,
      message: 'プロジェクトを追加しました'
    };
  } catch (error) {
    Logger.log('Error adding project: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// 管理者用: 全員のタイムエントリーを取得
function getAllTimeEntries(startDate, endDate) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    const entries = [];

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    for (let i = 1; i < data.length; i++) {
      if (data[i][4]) {
        const entryDate = new Date(data[i][3]);
        if (entryDate >= start && entryDate <= end) {
          const startTime = new Date(data[i][3]);
          const endTime = new Date(data[i][4]);
          const duration = (endTime - startTime) / 1000 / 60;

          entries.push({
            id: data[i][0],
            email: data[i][1],
            name: data[i][2],
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
            duration: Math.round(duration),
            project: data[i][5],
            task: data[i][6],
            memo: data[i][7]
          });
        }
      }
    }

    entries.sort((a, b) => b.startTime - a.startTime);

    return {
      success: true,
      entries: entries
    };
  } catch (error) {
    Logger.log('Error getting all time entries: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      entries: []
    };
  }
}

// 管理者用: ユーザー別のサマリーを取得
function getUsersSummary(startDate, endDate) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('TimeEntries');

    const data = sheet.getDataRange().getValues();
    const userSummary = {};

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    for (let i = 1; i < data.length; i++) {
      if (data[i][4]) {
        const entryDate = new Date(data[i][3]);
        if (entryDate >= start && entryDate <= end) {
          const email = data[i][1];
          const name = data[i][2];
          const startTime = new Date(data[i][3]);
          const endTime = new Date(data[i][4]);
          const duration = (endTime - startTime) / 1000 / 60;
          const project = data[i][5] || '未分類';

          if (!userSummary[email]) {
            userSummary[email] = {
              email: email,
              name: name,
              totalMinutes: 0,
              entryCount: 0,
              projectTime: {}
            };
          }

          userSummary[email].totalMinutes += duration;
          userSummary[email].entryCount++;
          userSummary[email].projectTime[project] =
            (userSummary[email].projectTime[project] || 0) + duration;
        }
      }
    }

    const summaryArray = Object.values(userSummary).map(user => ({
      email: user.email,
      name: user.name,
      totalMinutes: Math.round(user.totalMinutes),
      totalHours: (user.totalMinutes / 60).toFixed(1),
      entryCount: user.entryCount,
      projectTime: user.projectTime
    }));

    summaryArray.sort((a, b) => b.totalMinutes - a.totalMinutes);

    return {
      success: true,
      users: summaryArray
    };
  } catch (error) {
    Logger.log('Error getting users summary: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      users: []
    };
  }
}

// ヘルパー関数: 日付キーのフォーマット
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}
