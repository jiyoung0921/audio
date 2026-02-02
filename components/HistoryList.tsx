'use client';

import { useState, useEffect } from 'react';
import { HistoryItem } from '@/types';
import styles from './HistoryList.module.css';

export default function HistoryList() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            if (data.success) {
                setItems(data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('この履歴を削除しますか？')) {
            return;
        }

        try {
            const response = await fetch('/api/history', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.success) {
                setItems(items.filter((item) => item.id !== id));
            } else {
                alert('削除に失敗しました');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('削除に失敗しました');
        }
    };

    const startEditing = (item: HistoryItem) => {
        setEditingId(item.id);
        setEditingName(item.filename);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    const saveRename = async (item: HistoryItem) => {
        if (!editingName.trim()) {
            alert('ファイル名を入力してください');
            return;
        }

        try {
            const response = await fetch('/api/drive/rename', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    historyId: item.id,
                    newName: editingName,
                    driveFileId: item.docxFileId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setItems(
                    items.map((i) =>
                        i.id === item.id ? { ...i, filename: editingName } : i
                    )
                );
                setEditingId(null);
                setEditingName('');
            } else {
                alert(`エラー: ${data.error}`);
            }
        } catch (error) {
            console.error('Rename error:', error);
            alert('ファイル名の変更に失敗しました');
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="loading"></div>
                <p>読み込み中...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>📭</div>
                <p>履歴がありません</p>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {items.map((item) => (
                <div key={item.id} className={styles.item}>
                    <div className={styles.itemHeader}>
                        {editingId === item.id ? (
                            <div className={styles.editContainer}>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className={`input ${styles.editInput}`}
                                    autoFocus
                                />
                                <button
                                    onClick={() => saveRename(item)}
                                    className="btn btn-success"
                                    title="保存"
                                >
                                    ✓
                                </button>
                                <button
                                    onClick={cancelEditing}
                                    className="btn btn-secondary"
                                    title="キャンセル"
                                >
                                    ✗
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className={styles.filename}>
                                    🎵 {item.filename}
                                    <button
                                        onClick={() => startEditing(item)}
                                        className={styles.editButton}
                                        title="名前を変更"
                                    >
                                        ✏️
                                    </button>
                                </h3>
                                <span className={styles.date}>
                                    {new Date(item.createdAt).toLocaleString('ja-JP')}
                                </span>
                            </>
                        )}
                    </div>

                    <div className={styles.itemBody}>
                        <div className={styles.info}>
                            <span className={styles.badge}>{item.fileType}</span>
                            <span className={styles.size}>
                                {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>

                        <div className={styles.transcription}>
                            {item.transcriptionText.substring(0, 200)}
                            {item.transcriptionText.length > 200 && '...'}
                        </div>
                    </div>

                    <div className={styles.itemFooter}>
                        <a
                            href={item.docxFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            📄 DOCXを開く
                        </a>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-danger"
                        >
                            🗑 削除
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
