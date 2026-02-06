'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import ProgressModal from '@/components/ProgressModal';
import { ProcessingStatus, ErrorDetail } from '@/types';
import { CheckCircle } from '@/components/Icons';
import styles from './page.module.css';

export default function RecordPage() {
    const { data: session, status } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
        step: 'upload',
        progress: 0,
        message: '準備中...',
    });
    const [error, setError] = useState<ErrorDetail | undefined>();
    const [result, setResult] = useState<{
        transcription: string;
        docxUrl: string;
    } | null>(null);

    const handleRecordingComplete = async (blob: Blob, filename: string) => {
        setIsProcessing(true);
        setResult(null);
        setError(undefined);

        try {
            setProcessingStatus({
                step: 'upload',
                progress: 10,
                message: '録音データをアップロード中...',
            });

            const formData = new FormData();
            formData.append('file', blob, filename);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw {
                    code: 'ERR_UPLOAD',
                    message: uploadData.error || 'アップロードに失敗しました',
                };
            }

            setProcessingStatus({
                step: 'transcribe',
                progress: 30,
                message: 'AIが文字起こし中...',
            });

            const selectedFolderId = localStorage.getItem('selectedDriveFolderId') || '';

            const transcribeResponse = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath: uploadData.filePath,
                    originalName: filename,
                    fileType: blob.type || 'audio/webm',
                    fileSize: blob.size,
                    folderId: selectedFolderId,
                }),
            });

            const transcribeData = await transcribeResponse.json();

            if (!transcribeData.success) {
                throw {
                    code: 'ERR_TRANSCRIBE',
                    message: transcribeData.error || '文字起こしに失敗しました',
                };
            }

            setProcessingStatus({
                step: 'complete',
                progress: 100,
                message: '完了！',
            });

            setResult({
                transcription: transcribeData.transcription,
                docxUrl: transcribeData.docxUrl,
            });

            setTimeout(() => {
                setIsProcessing(false);
            }, 2000);
        } catch (err: any) {
            console.error('Processing error:', err);
            setError({
                code: err.code || 'ERR_UNKNOWN',
                message: err.message || '不明なエラーが発生しました',
                timestamp: new Date().toISOString(),
            });
            setProcessingStatus({
                step: 'error',
                progress: 0,
                message: 'エラーが発生しました',
            });
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className={styles.notLoggedIn}>
                <p>録音するにはログインが必要です</p>
            </div>
        );
    }

    return (
        <>
            <ProgressModal
                isOpen={isProcessing}
                status={processingStatus}
                error={error}
                onClose={() => {
                    setIsProcessing(false);
                    setError(undefined);
                }}
            />

            <div className={styles.page}>
                <h1 className={styles.title}>🎙️ 録音</h1>
                <p className={styles.subtitle}>
                    ボタンをタップして録音を開始
                </p>

                <div className={styles.recorderWrapper}>
                    <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                </div>

                {result && (
                    <div className={`${styles.result} fade-in`}>
                        <div className={styles.resultHeader}>
                            <CheckCircle size={24} weight="fill" className={styles.successIcon} />
                            <span>文字起こし完了</span>
                        </div>
                        <div className={styles.transcription}>
                            <p>{result.transcription}</p>
                        </div>
                        <a
                            href={result.docxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-block"
                        >
                            📄 Google Driveで開く
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
