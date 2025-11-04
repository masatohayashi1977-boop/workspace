// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ============================================================
// Gemini 2.5 powered プロジェクト企画自動生成スクリプト v4.0.0 (Gemini 2.5対応版)
// ============================================================

// -----------------------------
// グローバル設定
// -----------------------------
const API_KEY_PROPERTY      = 'GEMINI_API_KEY';
const SELECTIONS_SHEET_NAME = 'Selections';
const PRE_WORK_SHEET_NAME   = '事前ワーク';

// -----------------------------
// Gemini 2.5 Flash モデル設定
// -----------------------------
const MODEL_NAME  = 'gemini-2.5-flash-preview-04-17';  // ★更新: Gemini 2.5 Flash
const API_VERSION = 'v1beta';                          // ★維持: v1betaのまま

// 代替オプション（利用可能なモデル）:
// const MODEL_NAME  = 'gemini-2.0-flash-exp';                    // Gemini 2.0版（フォールバック用）
// const MODEL_NAME  = 'gemini-2.0-flash-thinking-exp-1219';     // 思考プロセス表示版
// const MODEL_NAME  = 'gemini-1.5-flash-latest';                // 従来版（フォールバック用）

// -----------------------------
// 列インデックス (変更なし)
// -----------------------------
const SELECTIONID_COL         = 1;
const PLAYERNAME_COL          = 2;
const GROUP_COL               = 3;
const CARDNAME_COL            = 4;
const RESPONSE_COL            = 5;
const CREATEDAT_COL           = 6;
const TITLE_COL               = 7;
const ANALYSIS_COL            = 8;
const PROJECT_PLAN_COL        = 9;
const PROJECT_PLAN_SUMMARY_COL= 10;
const PHOTO_COL               = 13;

