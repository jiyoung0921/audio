'use client';

import { ProcessingStatus, ErrorDetail } from '@/types';
import styles from './ProgressModal.module.css';

interface ProgressModalProps {
    isOpen: boolean;
    status: ProcessingStatus;
    error?: ErrorDetail;
    onClose?: () => void;
}

const stepLabels: Record<string, string> = {
    upload: 'ファイルアップロード中',
    transcribe: '文字起こし処理中',
    docx: 'DOCXファイル生成中',
    drive: 'Google Driveへ保存中',
    complete: '完了しました！',
    error: 'エラーが発生しました',
};

export default function ProgressModal({ isOpen, status, error, onClose }: ProgressModalProps) {
    if (!isOpen) return null;

    const copyErrorToClipboard = () => {
        if (error) {
            const errorText = `エラーコード: ${error.code}\nメッセージ: ${error.message}\n時刻: ${error.timestamp}\n\nスタックトレース:\n${error.stack || 'なし'}`;
            navigator.clipboard.writeText(errorText);
            alert('エラー情報をクリップボードにコピーしました');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {status.step === 'error' ? '⚠️ エラー' : '🔄 処理中'}
                    </h2>
                </div>

                <div className={styles.content}>
                    {status.step !== 'error' && status.step !== 'complete' && (
                        <>
                            <div className={styles.stepIndicator}>
                                <div className={`${styles.step} ${status.step === 'upload' || status.progress >= 25 ? styles.active : ''}`}>
                                    <div className={styles.stepIcon}>📤</div>
                                    <div className={styles.stepLabel}>アップロード</div>
                                </div>
                                <div className={styles.stepLine}></div>
                                <div className={`${styles.step} ${status.step === 'transcribe' || status.progress >= 50 ? styles.active : ''}`}>
                                    <div className={styles.stepIcon}>🎤</div>
                                    <div className={styles.stepLabel}>文字起こし</div>
                                </div>
                                <div className={styles.stepLine}></div>
                                <div className={`${styles.step} ${status.step === 'docx' || status.progress >= 75 ? styles.active : ''}`}>
                                    <div className={styles.stepIcon}>📄</div>
                                    <div className={styles.stepLabel}>DOCX生成</div>
                                </div>
                                <div className={styles.stepLine}></div>
                                <div className={`${styles.step} ${status.step === 'drive' || status.progress >= 100 ? styles.active : ''}`}>
                                    <div className={styles.stepIcon}>☁️</div>
                                    <div className={styles.stepLabel}>Drive保存</div>
                                </div>
                            </div>

                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${status.progress}%` }}></div>
                            </div>

                            <p className={styles.message}>{status.message}</p>
                        </>
                    )}

                    {status.step === 'complete' && (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>✅</div>
                            <p className={styles.successMessage}>処理が完了しました！</p>
                            {onClose && (
                                <button onClick={onClose} className="btn btn-primary">
                                    閉じる
                                </button>
                            )}
                        </div>
                    )}

                    {status.step === 'error' && error && (
                        <div className={styles.error}>
                            <div className={styles.errorIcon}>❌</div>
                            <div className={styles.errorContent}>
                                <h3 className={styles.errorCode}>エラーコード: {error.code}</h3>
                                <p className={styles.errorMessage}>{error.message}</p>
                                <p className={styles.errorTime}>発生時刻: {new Date(error.timestamp).toLocaleString('ja-JP')}</p>

                                {error.stack && (
                                    <details className={styles.errorDetails}>
                                        <summary>詳細情報（開発者向け）</summary>
                                        <pre className={styles.errorStack}>{error.stack}</pre>
                                    </details>
                                )}

                                <div className={styles.errorActions}>
                                    <button onClick={copyErrorToClipboard} className="btn btn-secondary">
                                        📋 エラー情報をコピー
                                    </button>
                                    {onClose && (
                                        <button onClick={onClose} className="btn btn-danger">
                                            閉じる
                                        </button>
                                    )}
                                </div>

                                <p className={styles.errorHelp}>
                                    問題が解決しない場合は、上記のエラー情報をコピーして<strong>管理者に報告してください</strong>。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
