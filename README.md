# 音声録音・文字起こしアプリ

音声を録音またはアップロードして、AIが自動で文字起こしを行うWebアプリケーションです。文字起こし結果はDOCXファイルとしてGoogle Driveに自動保存されます。

## 機能

- ✅ **音声録音** - ブラウザから直接録音（一時停止・停止機能付き）
- ✅ **音声ファイルアップロード** - MP3、M4A、WAV等の音声ファイルをアップロード
- ✅ **AI文字起こし** - Google Cloud Speech-to-Text APIで自動文字起こし
- ✅ **DOCX生成** - 文字起こし結果を自動的にDOCXファイルに変換
- ✅ **Google Drive連携** - 生成されたDOCXファイルを自動的にGoogle Driveに保存
- ✅ **Google認証** - Googleアカウントでログイン/ログアウト
- ✅ **履歴管理** - アップロード履歴の表示・削除、DOCXファイルへのリンク

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + React
- **認証**: NextAuth.js + Google OAuth 2.0
- **文字起こし**: Google Cloud Speech-to-Text API
- **ストレージ**: Google Drive API
- **DOCX生成**: docx ライブラリ
- **データベース**: better-sqlite3（履歴管理）

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud Platformの設定

#### 2.1 プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成

#### 2.2 APIの有効化
以下のAPIを有効化してください:
- Google Cloud Speech-to-Text API
- Google Drive API

#### 2.3 サービスアカウントの作成
1. 「IAMと管理」→「サービスアカウント」
2. サービスアカウントを作成
3. JSONキーをダウンロード
4. プロジェクトルートに配置（例: `service-account-key.json`）

#### 2.4 OAuth 2.0クライアントIDの作成
1. 「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「OAuth 2.0クライアントID」
3. アプリケーションの種類: Webアプリケーション
4. 承認済みのリダイレクトURI: `http://localhost:3000/api/auth/callback/google`
5. クライアントIDとクライアントシークレットをメモ

### 3. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、以下の値を設定してください:

```bash
cp .env.local.example .env.local
```

`.env.local`の内容:

```env
# Google Cloud Settings
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Google OAuth (NextAuth)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-generate-with-openssl-rand-base64-32

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

#### NextAuth Secretの生成

```bash
openssl rand -base64 32
```

#### Google Drive フォルダIDの取得
1. Google Driveで保存先フォルダを作成
2. フォルダを開いた時のURLから取得
   - URL例: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - `FOLDER_ID_HERE`の部分がフォルダID

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## iPhoneでの使用方法

### ローカルネットワークでアクセス

1. MacとiPhoneが同じWi-Fiに接続されていることを確認
2. MacのIPアドレスを確認:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. iPhoneのSafariで `http://[MacのIPアドレス]:3000` にアクセス

### ホーム画面に追加（PWA風）

1. Safariでアプリを開く
2. 共有ボタン → 「ホーム画面に追加」
3. ホーム画面からアプリのように起動可能

## 使い方

1. **ログイン**: 右上の「Googleでログイン」をクリック
2. **録音**: 「音声を録音」セクションで録音開始
   - 一時停止・再開・停止が可能
3. **アップロード**: 「ファイルをアップロード」セクションでファイルを選択
   - ドラッグ&ドロップにも対応
4. **文字起こし**: 自動的に文字起こしが開始されます
5. **結果確認**: 完了後、DOCXファイルがGoogle Driveに保存されます
6. **履歴**: 「履歴」ページで過去のファイルを確認・削除

## プロジェクト構造

```
voice-transcription-app/
├── app/
│   ├── api/              # API Routes
│   ├── history/          # 履歴ページ
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── components/           # Reactコンポーネント
├── lib/                  # ライブラリ関数
├── types/                # TypeScript型定義
└── public/               # 静的ファイル
```

## トラブルシューティング

### 音声ファイルがアップロードできない
- iOSの場合、`audio/*`で選択できない場合があります
- ファイルアプリから直接選択してみてください

### 文字起こしが失敗する
- Google Cloud Speech-to-Text APIの認証情報を確認
- サービスアカウントに適切な権限があるか確認

### Google Driveにアップロードできない
- OAuth 2.0のスコープに`https://www.googleapis.com/auth/drive.file`が含まれているか確認
- Google Drive APIが有効化されているか確認

## ライセンス

MIT