const TRANSLATION_KEYS = `
TK-META-HRS 人材戦略【メタレベル・優先度5】  採用戦略,人材獲得,タレント確保,専門人材,グローバル採用,リファラル,エージェント活用,内定率向上,選考効率化,人材市場,採用ブランディング,採用体験,面接プロセス,オンボーディング設計,スキル開発,能力向上,研修体系,資格支援,専門教育,リーダーシップ開発,キャリア開発,成長支援,学習機会,外部研修,社内研修,OJT,メンタリング,コーチング,評価制度,組織開発,チーム力,協働,コミュニケーション,組織風土,企業文化,価値観浸透,行動変容,組織変革,変革管理,チェンジマネジメント,組織学習,知識共有,情報共有,透明性 人材システム,HRテック,人事システム,評価システム,勤怠管理,労務管理,人材データベース,スキル管理,キャリア管理,採用管理,研修管理,人材分析,データ活用 人材技術,HR-Tech,人材分析,データサイエンス,AI活用,自動化,効率化,デジタル化,システム化,プラットフォーム,ダッシュボード,可視化,予測分析,意思決定支援  人材ブランド,採用ブランド,雇用ブランド,人材価値,組織魅力,働きがい,職場魅力,企業魅力,人材戦略,タレント戦略,人的資本,人材投資,人材ROI 人材収益,人材価値,生産性,創造性,イノベーション,付加価値,競争力,組織力,チーム力,シナジー,相乗効果,組織成果,業績向上,目標達成  人材投資,教育投資,研修費,採用費,人件費,福利厚生費,人材開発費,組織開発費,システム投資,人材関連投資,ROI,投資効果,費用対効果  人材効率,生産性,効率性,最適化,改善,スピード,正確性,品質,成果,結果,実績,達成度,貢献度,パフォーマンス,成果創出 人材理念,人材哲学,人材価値観,人材文化,人材重視,人間尊重,成長支援,挑戦支援,多様性,包摂性,公平性,機会均等,働きがい,生きがい 人材定着,エンゲージメント,コミットメント,ロイヤルティ,愛社精神,組織愛着,職場愛着,満足度,幸福度,働きがい,やりがい,充実感,達成感,貢献感 人材革新,人材変革,人材進化,組織革新,組織変革,組織進化,働き方革新,制度革新,文化革新,価値観革新,意識革新,行動革新,慣習革신,伝統革新 人材継承,組織継承,文化継承,価値観継承,知識継承,技術継承,スキル継承,経験継承,ノウハウ継承,人材育成,後継者育成,次世代育成,承継計画

TK-META-TEC 技術革新【メタレベル・優先度5】  技術領域,専門技術,コア技術,基盤技術,応用技術,新技術,先端技術,革新技術,独自技術,競争技術,差別化技術,優位技術,戦略技術,重要技術,キー技術,技術人材,エンジニア,研究者,開発者,技術者,専門家,スペシャリスト,アーキテクト,コンサルタント,アナリスト,データサイエンティスト,AI専門家,セキュリティ専門家,技術スキル,開発スキル,エンジニアリング,プログラミング,設計,アーキテクチャ,分析,評価,テスト,デバッグ,最適化,改善,革新,創造,問題解決 技術インフラ,開発環境,本番環境,テスト環境,クラウド基盤,サーバー,ネットワーク,ストレージ,データベース,セキュリティ,監視,運用,保守,管理 技術開発,システム開発,ソフトウェア開発,アプリ開発,AI開発,機械学習,深層学習,データ分析,ビッグデータ,IoT,ブロックチェーン,量子コンピュータ,VR,AR  技術特許,技術ブランド,技術評価,技術認知,技術標準,規格,プロトコル,API,インターフェース,技術仕様,技術文書,技術情報,技術知識,技術ノウハウ 技術収益,技術事業,技術サービス,技術製品,技術ソリューション,技術コンサル,技術支援,技術提供,ライセンス,技術移転,技術販売,技術価値 技術投資,研究開発投資,R&D,設備投資,システム投資,ソフトウェア投資,ハードウェア投資,インフラ投資,技術教育投資,技術人材投資  技術効率,開発効率,運用効率,保守効率,技術生産性,開発生産性,システム効率,処理効率,パフォーマンス,レスポンス,スループット,可用性,信頼性  技術理念,技術哲学,技術文化,イノベーション文化,挑戦文化,実験文化,失敗許容,学習文化,改善文化,品質文化,セキュリティ文化,オープン文化  技術定着,技術継続,技術維持,技術保守,技術サポート,技術運用,システム運用,サービス継続,安定稼働,継続改善,技術進化,バージョンアップ 技術革新,技術変革,技術進化,デジタル変革,DX,技術刷新,システム刷新,プラットフォーム革新,アーキテクチャ革新,技術パラダイム,破壊的技術 技術継承,技術移転,ナレッジ継承,スキル継承,技術教育,技術伝承,技術文書化,技術標準化,技術体系化,技術アーカイブ,技術資産,技術遺産

TK-META-BIZ 事業成長【メタレベル・優先度5】  事業戦略,成長戦略,拡大戦略,展開戦略,多角化戦略,差別化戦略,競争戦略,マーケット戦略,顧客戦略,価格戦略,チャネル戦略,ブランド戦略,国際戦略,事業人材,営業人材,マーケティング人材,企画人材,戦略人材,事業開発人材,新規事業人材,海外事業人材,専門営業,コンサルタント,アカウントマネージャー,事業スキル,営業スキル,マーケティングスキル,企画力,戦略思考,事業開発力,新規開拓力,提案力,交渉力,プレゼン力,分析力,計画力,実行力 事業システム,営業支援システム,CRM,SFA,マーケティングオートメーション,MA,顧客管理,案件管理,売上管理,予算管理,実績管理,分析システム  事業技術,営業技術,マーケティング技術,デジタルマーケティング,Webマーケティング,SNSマーケティング,コンテンツマーケティング,SEO,SEM,データ分析  事業ブランド,商品ブランド,サービスブランド,企業ブランド,営業ブランド,マーケティングブランド,顧客ブランド,市場ブランド,競争ブランド 事業収益,営業収益,売上高,利益率,粗利率,営業利益率,EBITDA,ROE,ROA,売上成長率,利益成長率,市場シェア,顧客シェア,ウォレットシェア 事業投資,営業投資,マーケティング投資,広告宣伝費,販促費,展示会費,人件費,交通費,接待費,システム投資,ツール投資,教育投資  事業効率,営業効率,マーケティング効率,販売効率,顧客獲得効率,CPA,CPC,CPM,ROAS,ROI,LTV,CAC,営業生産性,マーケティング生産性 事業理念,営業理念,マーケティング理念,顧客第一,顧客満足,顧客価値,価値提供,ソリューション提供,パートナーシップ,Win-Win,持続可能 事業定着,顧客定着,営業定着,マーケティング定着,顧客継続,リピート,リテンション,ロイヤルティ,満足度,推奨度,NPS,顧客体験,CX  事業革新,営業革新,マーケティング革新,セールス革新,顧客体験革新,価値提案革新,ビジネスモデル革新,収益モデル革新,チャネル革新 事業継承,営業継承,マーケティング継承,顧客継承,関係継承,ノウハウ継承,手法継承,戦略継承,文化継承,価値観継承,理念継承

TK-HRS001 人材戦略：採用・確保【優先度5】  採用難,人材不足,増員計画,リファラル採用,人材エージェント,グローバル人材,海外リモート,内定承諾,選考迅速化,採用チャネル多様化,博士号取得者,専門職採用,中途採用,新卒採用 スキル・育成,権限移譲,組織健康度,技術統合  心理的安全性,エンゲージメント向上,働き方改革 IT投資,設備投資,インフラ強化,拠点展開 AI活用,自動化,DX推進,技術基盤  知財戦略,ブランド強化 売上成長,事業拡大,収益向上  資金調達,投資計画 コスト効率,ROI向上 理念浸透,企業文化 定着率向上,離職防止  新サービス開発,イノベーション 後継者育成,承継計画

TK-HRS002 人材戦略：スキル・育成【優先度5】 AI基礎研修,専門性向上,資格取得支援,データサイエンス講座,経営コンサル化,アドバンスト研修,職種別研修,ISO30414,社労士研修,英語研修,マネジメント研修,OJT,外部研修,EMBA支援,MBA取得  採用・確保,権限移譲,組織構造 スキル向上,能力開発,キャリアパス 研修設備,学習環境,IT環境  AI統合,技術習得,DXスキル ナレッジ管理,コンテンツ開発  人材投資,教育費,研修ROI  教育投資,スキル開発費 投資効率,教育ROI,人材コスト  人材育成理念,学習文化 人材定着,スキル評価  能力開発,専門性強化  次世代育成,リーダー開発

TK-HRS003 人材戦略：権限・意思決定【優先度4】  ワンマン経営,権限移譲,意思決定力強化,部門別採算制,執行役員制度,自律協調型文化,アジャイルチーム,決裁権限,マネジメント層,部門長責任,拠点長制度,権限分散,組織階層,意思決定プロセス,承認フロー  採用戦略,スキル開発  権限移譲,意思決定,マネジメント  組織改革,体制変更,構造改革  システム権限,デジタル化  ガバナンス,管理体制  事業責任,利益責任,経営判断  予算権限,投資判断 権限別コスト管理,責任会計 権限と責任,経営理念  管理職育成,離職防止  新組織体制,革新的管理 承継体制,経営移行

TK-HRS004 人材戦略：定着・評価【優先度4】  離職率,定着率,eNPS,心理的安全性,オンボーディング,成果連動報酬,アルムナイ制度,福利厚生,ワークライフバランス,職場満足度,エンゲージメント,社員評価,人事考課,インセンティブ,リテンション 人材確保,スキル開発,権限移譲 定着率向上,満足度,エンゲージメント  Well-being,働きやすさ,職場環境 福利厚生システム,評価システム HR-Tech,人事データ分析 人事制度,評価制度 人材コスト,離職コスト,採用コスト 人件費効率,定着投資  福利厚生費,評価制度コスト 働きがい,企業価値 離職率改善,定着率向上 働き方革新,制度革新  人材継承,組織継続

TK-TEC001 技術・イノベーション：AI・自動化【優先度5】 AI基盤強化,RPA,自動化,機械学習,AI書類自動作成,AI労務コンシェルジュ,AI診療報酬分析,AI未来会計,ディープラーニング,自然言語処理,画像認識,音声認識,チャットボット,予測AI,判断AI AI人材,技術者採用  AIスキル,技術研修,データサイエンス AI活用文化,デジタル文化 AI基盤,GPUサーバー,クラウド 自動化技術,AI開発,システム統合 AI特許,技術ブランド,アルゴリズム  AI事業,技術収益,効率化効果 AI投資,技術投資,開発費 自動化効果,効率化,コスト削減 AI活用理念,技術革新 AI人材定着,技術者確保  AI新サービス,技術革新  AI技術継承,デジタル承継

TK-TEC002 技術・イノベーション：SaaS・プラットフォーム【優先度5】  SaaS正式版,βテスト,PoC,プラットフォーム,ダッシュボード,API,クラウド,人的資本ダッシュボード,労務SaaS,医療SaaS,未来会計システム,データ基盤,統合プラットフォーム,マイクロサービス,サービス化 プラットフォーム開発者 システム開発スキル,プラットフォーム運用  開発文化,プロダクト思考  開発基盤,テスト環境,本番環境 プラットフォーム開発,SaaS化  プラットフォーム特許,サービス特許 SaaS収益,プラットフォーム事業 開発投資,プラットフォーム投資 開発効率,運用コスト,収益性  プロダクト思考,顧客価値  開発チーム定着,技術継続  新プラットフォーム,サービス革新  技術承継,プラットフォーム継続

TK-TEC003 技術・イノベーション：システム・インフラ【優先度3】  IT投資,インフラ強化,クラウド化,ゼロトラスト,セキュリティ,サーバー強化,ネットワーク,仮想化,コンテナ,マイクロサービス,API基盤,データセンター,バックアップ,災害対策,監視システム  インフラエンジニア,セキュリティ人材  インフラスキル,セキュリティ研修  インフラ運用文化,セキュリティ意識 インフラ設備,サーバー,ネットワーク機器  インフラ技術,クラウド技術 インフラ関連特許,セキュリティ技術 インフラコスト,運用効率,可用性向上  インフラ投資,運用費,保守費  インフラ効率,運用コスト最適化 安定運用理念,セキュリティ文化 インフラ人材定着,運用継続 インフラ革新,次世代基盤  インフラ技術継承,運用継続

TK-TEC004 技術・イノベーション：データ・分析【優先度4】 データ分析,ビッグデータ,予測分析,ビジネスインテリジェンス,データサイエンス,アナリティクス,機械学習,統計解析,データマイニング,可視化,レポーティング,KPI分析,ダッシュボード,データドリブン,意思決定支援 データサイエンティスト,アナリスト データ分析スキル,統計学,可視化技術  データ活用文化,分析思考  分析基盤,データウェアハウス,BIツール  データ分析技術,統計手法  データ関連特許,分析手法  データ事業,分析サービス,洞察価値 データ投資,分析基盤費 分析効率,データROI,洞察価値  データ活用理念,証拠重視  データ人材定着,分析継続  データ新サービス,分析革新 データ技術継承,分析文化継続

TK-ORG001 組織・文化：心理的安全性【優先度4】  心理的安全性,ウェルビーイング,エンゲージメント,ストレスケア,メンタルヘルス,カウンセリング,1on1,職場満足,働きがい,チームワーク,信頼関係,オープンコミュニケーション,多様性,包摂性,居心地の良さ メンタルヘルス専門家,カウンセラー コミュニケーションスキル,リーダーシップ  安全な職場環境,ストレス軽減  相談環境,リラクゼーション設備 メンタルヘルステック,ウェルビーイングアプリ  働き方関連ノウハウ,組織文化手法  職場満足度,生産性向上,創造性向上 メンタルヘルス投資,環境整備費 ストレス関連コスト削減,生産性向上 心理的安全理念,人間尊重  メンタルヘルス向上,離職予防  働き方革新,職場環境革신  安全文化継承,ウェルビーイング継続

TK-ORG002 組織・文化：組織構造・権限【優先度4】 組織改革,扁平化,部門制,マトリックス組織,執行役員制,権限分散,組織階層,事業部制,カンパニー制,チーム制,プロジェクト組織,アジャイル組織,ネットワーク組織,自律分散,権限委譲  組織設計専門家,変革リーダー  組織開発スキル,変革管理,リーダーシップ  変革文化,適応力,柔軟性  組織運営システム,コミュニケーションツール 組織管理システム,デジタル組織 組織設計手法,マネジメント手法 組織効率,意思決定速度,事業成果  組織変革コスト,運営効率化 組織運営コスト,管理効率  組織理念,変革精神 組織適応力,変革受容  組織革新,新組織形態  組織文化継承,構造継続

TK-ORG003 組織・文化：コミュニケーション【優先度3】 コミュニケーション,情報共有,会議効率,チームワーク,協働,拠点間連携,グローバル対応,多言語対応,リモートワーク,オンライン会議,チャット,SNS,社内広報,情報発信,透明性  コミュニケーション専門家,翻訳者  コミュニケーションスキル,プレゼンテーション,多言語  コミュニケーション文化,オープン文化  コミュニケーションツール,会議システム コミュニケーション技術,翻訳技術  コミュニケーション手法,情報共有手法  コミュニケーション効率,情報伝達速度  コミュニケーション投資,ツール費用 コミュニケーションコスト,効率化  オープン理念,透明性  情報共有促進,コミュニケーション向上  コミュニケーション革新,情報共有革新  コミュニケーション文化継承,情報共有継続

TK-ORG004 組織・文化：働き方・制度【優先度3】  働き方改革,ワークライフバランス,リモートワーク,フレックス,福利厚生,有給取得,残業削減,多様な働き方,テレワーク,時短勤務,副業解禁,ワーケーション,健康経営,ダイバーシティ,インクルージョン  人事制度専門家,働き方改革推進者  働き方設計,制度運用,労務管理 多様性受容,柔軟性,適応力 働き方支援システム,勤怠管理システム  働き方支援技術,勤怠管理技術  働き方関連制度,人事制度  働き方満足度,生産性,創造性  働き方投資,制度運用費 働き方効率化,制度運用コスト  働き方理念,多様性尊重 働き方満足度,制度定着 働き方革新,制度革新  働き方文化継承,制度継続

TK-BIZ001 事業成長：売上・収益【優先度5】  売上成長,利益向上,収益性,売上目標,利益目標,成長率,LTV,顧客単価,取引量,市場シェア,競争力,収益構造,利益率,営業利益,経常利益 営業人材,事業開発人材 営業スキル,マーケティング,事業開発  成長志向,成果重視,競争文化  営業支援システム,CRM,販売管理 営業支援技術,マーケティング技術  営業手法,マーケティング手法  売上・利益の成長,収益向上 売上投資,マーケティング投資  営業効率,マーケティングROI 成長理念,顧客価値 営業人材定着,顧客関係継続 新事業開発,収益革新  事業継承,収益構造継続

TK-BIZ002 事業成長：事業構造・ポートフォリオ【優先度4】 事業拡大,多角化,新事業,サービス構成,ポートフォリオ,事業転換,高付加価値,事業領域,コア事業,周辺事業,成長事業,収益事業,シナジー,相乗効果,事業統合  事業企画人材,戦略企画人材 事業企画,戦略立案,ポートフォリオ管理 事業創造文化,チャレンジ精神  事業支援システム,企画管理システム 事業支援技術,企画支援技術 事業企画手法,戦略立案手法 事業収益,ポートフォリオ収益  事業投資,新規事業投資 事業効率,投資効率 事業創造理念,チャレンジ精神  事業人材定着,継続的革新  事業革新,新事業創造  事業構造継承,ポートフォリオ継続

TK-BIZ003 事業成長：顧客・市場【優先度4】  顧客拡大,市場開拓,新規開拓,顧客満足度,リピート率,顧客基盤,海外展開,市場シェア,ターゲット,セグメント,チャネル,販路,営業網,顧客関係,CRM 営業人材,マーケティング人材  顧客開拓スキル,市場分析,営業力  顧客志向,市場志向,サービス精神  顧客管理システム,営業支援システム 顧客管理技術,営業支援技術 顧客開拓手法,市場開拓手法 顧客収益,市場収益,売上拡大  顧客獲得投資,市場開拓投資 顧客獲得コスト,LTV,営業効率  顧客第一理念,市場志向 顧客関係維持,営業人材定着 顧客価値革新,市場創造 顧客基盤継承,市場地位継続

TK-BIZ004 事業成長：付加価値・差別化【優先度4】 付加価値,差別化,競争優位,独自性,イノベーション,ブランド力,サービス品質,技術優位,専門性,特殊性,希少性,模倣困難性,先行優位,コア競争力,USP  専門人材,研究開発人材 専門スキル,研究開発,イノベーション  イノベーション文化,専門性重視 研究開発設備,専門設備 研究開発技術,イノベーション技術  技術特許,ノウハウ,専門知識  付加価値収益,差別化効果,プレミアム  研究開発投資,差別化投資  差別化効率,付加価値創造効率  イノベーション理念,専門性重視 専門人材定着,技術継続 技術革新,サービス革新 専門性継承,差別化継続

TK-OPE001 運営効率：コスト・投資効率【優先度4】 コスト削減,投資効率,ROI,コスト比率,効率化,最適化,生産性向上,無駄削減,合理化,標準化,統合,集約,スケールメリット,経済性,採算性  コスト管理人材,業務改善人材  コスト管理,業務改善,効率化  効率重視,改善文化,合理性 効率化システム,コスト管理システム 効率化技術,自動化技術 効率化手法,コスト管理手法 コスト削減効果,投資効率向上  コスト管理投資,効率化投資 コスト削減,効率化効果,ROI向上 効率性理念,合理性重視 効率化人材定着,改善継続  効率化革新,コスト革新 効率化文化継承,合理性継続

TK-OPE002 運営効率：業務・プロセス【優先度4】  業務効率,プロセス改善,標準化,マニュアル化,ワークフロー,業務フロー,手順,作業,オペレーション,品質,精度,スピード,正確性,再現性,安定性  業務改善人材,プロセス設計人材 業務改善,プロセス設計,標準化 改善文化,品質重視,効率性 業務支援システム,ワークフローシステム 業務効率化技術,プロセス管理技術  業務改善手法,プロセス設計手法 業務効率向上,プロセス改善効果 業務改善投資,システム投資 業務効率化,プロセス改善効果  品質理念,改善精神 業務改善人材定着,品質継続 業務革新,プロセス革新 業務文化継承,品質継続

TK-OPE003 運営効率：資金・CF【優先度3】  資金繰り,キャッシュフロー,運転資金,資金調達,投資計画,資金計画,CF予測,資金効率,流動性,支払能力,資金ショート,資金余剰,資金配分,財務安定性,資金管理  財務人材,資金調達人材 財務管理,資金調調達,キャッシュフロー管理  財務規律,リスク管理,安定志向 財務管理システム,資金管理システム 財務管理技術,資金予測技術 財務管理手法,資金調達手法 財務安定性,資金効率,CF改善 資金調達コスト,財務管理費 資金効率,財務コスト最適化 財務健全理念,安定経営 財務人材定着,財務継続 資金管理革新,CF革新 財務文化継承,資金管理継続

TK-OPE004 運営効率：投資・ROI【優先度3】 投資計画,設備投資,IT投資,投資対効果,投資回収,投資効率,資本効率,投資判断,投資基準,投資評価,投資管理,ポートフォリオ,リスク,リターン,投資戦略 投資企画人材,財務分析人材 投資判断,財務分析,リスク評価 投資判断文化,リスク管理  投資管理システム,財務分析システム 投資分析技術,評価技術 投資手法,評価手法 投資効果,ROI向上,資本効率 投資管理コスト,評価コスト 投資効率,管理コスト最適化 投資理念,長期思考 投資人材定着,判断継続 投資手法革新,評価革新 投資文化継承,判断基準継続

TK-IPR001 知財・ブランド：特許・技術【優先度3】 特許出願,知的財産,技術ブランド,特許戦略,技術優位,イノベーション保護,技術資産,研究開発,発明,創作,技術移転,ライセンス,特許収益,技術競争力,技術ポートフォリオ  知財人材,研究開発人材 知財管理,特許出願,技術開発  技術重視,イノベーション文化  研究開発設備,知財管理システム 研究開発技術,知財管理技術 特許,技術ノウハウ,研究成果  特許収益,技術収益,ライセンス収入 研究開発投資,知財投資 特許効率,研究開発効率 技術革新理念,創造性重視  技術人材定着,研究継続 技術革新,特許創造 技術継承,知財継続

TK-IPR002 知財・ブランド：ナレッジ・コンテンツ【優先度3】  ナレッジ管理,コンテンツ,マニュアル,セミナー,教育資料,知識資産,ナレッジDB,情報資産,ドキュメント,手順書,ガイドライン,ベストプラクティス,ノウハウ,経験知,暗黙知  ナレッジ管理人材,コンテンツ制作人材  ナレッジ管理,コンテンツ制作,情報整理 知識共有文化,学習文化 ナレッジ管理システム,コンテンツ管理システム  ナレッジ管理技術,コンテンツ管理技術  ナレッジ,コンテンツ,情報資産 ナレッジ活用効果,コンテンツ収益  ナレッジ管理投資,コンテンツ投資  ナレッジ効率,コンテンツ効率  知識重視理念,学習文化 ナレッジ継続,情報継承 ナレッジ革新,コンテンツ革新  知識文化継承,ナレッジ継続

TK-IPR003 知財・ブランド：ブランド・認知【優先度3】 ブランド力,認知度,企業価値,レピュテーション,業界地位,ランキング,評価,イメージ,信頼性,専門性,権威性,影響力,存在感,知名度,ブランド価値 ブランディング人材,PR人材  ブランディング,PR,マーケティング  ブランド重視文化,品質文化 ブランディングシステム,PR支援システム  ブランディング技術,PR技術  ブランド資産,評判,企業イメージ  ブランド価値,認知効果,信頼収益  ブランディング投資,PR投資  ブランディング効率,PR効果  ブランド理念,品質重視 ブランド人材定着,評判継続 ブランド革新,認知革新 ブランド継承,評判継続

TK-IPR004 知財・ブランド：標準化・業界貢献【優先度2】  業界標準,標準化,業界貢献,影響力,リーダーシップ,業界団体,規格策定,ガイドライン,ベストプラクティス,業界発展,社会貢献,公共性,専門性発揮,業界改革,先導的役割 業界専門家,標準化人材 業界知識,標準化,リーダーシップ  業界貢献文化,社会貢献 標準化支援システム,業界情報システム  標準化技術,業界支援技術  業界標準,規格,ガイドライン  業界影響力,標準化効果,社会的価値 業界貢献投資,標準化投資  業界貢献効率,標準化効果  業界貢献理念,社会責任 業界人材定着,専門性継続  業界革新,標準革新 業界文化継承,貢献継続

TK-DOM001 事業領域：専門分野・特化【優先度4】  専門分野,特化戦略,コア事業,専門性,ニッチ,得意分野,専門領域,特殊技術,専門知識,業界特化,分野特化,専門サービス,技術特化,市場特化,顧客特化  専門人材,特化領域専門家  専門知識,特化技術,業界知識  専門性重視文化,技術文化  専門設備,特化システム 専門技術,特化技術 専門特許,特化ノウハウ 専門収益,特化効果,専門性価値 専門投資,特化投資 専門効率,特化効果 専門性理念,技術重視  専門人材定着,技術継続 専門革新,特化革新 専門性継承,技術継続

TK-DOM002 事業領域：地理・拠点【優先度3】  拠点展開,地域展開,多拠点,グローバル,国際展開,海外進出,地理的拡張,エリア展開,支店,営業所,サテライト,リモート拠点,分散展開,地域密着,グローバル化  拠点管理人材,国際人材 拠点管理,国際業務,地域知識  グローバル文化,地域適応  拠点設備,通信インフラ 拠点管理技術,国際対応技術 拠点運営ノウハウ,国際展開手法 拠点収益,地域収益,国際収益  拠点投資,国際展開投資 拠点効率,国際展開効果 グローバル理念,地域貢献  拠点人材定着,国際継続 拠点革新,国際革新 拠点文化継承,国際継続

TK-DOM003 事業領域：法人・組織形態【優先度2】  法人形態,組織形態,分社化,グループ化,持株会社,統合管理,子会社,関連会社,事業会社,機能会社,地域会社,合弁会社,パートナーシップ,アライアンス,企業集団 組織設計人材,法務人材 組織設計,法務知識,企業再編  組織形態適応文化,統合文化 組織管理システム,統合システム 組織管理技術,統合技術 組織設計ノウハウ,統合手法 組織効率,統合効果,シナジー  組織再編投資,統合投資 組織効率,統合効果 組織理念,統合精神 組織人材定着,統合継続 組織革新,形態革新 組織継承,形態継続

TK-DOM004 事業領域：協力・提携【優先度3】  業務提携,戦略提携,アライアンス,パートナーシップ,共同事業,エコシステム,ネットワーク,協力関係,共創,コラボレーション,共同開発,共同研究,業界連携,産学連携,官民連携  提携企画人材,アライアンス人材 提携企画,パートナーシップ管理,交渉力 協力文化,共創文化 提携管理システム,協力支援システム 提携管理技術,協力支援技術 提携ノウハウ,協力手法 提携効果,協力収益,シナジー  提携投資,協力投資 提携効率,協力効果 協力理念,共創精神 提携関係維持,協力継続 提携革新,協力革新 協力文化継承,提提携継続

TK-SUC001 継承・発展：後継者・承継【優先度4】  後継者育成,事業承継,承継準備,次世代経営,リーダー育成,承継計画,後継者選定,承継プロセス,経営移譲,権限移譲,責任移譲,知識移譲,技術移譲,文化継承,経営継続 後継者候補,承継支援人材  経営スキル,リーダーシップ,承継知識  承継文化,継続文化 承継支援システム,教育システム 承継支援技術,教育技術 承継ノウハウ,育成手法 承継効果,継続価値,安定性 承継投資,育成投資 承継効率,育成効果 承継理念,継続精神 後継者定着,承継継続  承継革新,育成革新 承継文化,継続文化

TK-SUC002 継承・発展：次世代・育成【優先度3】  次世代リーダー,人材育成,リーダーシップ,マネジメント研修,EMBA,経営教育,幹部育成,管理職育成,若手育成,キャリア開発,昇進,昇格,登用,抜擢,人材発掘 次世代候補,育成担当人材  リーダーシップ,マネジメント,育成スキル  育成文化,成長文化 育成支援システム,教育システム 育成支援技術,教育技術 育成ノウハウ,教育手法 育成効果,成長価値,人材価値  育成投資,教育投資 育成効率,教育効果 育成理念,成長精神 次世代人材定着,育成継続  育成革新,教育革新 育成文化継承,成長文化継続

TK-SUC003 継承・発展：組織・体制【優先度3】 組織体制,ガバナンス,取締役会,執行体制,経営陣,組織設計,経営体制,役員体制,管理体制,統治体制,意思決定体制,監督体制,執行監督分離,社外役員,独立性 ガバナンス人材,経営企画人材  ガバナンス,組織設計,経営企画 ガバナンス文化,統治文化  ガバナンスシステム,管理システム  ガバナンス技術,管理技術  ガバナンスノウハウ,統治手法  ガバナンス効果,統治価値,安定性  ガバナンス投資,体制整備投資  ガバナンス効率,統治効果  ガバナンス理念,統治精神  ガバナンス人材定着,体制継続  ガバナンス革新,統治革新  ガバナンス文化継承,統治継続

TK-SUC004 継承・発展：文化・理念【優先度3】 企業理念,企業文化,価値観,ミッション,ビジョン,三方よし,理念浸透,文化醸成,価値観共有,伝統継承,精神継承,哲学,思想,信念,行動指針 文化推進人材,理念浸透人材 文化醸成,理念浸透,価値観共有 文化重視,理念重視 文化醸成システム,理念浸透システム 文化醸成技術,理念浸透技術 文化資産,理念,価値観 文化価値,理念効果,結束力 文化投資,理念浸透投資 文化効率,理念浸透効果 企業理念,企業文化 文化定着,理念継続 文化革新,理念進化 文化継承,理念継承
`;

