'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { DriveFolder } from '@/types';
import styles from './page.module.css';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [folders, setFolders] = useState<DriveFolder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string>('');
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderParent, setNewFolderParent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (session) {
            loadFolders();
            // Load saved folder preference from localStorage
            const savedFolderId = localStorage.getItem('selectedDriveFolderId');
            if (savedFolderId) {
                setSelectedFolderId(savedFolderId);
            }
        }
    }, [session]);

    const loadFolders = async () => {
        setLoadingFolders(true);
        setError('');
        try {
            const response = await fetch('/api/drive/folders');
            const data = await response.json();

            if (data.success) {
                setFolders([{ id: '', name: 'マイドライブ', parents: [] }, ...data.folders]);
            } else {
                if (response.status === 401) {
                    setError('認証エラー: 一度ログアウトして再ログインしてください');
                } else {
                    setError(data.error || 'フォルダの読み込みに失敗しました');
                }
                console.error('Folder load error:', data.error);
            }
        } catch (error) {
            console.error('Failed to load folders:', error);
            setError('フォルダの読み込みに失敗しました。ログアウトして再ログインしてください。');
        } finally {
            setLoadingFolders(false);
        }
    };

    const handleFolderSelect = (folderId: string) => {
        setSelectedFolderId(folderId);
        localStorage.setItem('selectedDriveFolderId', folderId);
        setMessage('保存先フォルダを設定しました');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            alert('フォルダ名を入力してください');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/drive/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newFolderName,
                    parentId: newFolderParent || undefined,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage('フォルダを作成しました');
                setNewFolderName('');
                setNewFolderParent('');
                await loadFolders();
                setTimeout(() => setMessage(''), 3000);
            } else {
                alert(`エラー: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to create folder:', error);
            alert('フォルダの作成に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className="loading"></div>
                <p>読み込み中...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className={styles.welcome}>
                <div className={styles.welcomeCard}>
                    <h1 className={styles.welcomeTitle}>⚙️ 設定</h1>
                    <p className={styles.welcomeText}>
                        設定を変更するには、ログインしてください。
                    </p>
                    <button onClick={() => signIn('google')} className="btn btn-primary">
                        Googleでログイン
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className={styles.hero}>
                <h1 className={styles.title}>⚙️ 設定</h1>
                <p className={styles.subtitle}>アプリケーションの設定を管理</p>
            </div>

            {message && (
                <div className={`card ${styles.message}`}>
                    <p>✅ {message}</p>
                </div>
            )}

            {error && (
                <div className={`card ${styles.errorMessage}`}>
                    <p>⚠️ {error}</p>
                    <button onClick={loadFolders} className="btn btn-secondary">
                        再読み込み
                    </button>
                </div>
            )}

            {/* Google Drive Settings */}
            <div className="card fade-in">
                <h2 className={styles.sectionTitle}>📁 Google Drive設定</h2>

                <div className={styles.setting}>
                    <label className={styles.label}>保存先フォルダ</label>
                    {loadingFolders ? (
                        <div className={styles.loadingContainer}>
                            <div className="loading"></div>
                            <span>フォルダを読み込み中...</span>
                        </div>
                    ) : (
                        <select
                            value={selectedFolderId}
                            onChange={(e) => handleFolderSelect(e.target.value)}
                            className="input"
                            disabled={folders.length === 0}
                        >
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <p className={styles.hint}>
                        文字起こしファイルの保存先を選択してください
                    </p>
                </div>
            </div>

            {/* Create Folder */}
            <div className="card fade-in">
                <h2 className={styles.sectionTitle}>➕ 新しいフォルダを作成</h2>

                <div className={styles.setting}>
                    <label className={styles.label}>フォルダ名</label>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="例: 会議録音"
                        className="input"
                    />
                </div>

                <div className={styles.setting}>
                    <label className={styles.label}>作成場所（任意）</label>
                    <select
                        value={newFolderParent}
                        onChange={(e) => setNewFolderParent(e.target.value)}
                        className="input"
                    >
                        {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                                {folder.name}
                            </option>
                        ))}
                    </select>
                    <p className={styles.hint}>
                        未選択の場合はマイドライブに作成されます
                    </p>
                </div>

                <button
                    onClick={handleCreateFolder}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? '作成中...' : '📁 フォルダを作成'}
                </button>
            </div>

            {/* Account Settings */}
            <div className="card fade-in">
                <h2 className={styles.sectionTitle}>👤 アカウント</h2>

                <div className={styles.setting}>
                    <label className={styles.label}>ログイン中</label>
                    <p className={styles.accountInfo}>{session.user?.email}</p>
                </div>

                <button onClick={() => signOut()} className="btn btn-danger">
                    ログアウト
                </button>
            </div>
        </div>
    );
}
