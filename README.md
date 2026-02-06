# 音声録音・文字起こしアプリ

音声を録音またはアップロードして、**Gemini 2.5 Flash** が自動で文字起こしを行うWebアプリケーションです。文字起こし結果はDOCXファイルとしてGoogle Driveに自動保存されます。

## 機能

- ✅ **音声録音** - ブラウザから直接録音（一時停止・停止機能付き）
- ✅ **音声ファイルアップロード** - MP3、M4A、WAV等の音声ファイルをアップロード
- ✅ **AI文字起こし** - **Gemini 2.5 Flash** による高速かつ高精度な文字起こし
- ✅ **DOCX生成** - 文字起こし結果を自動的にDOCXファイルに変換
- ✅ **Google Drive連携** - 生成されたDOCXファイルを自動的にGoogle Driveに保存
- ✅ **フォルダ管理** - Google Drive上の保存先フォルダを選択・新規作成可能
- ✅ **Google認証** - Googleアカウントでログイン/ログアウト
- ✅ **履歴管理** - アップロード履歴の表示・削除、ファイル名編集、Google Driveとの同期

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + React
- **認証**: NextAuth.js + Google OAuth 2.0
- **AIモデル**: Google Gemini 2.5 Flash (via Google Generative AI SDK)
- **ストレージ**: Google Drive API
- **DOCX生成**: docx ライブラリ
- **データベース**: better-sqlite3（履歴管理）
- **デプロイ**: Vercel

## デプロイ手順 (Vercel)

このアプリはVercelへのデプロイに最適化されています。

### 1. 準備

1. GitHubにリポジトリをプッシュ
2. [Vercel](https://vercel.com)でアカウント作成・ログイン
3. 「Add New...」→「Project」からGitHubリポジトリをインポート

### 2. 環境変数の設定 (Environment Variables)

Vercelのプロジェクト設定で以下の環境変数を設定してください:

| 変数名 | 説明 | 例 |
|---|---|---|
| `GEMINI_API_KEY` | Gemini APIキー | `AIzaSy...` |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット | `GOCSPX-...` |
| `NEXTAUTH_SECRET` | NextAuth用シークレット | `openssl rand -base64 32`で生成 |
| `NEXTAUTH_URL` | 本番環境のURL | `https://your-app.vercel.app` |

### 3. Google Cloud Consoleの設定

Vercelで発行されたURL（例: `https://your-app.vercel.app`）をGoogle Cloud Consoleの承認済みのリダイレクトURIに追加する必要があります。

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)にアクセス
2. 「認証情報」→該当するOAuth 2.0クライアントIDを選択
3. **承認済みのリダイレクトURI**に以下を追加:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
   ※ `your-app.vercel.app`は自身のVercelドメインに置き換えてください
4. 保存

### 4. 動作確認

デプロイ完了後、アプリを開いて以下の動作を確認してください:
1. Googleログインができること
2. 設定画面でGoogle Driveのフォルダが読み込めること
3. 録音・文字起こし・保存が一通り動作すること

## Vercelでの注意点 (重要)

Vercelはサーバーレス環境（読み取り専用ファイルシステム）のため、以下の対応を行っています:

1. **一時ファイル**:
   - `/tmp` ディレクトリを使用するように修正済みです。
   - 通常の `fs.writeFile` で `./uploads` などに保存するとエラーになります。
   
2. **データベース (SQLite)**:
   - SQLiteファイルも `/tmp/transcription.db` に作成されます。
   - **注意**: Vercelの `/tmp` は一時的なもので、デプロイやコールドスタートのたびにリセットされる可能性があります。
   - 永続的なデータ保存が必要な場合は、外部データベース（Vercel Postgres, Supabase, PlanetScaleなど）への移行を推奨します。

## ローカル開発手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`を作成し、上記環境変数 + `GOOGLE_DRIVE_FOLDER_ID` (オプション) を設定。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 安全な開発フロー (推奨)

新機能の追加や修正を行う際は、メイン環境（本番）を壊さないよう、以下の手順で行うことを推奨します。

1. **作業用ブランチの作成**:
   ```bash
   git checkout -b feature/新機能名
   # 例: git checkout -b feature/add-dark-mode
   ```

2. **開発・ローカルテスト**:
   コードを編集し、`npm run dev` で動作確認を行います。

3. **変更の保存（コミット）**:
   ```bash
   git add .
   git commit -m "機能追加: ダークモードの実装"
   ```

4. **本番への反映**:
   問題なければメインブランチに統合し、プッシュしてデプロイします。
   ```bash
   git checkout main
   git merge feature/新機能名
   git push origin main
   ```

## 制限事項

### 録音時間
- **推奨**: 30分以内
- ブラウザのメモリ制限により、長時間録音は端末によって不安定になる場合があります

### ファイルサイズ
- **最大**: 50MB（Vercel Function の制限）
- 大きすぎるファイルはアップロード前に圧縮するか、分割してください

### 対応フォーマット
- MP3, M4A, WAV, OGG, WebM

### 短い音声について
- 極端に短い録音（数秒以内）や無音の場合、「（音声なし）」と出力されます