// ============================================================
// メニュー生成
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 AIプロジェクト企画 v4.0 (Gemini 2.5)')
    .addItem('APIキーを設定', 'setApiKey')
    .addSeparator()
    .addItem('選択行の企画案を作成', 'generateForSelectedRow')
    .addItem('未処理の企画案をすべて作成', 'generateForAllUnprocessedRows')
    .addSeparator()
    .addItem('📄 企画案をGoogleドキュメントで出力', 'exportProjectsToGoogleDocs')
    .addSeparator()
    .addItem('🔧 モデル情報を確認', 'checkModelInfo')
    .addToUi();
}

// ============================================================
// APIキー登録
// ============================================================
function setApiKey() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt(
    'Gemini APIキーの設定',
    'Google AI Studio で発行した API キーを入力してください:',
    ui.ButtonSet.OK_CANCEL
  );
  if (res.getSelectedButton() === ui.Button.OK) {
    const key = res.getResponseText().trim();
    if (key) {
      PropertiesService.getScriptProperties().setProperty(API_KEY_PROPERTY, key);
      ui.alert(`APIキーを保存しました。\n使用モデル: ${MODEL_NAME}`);
    } else {
      ui.alert('APIキーが入力されませんでした。');
    }
  }
}

// ============================================================
// ★追加：モデル情報確認機能
// ============================================================
function checkModelInfo() {
  const ui = SpreadsheetApp.getUi();
  const apiKey = PropertiesService.getScriptProperties().getProperty(API_KEY_PROPERTY);

  let message = `現在の設定:\n`;
  message += `モデル名: ${MODEL_NAME}\n`;
  message += `APIバージョン: ${API_VERSION}\n`;
  message += `APIキー: ${apiKey ? '設定済み' : '未設定'}`;

  if (apiKey) {
    message += `\n\n利用可能な代替モデル:\n`;
    message += `• gemini-2.5-flash-preview-04-17 (最新・推奨)\n`;
    message += `• gemini-2.0-flash-exp (Gemini 2.0版)\n`;
    message += `• gemini-1.5-flash-latest (従来版)`;
  }

  ui.alert('モデル情報', message, ui.ButtonSet.OK);
}

// ============================================================
// 企画案生成の実行関数
// ============================================================
function generateForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SELECTIONS_SHEET_NAME);
  if (!sheet) return SpreadsheetApp.getUi().alert(`シート「${SELECTIONS_SHEET_NAME}」が見つかりません。`);
  const range = sheet.getActiveRange();
  if (range.getNumRows() > 1 || range.getRow() === 1) {
    SpreadsheetApp.getUi().alert('1行だけ選択してください。（ヘッダーは選択不可）');
    return;
  }
  processSingleRow(sheet, range.getRow());
}

function generateForAllUnprocessedRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SELECTIONS_SHEET_NAME);
  if (!sheet) return SpreadsheetApp.getUi().alert(`シート「${SELECTIONS_SHEET_NAME}」が見つかりません。`);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (!values[i][TITLE_COL - 1] || values[i][TITLE_COL - 1].includes('エラー')) {
      processSingleRow(sheet, i + 1);
      Utilities.sleep(1500);
    }
  }
  SpreadsheetApp.getUi().alert('未処理行の生成が完了しました。');
}

// ============================================================
// ★更新：単一行処理（課題・問題・ビジョン対応）
// ============================================================
function processSingleRow(sheet, rowNum) {
  const ui = SpreadsheetApp.getUi();
  const apiKey = PropertiesService.getScriptProperties().getProperty(API_KEY_PROPERTY);
  if (!apiKey) {
    ui.alert('APIキーが設定されていません。メニューから「APIキーを設定」を実行してください。');
    return;
  }
  try {
    const row = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
    const groupName = row[GROUP_COL - 1];
    const cardTxt = row[CARDNAME_COL - 1];
    const speechTxt = row[RESPONSE_COL - 1];
    const playerId = row[PLAYERNAME_COL - 1];
    const playerName = getPlayerNameFromId(playerId);

    if (!groupName || !cardTxt || !speechTxt) {
      Logger.log(`行 ${rowNum}: Group, CardName, Response のいずれかが空です。スキップします。`);
      return;
    }

    const preWorkSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRE_WORK_SHEET_NAME);
    if (!preWorkSheet) throw new Error(`シート「${PRE_WORK_SHEET_NAME}」が見つかりません。`);

    const preWorkData = preWorkSheet.getDataRange().getValues();
    const headers = preWorkData[0];

    // ★拡張された列を取得
    const groupColIdx = headers.indexOf('Group');
    const industryColIdx = headers.indexOf('業種・業態');
    const stColIdx = headers.indexOf('StPhototext');
    const wkColIdx = headers.indexOf('WkPhototext');
    const asColIdx = headers.indexOf('AsPhototext');  // ★課題
    const prColIdx = headers.indexOf('PrPhototext');  // ★問題
    const vsColIdx = headers.indexOf('VsPhototext');  // ★3年後のビジョン

    if (groupColIdx === -1 || industryColIdx === -1 || stColIdx === -1 || wkColIdx === -1) {
        throw new Error(`「${PRE_WORK_SHEET_NAME}」シートに必要な列ヘッダーが見つかりません。`);
    }

    const companyInfoRows = preWorkData.filter(r => r[groupColIdx] === groupName);

    if (companyInfoRows.length === 0) {
      throw new Error(`「${PRE_WORK_SHEET_NAME}」シートに Group名「${groupName}」のデータが見つかりません。`);
    }

    const industryText = companyInfoRows
      .map(r => r[industryColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n');

    const strengthText = companyInfoRows
      .map(r => r[stColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n');

    const weaknessText = companyInfoRows
      .map(r => r[wkColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n');

    // ★課題・問題・ビジョンを取得
    const issueText = asColIdx !== -1 ? companyInfoRows
      .map(r => r[asColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n') : '';

    const problemText = prColIdx !== -1 ? companyInfoRows
      .map(r => r[prColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n') : '';

    const visionText = vsColIdx !== -1 ? companyInfoRows
      .map(r => r[vsColIdx])
      .filter(text => text && text.toString().trim() !== '')
      .join('\n\n') : '';

    const visionDataText = buildVisionDataText(industryText, strengthText, weaknessText, issueText, problemText, visionText);

    const prompt = buildPrompt(visionDataText, cardTxt, speechTxt, playerName);

    sheet.getRange(rowNum, TITLE_COL, 1, 4).setValue('🤖 Gemini 2.5 が思考中...');
    const responseText = callGeminiApi(prompt, apiKey);
    const parsed = parseResponse(responseText);

    sheet.getRange(rowNum, TITLE_COL, 1, 4).setValues([[
      parsed.Title,
      parsed.Analysis,
      parsed.ProjectPlan,
      parsed.ProjectPlanSummary
    ]]);
    if (!row[CREATEDAT_COL - 1]) {
      sheet.getRange(rowNum, CREATEDAT_COL).setValue(new Date());
    }
    SpreadsheetApp.flush();
  } catch (err) {
    ui.alert(`エラー (行 ${rowNum}): ${err.message}`);
    sheet.getRange(rowNum, TITLE_COL).setValue(`エラー: ${err.message}`);
  }
}

// ============================================================
// ★新規：ビジョンデータテキスト構築関数
// ============================================================
function buildVisionDataText(industryText, strengthText, weaknessText, issueText, problemText, visionText) {
  let visionData = `## 企業の業種・業態\n${industryText}\n\n`;
  visionData += `## 企業の強み\n${strengthText}\n\n`;
  visionData += `## 企業の弱み\n${weaknessText}`;

  if (issueText) {
    visionData += `\n\n## 解決すると良くなる「課題」\n${issueText}`;
  }

  if (problemText) {
    visionData += `\n\n## 解決しなければならない「問題」\n${problemText}`;
  }

  if (visionText) {
    visionData += `\n\n## 3年後のありたい姿（ビジョン）\n${visionText}`;
  }

  return visionData;
}

// ============================================================
// ★更新：プロンプト生成（課題・問題・ビジョン対応）
// ============================================================
function buildPrompt(visionDataText, cardNameText, responseText, playerName) {
  return `
# 命令書

あなたは優秀な経営戦略コンサルタントです。以下の入力情報を基に、指示に従って戦略的なプロジェクト企画書を作成してください。

## 翻訳キーフレームワーク（企業活動分析用）

以下の階層的分類を使用して、アイディアの戦略的位置づけを分析してください：

\`\`\`
${TRANSLATION_KEYS}
\`\`\`

## 入力情報

### 1. 企業の基本情報 (業種・業態・強み・弱み・課題・問題・ビジョン)

${visionDataText}

**分析時の優先順位：**
1. **「解決しなければならない問題」** を最優先で解決
2. **「解決すると良くなる課題」** を次に改善
3. **「3年後のありたい姿（ビジョン）」** に向けた戦略的貢献を明確化
4. 企業の **「強み」** を最大限活用し、**「弱み」** を補完する施策を提案

### 2. 社員のアイディア詳細（プレゼン内容）

**発案者: ${playerName}**

${responseText}

### 3. ★社員が提示した具体的な制約条件★

${cardNameText}

# 分析・企画プロセス

1. **問題・課題分析**: 提示された「問題」と「課題」を優先的に分析し、アイディアがどう解決するかを明確化
2. **ビジョン整合性**: 「3年後のありたい姿」とアイディアの関連性を戦略的に評価
3. **翻訳キー分析**: 企業活動の12の側面（人材・技術・事業・組織・効率・知財・領域・継承）から最適なキーを選定
4. **実行可能性**: 制約条件を遵守しながら、具体的で実行可能な企画を立案

# 出力フォーマット（厳守）

**翻訳キー分析結果**

\`\`\`
アイディア：[アイディアの簡潔な要約]

主要キー = {
  キーコード: [TK-XXX###:カテゴリ名]
  マッチ要素: [具体的なマッチ理由]
  戦略価値: [企業ビジョンへの貢献度]
  問題・課題への貢献: [どの問題・課題を解決するか]
  マッチ度: [XX%]
}

関連キー候補: [TK-XXX###:名称, TK-XXX###:名称, TK-XXX###:名称]
戦略整合性: [「3年後のありたい姿」達成への具体的貢献]
\`\`\`

### **🎮 ゲーミフィケーション実行計画サマリー**

以下のゲーミフィケーション形式で、プロジェクト全体を視覚的に分かりやすくまとめてください：

---

# 🎮 [プロジェクト名]

## 🎯 ミッション概要

\`\`\`
🏛️ プロジェクト名: [具体的で魅力的な名称]
👤 発案者: ${playerName}
⏰ 実行期間: [期間]
🎖️ 戦略ランク: [S級/A級/B級]（[戦略的位置づけ]）
🎯 解決する問題: [最優先で解決する問題]
🌱 改善する課題: [次に改善する課題]
🌟 ビジョンへの貢献: [3年後のビジョン達成への貢献]
💰 総予算: [総額]万円
\`\`\`

---

## 📊 現状分析ダッシュボード

### 🚨 組織の課題・問題レベル

\`\`\`
🔴 [問題1名]（最優先）
   ██████░░░░ [数値]% ([現状説明])

🟡 [課題1名]
   ████░░░░░░ [数値]% ([現状説明])

🟡 [課題2名]
   ████░░░░░░ [数値]% ([現状説明])
\`\`\`

### 🎯 解決後の目標値

\`\`\`
✅ [問題1解決後]
   ████████░░ [数値]% ([目標説明])

🌱 [課題1改善後]
   ████████░░ [数値]% ([目標説明])

🌱 [課題2改善後]
   ████████░░ [数値]% ([目標説明])
\`\`\`

### 🌟 3年後のビジョン達成への貢献

\`\`\`
🎯 ビジョン: [3年後のありたい姿から抜粋]

このプロジェクトの貢献:
• [貢献1] → ビジョン達成度 +XX%
• [貢献2] → ビジョン達成度 +XX%
• [貢献3] → ビジョン達成度 +XX%
\`\`\`

---

## ⚔️ 推奨チーム編成

### 👑 プロジェクトリーダー
\`\`\`
🎭 役職: [役職名]
💪 必要スキル:
  • [スキル1] ⭐⭐⭐⭐⭐
  • [スキル2] ⭐⭐⭐⭐
  • [スキル3] ⭐⭐⭐⭐
🎯 主な任務: [任務内容]
\`\`\`

### 🧙‍♂️ コアメンバー
\`\`\`
⚔️ [役職1] ([担当分野])
  📈 [責任・役割1]
  🎯 [責任・役割2]

🎨 [役職2] ([担当分野])
  💡 [責任・役割1]
  📊 [責任・役割2]

💻 [役職3] ([担当分野])
  🔧 [責任・役割1]
  🛡️ [責任・役割2]
\`\`\`

---

## 🗺️ 攻略マップ（実行計画）

### 📍 Phase 1: [フェーズ名]
\`\`\`
⏱️ 期間: [期間]
🎯 目標: [目標説明]
🔴 解決する問題: [該当する問題]

🔍 主要クエスト:
  ✅ [アクション1]
  ✅ [アクション2]
  ✅ [アクション3]

📦 成果物:
  • [成果物1]
  • [成果物2]

💰 投資額: [金額]万円
\`\`\`

### 📍 Phase 2: [フェーズ名]
\`\`\`
⏱️ 期間: [期間]
🎯 目標: [目標説明]
🟡 改善する課題: [該当する課題]

🔧 主要クエスト:
  ✅ [アクション1]
  ✅ [アクション2]
  ✅ [アクション3]

📦 成果物:
  • [成果物1]
  • [成果物2]

💰 投資額: [金額]万円
\`\`\`

---

## 📈 主要成功指標

\`\`\`
🔴 問題解決指標:
  📊 [指標1名]: [現状]→[目標値]

🟡 課題改善指標:
  📊 [指標2名]: [現状]→[目標値]
  📊 [指標3名]: [現状]→[目標値]

🌟 ビジョン貢献指標:
  📊 [指標4名]: [現状]→[目標値]（3年後ビジョンへの貢献度）
\`\`\`

---

## 💰 投資配分

\`\`\`
💼 総投資額: [総額]万円

🎯 [投資項目1]（問題解決）
   [金額]万円 ([割合]%)

🌱 [投資項目2]（課題改善）
   [金額]万円 ([割合]%)

🌟 [投資項目3]（ビジョン貢献）
   [金額]万円 ([割合]%)
\`\`\`

---

## 🎯 期待効果アチーブメント

### 🏆 短期効果（[期間]以内）
\`\`\`
⚡ [効果1]（問題解決）
   🥇 +[数値]%

🌱 [効果2]（課題改善）
   🥈 +[数値]%

💡 [効果3]
   🥉 +[数値]%
\`\`\`

### 🌟 長期効果（3年後ビジョン達成への貢献）
\`\`\`
🎯 [ビジョン達成項目1]: +[数値]%
🎯 [ビジョン達成項目2]: +[数値]%
🎯 [ビジョン達成項目3]: +[数値]%
\`\`\`

### 💎 ROI予測
\`\`\`
📊 投資回収期間: [期間]
📈 ROI: [数値]%

計算根拠:
💰 年間効果額: [金額]万円
⚡ 投資額: [金額]万円
🎯 回収率: [計算式] = [ROI]%
\`\`\`

---

## ⚠️ リスク管理マトリックス

\`\`\`
🚨 高リスク・高影響
  └─ ❌ [リスク1]
     対策: [対策内容]

⚠️ 中リスク・中影響
  └─ 🔶 [リスク2]
     対策: [対策内容]

✅ 低リスク・低影響
  └─ 🟢 [リスク3]
     対策: [対策内容]
\`\`\`

---

## 🚀 今すぐ開始アクション

### 🎮 今週のクエスト（問題解決優先）
\`\`\`
□ [アクション1]（問題解決）
□ [アクション2]（課題改善）
□ [アクション3]
□ [アクション4]
\`\`\`

### 📅 来月までの目標
\`\`\`
🎯 [目標1]（問題解決）：[進捗]%
🎯 [目標2]（課題改善）：[進捗]%
🎯 [目標3]（ビジョン貢献）：[進捗]%
\`\`\`

---

**このプロジェクトは組織の未来を決める重要なミッションです！**
**「3年後のビジョン」実現に向けて、[プロジェクトの目的]を成功させましょう！**

---

## 📋 **[プロジェクト名]（詳細版）**

### 🎯 **プロジェクト概要**

**プロジェクト名:** [具体的で魅力的な名称]

**実行期間:** [期間]

**戦略的位置づけ:** [戦略的位置づけ]

**解決する問題:** [最優先問題]

**改善する課題:** [主要課題]

**ビジョンへの貢献:** [3年後ビジョン達成への貢献]

### 📊 **現状課題と戦略的機会**

**現状の問題（最優先）**

* [問題1の具体的内容と解決アプローチ]

**現状の課題**

* [課題1の具体的内容と改善アプローチ]

* [課題2の具体的内容と改善アプローチ]

**戦略的機会**

* [機会1：ビジョン目標との関連]

* [機会2：市場・技術動向との関連]

* [機会3：組織・競争力向上への関連]

### 🚀 **実行計画**

#### **Phase 1: [フェーズ名]（問題解決フェーズ）**

**目標:** [目標]

**解決する問題:** [該当問題]

**実行内容:**

* [具体的アクション1]

* [具体的アクション2]

**成果物:**

* [成果物1]

#### **Phase 2: [フェーズ名]（課題改善フェーズ）**

**目標:** [目標]

**改善する課題:** [該当課題]

**実行内容:**

* [具体的アクション1]

* [具体的アクション2]

**成果物:**

* [成果物1]

#### **Phase 3以降:** [ビジョン達成フェーズ]

**目標:** [3年後ビジョン達成への貢献]

**実行内容:**

* [具体的アクション1]

* [具体的アクション2]

### 💰 **投資計画・ROI予測**

**投資内訳（総額：XXX万円）**

* **[投資項目1]（問題解決）:** XXX万円（[内容説明]）

* **[投資項目2]（課題改善）:** XXX万円（[内容説明]）

* **[投資項目3]（ビジョン貢献）:** XXX万円（[内容説明]）

**ROI予測**

* **短期効果:** [具体的な効果・数値]（問題解決・課題改善）

* **長期効果:** [具体的な効果・数値]（3年後ビジョン達成への貢献）

* **投資回収期間:** [期間]

* **ROI:** XXX%

### 📈 **成功指標・KPI**

**問題解決指標（最優先）**

* [指標1]: [現状]→[目標値]

**課題改善指標**

* [指標1]: [現状]→[目標値]

* [指標2]: [現状]→[目標値]

**ビジョン貢献指標（3年後）**

* [指標1]: [現状]→[目標値]

* [指標2]: [現状]→[目標値]

### ⚡ **実行体制・リソース**

**プロジェクト体制**

* **プロジェクトリーダー:** [役割・要件]

* **コアメンバー:** [役割・要件]

**必要リソース**

* [リソース項目1]

* [リソース項目2]

### 🔄 **リスク管理・対策**

**主要リスク**

1. **[リスク1]** → [対策]

2. **[リスク2]** → [対策]

**成功要因**

* [要因1]

* [要因2]

### 🌟 **戦略的インパクト**

このプロジェクトは、**「解決しなければならない問題」を最優先で解決**し、**「解決すると良くなる課題」を改善**することで、**「3年後のありたい姿（ビジョン）」達成を加速**させる戦略的投資です。

**ビジョン達成への貢献度:** XX%

**即時開始アクション:**

1. [アクション1]（問題解決）

2. [アクション2]（課題改善）

3. [アクション3]（ビジョン貢献）

# ★★★ 最重要指示 ★★★

- 必ず上記の出力フォーマットに厳密に従って、企画書全体を作成してください。

- **「### 3. ★社員が提示した具体的な制約条件★」に期間、予算、KPI、体制などの具体的な記述がある場合は、その内容を【最優先】し、企画書の該当項目（実行期間、投資総額、成功指標・KPI、実行体制など）に【忠実に反映】してください。**

- **企業の「問題」「課題」「ビジョン」を必ず考慮し、それらへの貢献を明確に記載してください。**

- 制約条件で指定されていない項目については、あなたがコンサルタントとして最適な提案をしてください。

- ゲーミフィケーション実行計画サマリーは、視覚的でわかりやすく、ゲーム要素を活用して作成してください。

- 実行計画は、制約条件に合わせて、現実的なフェーズと内容にしてください。必ずしも4フェーズである必要はありません。
`;
}

// ============================================================
// ★更新：Gemini 2.5 Flash API呼び出し
// ============================================================
function callGeminiApi(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  // ★Gemini 2.5用の最適化されたパラメータ
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,        // ★創造性と一貫性のバランス
      topP: 0.85,             // ★Gemini 2.5で推奨される値
      topK: 40,               // ★語彙選択の幅
      maxOutputTokens: 8192,  // ★長文出力対応
      candidateCount: 1       // ★単一候補で安定性重視
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  try {
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    if (res.getResponseCode() !== 200) {
      const errorBody = res.getContentText();
      Logger.log(`API Error (HTTP ${res.getResponseCode()}): ${errorBody}`);

      if (res.getResponseCode() === 400) {
        throw new Error(`APIリクエストエラー (400): リクエスト形式が不正です。モデル名「${MODEL_NAME}」が正しいか確認してください。`);
      } else if (res.getResponseCode() === 403) {
        throw new Error(`APIキーエラー (403): APIキーが無効またはクォータを超過しています。`);
      } else if (res.getResponseCode() === 429) {
        throw new Error(`レート制限エラー (429): APIの使用量制限に達しました。しばらく待ってから再試行してください。`);
      } else {
        throw new Error(`APIリクエストに失敗 (HTTP ${res.getResponseCode()}): ${errorBody}`);
      }
    }

    const json = JSON.parse(res.getContentText());

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      Logger.log('APIからの応答構造:', JSON.stringify(json, null, 2));
      throw new Error('APIから有効な応答が得られませんでした。応答が空またはブロックされた可能性があります。');
    }

    return text;

  } catch (error) {
    Logger.log(`Gemini API呼び出しエラー: ${error.message}`);
    throw error;
  }
}

// ============================================================
// 応答パース (変更なし - 既存ロジックを維持)
// ============================================================
function parseResponse(responseText) {
  const result = {
    Title: '（解析不能）',
    Analysis: '（解析不能）',
    ProjectPlan: '（解析不能）',
    ProjectPlanSummary: '（解析不能）'
  };

  try {
    Logger.log('=== 元のレスポンステキスト（最初の500文字） ===');
    Logger.log(responseText.substring(0, 500));

    let cleanedResponse = responseText.trim();

    const unwantedPrefixes = [
      '戦略統合型プロジェクト案',
      '**戦略統合型プロジェクト案**',
      'プロジェクト企画書',
      '企画書',
      '以下の企画書'
    ];

    for (const prefix of unwantedPrefixes) {
      if (cleanedResponse.startsWith(prefix)) {
        cleanedResponse = cleanedResponse.substring(prefix.length).replace(/^\*\*?/, '').trim();
        break;
      }
    }

    const possibleAnalysisSeparators = [
      '**翻訳キー分析結果**',
      '翻訳キー分析結果',
      '**分析結果**',
      '分析結果'
    ];

    const possibleSummarySeparators = [
      '### **🎮 ゲーミフィケーション実行計画サマリー**',
      '🎮 ゲーミフィケーション実行計画サマリー',
      '**ゲーミフィケーション実行計画サマリー**',
      'ゲーミフィケーション実行計画サマリー',
      '# 🎮'
    ];

    const possibleDetailSeparators = [
      '## 📋 **',
      '## 📋',
      '**（詳細版）**',
      '（詳細版）'
    ];

    // 1. Analysis（翻訳キー分析結果）を抽出
    let analysisStart = -1;
    let usedAnalysisSeparator = '';

    for (const separator of possibleAnalysisSeparators) {
      const index = cleanedResponse.indexOf(separator);
      if (index !== -1) {
        analysisStart = index;
        usedAnalysisSeparator = separator;
        break;
      }
    }

    if (analysisStart !== -1) {
      let analysisEnd = cleanedResponse.length;
      for (const separator of possibleSummarySeparators) {
        const index = cleanedResponse.indexOf(separator, analysisStart + usedAnalysisSeparator.length);
        if (index !== -1 && index < analysisEnd) {
          analysisEnd = index;
          break;
        }
      }

      result.Analysis = cleanedResponse.substring(analysisStart + usedAnalysisSeparator.length, analysisEnd).trim();
      Logger.log('Analysis抽出成功: ' + result.Analysis.substring(0, 100) + '...');
    } else {
      Logger.log('Analysis セパレーターが見つかりません');
      const codeBlockMatch = cleanedResponse.match(/```([\s\S]*?)```/);
      if (codeBlockMatch) {
        result.Analysis = codeBlockMatch[1].trim();
        Logger.log('Analysis フォールバック成功');
      }
    }

    // 2. ProjectPlanSummary（サマリー）を抽出
    let summaryStart = -1;
    let usedSummarySeparator = '';

    for (const separator of possibleSummarySeparators) {
      const index = cleanedResponse.indexOf(separator);
      if (index !== -1) {
        summaryStart = index;
        usedSummarySeparator = separator;
        break;
      }
    }

    if (summaryStart !== -1) {
      let summaryEnd = cleanedResponse.length;
      for (const separator of possibleDetailSeparators) {
        const index = cleanedResponse.indexOf(separator, summaryStart + usedSummarySeparator.length);
        if (index !== -1 && index < summaryEnd) {
          summaryEnd = index;
          break;
        }
      }

      result.ProjectPlanSummary = cleanedResponse.substring(summaryStart + usedSummarySeparator.length, summaryEnd).trim();
      Logger.log('ProjectPlanSummary抽出成功: ' + result.ProjectPlanSummary.length + '文字');
    } else {
      Logger.log('ProjectPlanSummary セパレーターが見つかりません');
    }

    // 3. ProjectPlan（詳細版）を抽出
    let detailStart = -1;

    for (const separator of possibleDetailSeparators) {
      const index = cleanedResponse.indexOf(separator);
      if (index !== -1) {
        detailStart = index;
        break;
      }
    }

    if (detailStart !== -1) {
      result.ProjectPlan = cleanedResponse.substring(detailStart).trim();
      Logger.log('ProjectPlan抽出成功: ' + result.ProjectPlan.length + '文字');
    } else {
      Logger.log('ProjectPlan セパレーターが見つかりません - サマリーを代用');
      result.ProjectPlan = result.ProjectPlanSummary;
    }

    // 4. タイトル抽出
    const titleSources = [result.ProjectPlanSummary, result.ProjectPlan, cleanedResponse];
    const titlePatterns = [
      /# 🎮 (.*?)(?:\n|$)/,
      /## 📋 \*\*(.*?)\*\*/,
      /📋 \*\*(.*?)\*\*/,
      /🏛️ プロジェクト名:\s*(.*?)(?:\n|$)/,
      /プロジェクト名:\s*(.*?)(?:\n|$)/,
      /\*\*プロジェクト名:\*\*\s*(.*?)(?:\n|$)/
    ];

    let titleFound = false;
    for (const source of titleSources) {
      if (!source || titleFound) continue;

      for (const pattern of titlePatterns) {
        const match = source.match(pattern);
        if (match && match[1]) {
          result.Title = match[1].trim()
            .replace(/【.*?】/g, '')
            .replace(/（.*?）/g, '')
            .replace(/\(.*?\)/g, '')
            .replace(/\*/g, '');
          titleFound = true;
          Logger.log('Title抽出成功: ' + result.Title);
          break;
        }
      }
    }

    // 最終検証とフォールバック
    if (result.Analysis === '（解析不能）' || result.Analysis.length < 10) {
      Logger.log('Analysis再フォールバック実行');
      const translationKeyMatch = cleanedResponse.match(/(アイディア[：:][^]*?整合性[：:][^]*?)(?=###|##|$)/s);
      if (translationKeyMatch) {
        result.Analysis = translationKeyMatch[1].trim();
        Logger.log('Analysis再フォールバック成功');
      } else {
        result.Analysis = cleanedResponse.substring(0, Math.min(300, cleanedResponse.length)) + '...（部分的な抽出）';
      }
    }

    if (result.ProjectPlanSummary === '（解析不能）' || result.ProjectPlanSummary.length < 10) {
      Logger.log('ProjectPlanSummary フォールバック実行');
      result.ProjectPlanSummary = cleanedResponse.substring(0, Math.min(1000, cleanedResponse.length)) + '...（部分的な抽出）';
    }

    if (result.ProjectPlan === '（解析不能）' || result.ProjectPlan.length < 10) {
      Logger.log('ProjectPlan フォールバック実行');
      result.ProjectPlan = result.ProjectPlanSummary;
    }

    Logger.log('=== 最終パース結果 ===');
    Logger.log('Title: ' + result.Title);
    Logger.log('Analysis length: ' + (result.Analysis ? result.Analysis.length : 0));
    Logger.log('ProjectPlanSummary length: ' + (result.ProjectPlanSummary ? result.ProjectPlanSummary.length : 0));
    Logger.log('ProjectPlan length: ' + (result.ProjectPlan ? result.ProjectPlan.length : 0));

  } catch (e) {
    Logger.log('Response parsing error: ' + e.toString());
    Logger.log('Stack trace: ' + e.stack);

    const lines = responseText.split('\n');
    result.Analysis = lines.slice(0, 10).join('\n') + '...（エラー時フォールバック）';
    result.ProjectPlan = responseText.substring(0, Math.min(2000, responseText.length)) + '...';
    result.ProjectPlanSummary = responseText.substring(0, Math.min(1000, responseText.length)) + '...';
    result.Title = 'パース処理エラー';
  }

  return result;
}

// ============================================================
// Googleドキュメント出力機能 (変更なし - 既存機能を維持)
// ============================================================
function getPlayerNameFromId(playerId) {
  if (!playerId) return '名前不明';
  try {
    const playersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
    if (!playersSheet) return playerId;
    const data = playersSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === playerId) {
        return data[i][1] || playerId;
      }
    }
    return playerId;
  } catch (error) {
    Logger.log(`PlayersシートからPlayerName取得エラー: ${error.message}`);
    return playerId;
  }
}

function exportProjectsToGoogleDocs() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SELECTIONS_SHEET_NAME);
  if (!sheet) {
    ui.alert(`シート「${SELECTIONS_SHEET_NAME}」が見つかりません。`);
    return;
  }
  try {
    const data = sheet.getDataRange().getValues();
    const rows = data.slice(1);
    const completedProjects = rows.filter(row => row[TITLE_COL - 1] && row[TITLE_COL - 1].trim() !== '' && !row[TITLE_COL - 1].includes('エラー'));
    if (completedProjects.length === 0) {
      ui.alert('出力可能な企画案がありません。');
      return;
    }
    const projectsByGroup = {};
    completedProjects.forEach(row => {
      const groupName = row[GROUP_COL - 1];
      if (groupName && groupName.trim() !== '') {
        if (!projectsByGroup[groupName]) {
          projectsByGroup[groupName] = [];
        }
        projectsByGroup[groupName].push(row);
      }
    });
    if (Object.keys(projectsByGroup).length === 0) {
      ui.alert('有効なGroupが見つかりません。');
      return;
    }
    const createdDocs = [];
    Object.keys(projectsByGroup).forEach(groupName => {
      const projects = projectsByGroup[groupName];
      const docUrl = createGroupProjectDocument(groupName, projects);
      createdDocs.push(`${groupName}: ${docUrl}`);
    });
    const message = `企画案のGoogleドキュメント出力が完了しました！\n\n作成されたドキュメント:\n${createdDocs.join('\n')}`;
    ui.alert(message);
  } catch (error) {
    ui.alert(`エラーが発生しました: ${error.message}`);
  }
}

function appendProjectSummaryCards(body, projects) {
  try {
    Logger.log('=== カード作成開始 ===');
    Logger.log('プロジェクト数: ' + projects.length);

    body.appendPageBreak();

    const summaryTitle = body.appendParagraph('📋 プロジェクト サマリーカード集');
    summaryTitle.setHeading(DocumentApp.ParagraphHeading.HEADING1)
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

    const subtitle = body.appendParagraph('ワークショップ用 - 切り取ってご利用ください');
    subtitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
      .setItalic(true)
      .setForegroundColor('#666666');

    body.appendParagraph('');

    projects.forEach((project, index) => {
      Logger.log(`カード ${index + 1} 作成中...`);

      const table = body.appendTable();
      const row = table.appendTableRow();
      const cell = row.appendTableCell();

      createProjectCard(cell, project, index + 1);

      table.setBorderWidth(2);
      table.setBorderColor('#333333');

      body.appendParagraph('');
    });

    Logger.log('=== カード作成完了 ===');

  } catch (error) {
    Logger.log('カード作成エラー: ' + error.message);
    body.appendParagraph('カード作成でエラーが発生しました: ' + error.message);
  }
}

function createProjectCard(cell, projectRow, cardNumber) {
  try {
    Logger.log(`Card ${cardNumber} の詳細作成中...`);

    const title = projectRow[TITLE_COL - 1] || 'タイトル未設定';
    const projectPlanSummary = projectRow[PROJECT_PLAN_SUMMARY_COL - 1] || '';

    Logger.log(`プロジェクト名: ${title}`);
    Logger.log(`サマリーテキスト長: ${projectPlanSummary.length}文字`);

    const cardData = extractCardData(projectPlanSummary, projectRow);
    Logger.log('抽出されたカードデータ:', JSON.stringify(cardData));

    cell.setBackgroundColor('#f9f9f9');

    const cardNumberPara = cell.appendParagraph(`Card ${cardNumber}`);
    cardNumberPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT)
      .setFontSize(8)
      .setForegroundColor('#999999');

    const projectNamePara = cell.appendParagraph(`🏛️ ${cardData.projectName}`);
    projectNamePara.setBold(true).setFontSize(12);

    const proposerPara = cell.appendParagraph(`👤 提案者: ${cardData.proposer}`);
    proposerPara.setFontSize(10).setForegroundColor('#555555');

    cell.appendParagraph('');

    const membersPara = cell.appendParagraph(`🧙‍♂️ メンバー: ${cardData.coreMembers}`);
    membersPara.setFontSize(10);

    const effectsPara = cell.appendParagraph(`🎯 期待効果: ${cardData.effects}`);
    effectsPara.setFontSize(10);

    const phasesPara = cell.appendParagraph(`✅ 実行計画:`);
    phasesPara.setFontSize(10).setBold(true);

    const phasesDetailPara = cell.appendParagraph(cardData.phases);
    phasesDetailPara.setFontSize(9);

    if (cardData.budget) {
      const budgetPara = cell.appendParagraph(`💰 予算: ${cardData.budget}`);
      budgetPara.setFontSize(10).setForegroundColor('#006600').setBold(true);
    }

    cell.setPaddingTop(10);
    cell.setPaddingBottom(10);
    cell.setPaddingLeft(10);
    cell.setPaddingRight(10);

    Logger.log(`Card ${cardNumber} 作成完了`);

  } catch (error) {
    Logger.log(`Card ${cardNumber} 作成エラー: ` + error.message);
    cell.appendParagraph(`Card ${cardNumber} - エラーが発生しました`);
  }
}

function extractCardData(summaryText, projectRow) {
  const result = {
    projectName: 'プロジェクト名未取得',
    proposer: '提案者不明',
    coreMembers: '未定',
    effects: '効果未定',
    phases: '計画未定',
    budget: null
  };

  if (projectRow && projectRow[PLAYERNAME_COL - 1]) {
    result.proposer = getPlayerNameFromId(projectRow[PLAYERNAME_COL - 1]);
    Logger.log('発案者名取得: ' + result.proposer);
  }

  if (!summaryText || summaryText.length < 10) {
    Logger.log('サマリーテキストが空または短すぎます');
    return result;
  }

  try {
    Logger.log('データ抽出開始...');

    const projectNamePatterns = [
      /🏛️\s*プロジェクト名:\s*([^\n]+)/,
      /# 🎮\s*([^\n]+)/,
      /プロジェクト名:\s*([^\n]+)/
    ];

    for (const pattern of projectNamePatterns) {
      const match = summaryText.match(pattern);
      if (match) {
        result.projectName = match[1].trim();
        Logger.log('プロジェクト名抽出成功: ' + result.projectName);
        break;
      }
    }

    const membersMatch = summaryText.match(/### 🧙‍♂️ コアメンバー[\s\S]*?```([\s\S]*?)```/);
    if (membersMatch) {
      const roles = [];
      const lines = membersMatch[1].split('\n');
      for (const line of lines) {
        const roleMatch = line.match(/⚔️\s*([^(]+)(?:\([^)]+\))?/);
        if (roleMatch) {
          roles.push(roleMatch[1].trim());
        }
      }
      if (roles.length > 0) {
        result.coreMembers = roles.slice(0, 3).join(', ');
        Logger.log('コアメンバー抽出成功: ' + result.coreMembers);
      }
    }

    const effectsMatch = summaryText.match(/### 🏆 短期効果[\s\S]*?```([\s\S]*?)```/);
    if (effectsMatch) {
      const effects = [];
      const lines = effectsMatch[1].split('\n');
      for (const line of lines) {
        const effectMatch = line.match(/[⚡🌱💡]\s*([^🥇🥈🥉\n]+)/);
        if (effectMatch) {
          effects.push(effectMatch[1].trim());
        }
      }
      if (effects.length > 0) {
        result.effects = effects.slice(0, 3).join(', ');
        Logger.log('期待効果抽出成功: ' + result.effects);
      }
    }

    const phasesMatch = summaryText.match(/## 🗺️ 攻略マップ（実行計画）([\s\S]*?)(?=---|##|$)/);
    if (phasesMatch) {
      const phases = [];
      const phaseBlocks = phasesMatch[1].matchAll(/### 📍 Phase \d+:[\s\S]*?```([\s\S]*?)```/g);
      for (const block of phaseBlocks) {
        const goalMatch = block[1].match(/🎯 目標:\s*([^\n]+)/);
        if (goalMatch) {
          phases.push(goalMatch[1].trim());
        }
      }
      if (phases.length > 0) {
        result.phases = phases.slice(0, 3).join(' → ');
        Logger.log('フェーズ目標抽出成功: ' + result.phases);
      }
    }

    const budgetPatterns = [
      /💰\s*総予算:\s*([^\n]+)/,
      /💼\s*総投資額:\s*([^\n]+)/
    ];

    for (const pattern of budgetPatterns) {
      const match = summaryText.match(pattern);
      if (match) {
        result.budget = match[1].trim();
        Logger.log('予算抽出成功: ' + result.budget);
        break;
      }
    }

    Logger.log('データ抽出完了');

  } catch (error) {
    Logger.log('データ抽出エラー: ' + error.message);
  }

  return result;
}

function createGroupProjectDocument(groupName, projects) {
  try {
    Logger.log('=== ドキュメント作成開始 ===');
    Logger.log('グループ: ' + groupName);
    Logger.log('プロジェクト数: ' + projects.length);

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy年MM月dd日');
    const docTitle = `【${groupName}】戦略統合型プロジェクト案集_${timestamp}_Gemini2.5版`;
    const doc = DocumentApp.create(docTitle);
    const body = doc.getBody();
    body.clear();

    const titleParagraph = body.appendParagraph(`${groupName} 戦略統合型プロジェクト案集`);
    titleParagraph.setHeading(DocumentApp.ParagraphHeading.TITLE).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    const subtitleParagraph = body.appendParagraph('Powered by Gemini 2.5 Flash');
    subtitleParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setItalic(true).setForegroundColor('#666666');
    const dateParagraph = body.appendParagraph(`作成日: ${timestamp}`);
    dateParagraph.setAlignment(DocumentApp.HorizontalAlignment.RIGHT).setItalic(true);

    body.appendParagraph('');

    const tocParagraph = body.appendParagraph('📋 目次');
    tocParagraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    projects.forEach((project, index) => {
      const playerName = getPlayerNameFromId(project[PLAYERNAME_COL - 1]);
      const title = project[TITLE_COL - 1] || 'タイトル未設定';
      body.appendParagraph(`${index + 1}. ${playerName}: ${title}`);
    });
    body.appendParagraph('');
    body.appendHorizontalRule();
    body.appendParagraph('');

    projects.forEach((project, index) => {
      appendProjectToDocument(body, project, index + 1);
      if (index < projects.length - 1) {
        body.appendPageBreak();
      }
    });

    Logger.log('カードページ追加中...');
    appendProjectSummaryCards(body, projects);

    Logger.log('=== ドキュメント作成完了 ===');
    return doc.getUrl();

  } catch (error) {
    Logger.log('ドキュメント作成エラー: ' + error.message);
    throw error;
  }
}

function appendProjectToDocument(body, projectRow, projectNumber) {
  const playerName = getPlayerNameFromId(projectRow[PLAYERNAME_COL - 1]);
  const title = projectRow[TITLE_COL - 1] || 'タイトル未設定';
  const analysis = projectRow[ANALYSIS_COL - 1] || '';
  const projectPlanSummary = projectRow[PROJECT_PLAN_SUMMARY_COL - 1] || '（サマリーなし）';

  const projectTitle = body.appendParagraph(`${projectNumber}. ${playerName}の提案: ${title}`);
  projectTitle.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('');

  const summaryTitle = body.appendParagraph('プロジェクトサマリー');
  summaryTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor('#1155cc');

  const summaryLines = projectPlanSummary.split('\n');
  summaryLines.forEach(line => {
    if (line.trim()){
      const p = body.appendParagraph(line);
      if(line.match(/^(?:📋|🎯|📊|🚀|📈)/)){
        p.setBold(true).setHeading(DocumentApp.ParagraphHeading.HEADING3);
      } else if (line.match(/^(?:•|Phase)/)) {
        p.setIndentFirstLine(36).setIndentStart(36);
      }
    }
  });

  body.appendParagraph('');
  const analysisTitle = body.appendParagraph('キー分析結果');
  analysisTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor('#34a853');
  const analysisPara = body.appendParagraph(analysis.replace(/`/g, ''));
  analysisPara.setFontFamily('Consolas').setBackgroundColor('#f3f3f3').setIndentFirstLine(20).setIndentStart(20);
}
