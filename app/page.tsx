'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import FileUploader from '@/components/FileUploader';
import ProgressModal from '@/components/ProgressModal';
import { ProcessingStatus, ErrorDetail } from '@/types';
import { Microphone, CloudUpload, CheckCircle } from '@/components/Icons';
import styles from './page.module.css';

export default function Home() {
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

    const handleFileProcess = async (file: File | Blob, filename: string) => {
        setIsProcessing(true);
        setResult(null);
        setError(undefined);

        try {
            setProcessingStatus({
                step: 'upload',
                progress: 10,
                message: 'ファイルをアップロード中...',
            });

            const formData = new FormData();
            formData.append('file', file, filename);

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
                    fileType: file.type || 'audio/webm',
                    fileSize: file.size,
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
            <div className={styles.welcome}>
                <div className={styles.welcomeIcon}>
                    <Microphone size={64} weight="fill" />
                </div>
                <h1 className={styles.welcomeTitle}>VoiceDoc</h1>
                <p className={styles.welcomeText}>
                    音声をAIが自動で文字起こし
                </p>
                <div className={styles.welcomeFeatures}>
                    <div className={styles.feature}>
                        <Microphone size={24} />
                        <span>録音</span>
                    </div>
                    <div className={styles.feature}>
                        <CloudUpload size={24} />
                        <span>アップロード</span>
                    </div>
                    <div className={styles.feature}>
                        <CheckCircle size={24} weight="fill" />
                        <span>文字起こし</span>
                    </div>
                </div>
                <p className={styles.welcomeHint}>
                    ログインして始めましょう
                </p>
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
                {/* Recording Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Microphone size={20} />
                        <h2>録音</h2>
                    </div>
                    <div className={styles.card}>
                        <AudioRecorder
                            onRecordingComplete={(blob, filename) =>
                                handleFileProcess(blob, filename)
                            }
                        />
                    </div>
                </section>

                {/* Divider */}
                <div className={styles.divider}>
                    <span>または</span>
                </div>

                {/* Upload Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <CloudUpload size={20} />
                        <h2>ファイルアップロード</h2>
                    </div>
                    <FileUploader
                        onFileSelected={(file) => handleFileProcess(file, file.name)}
                    />
                </section>

                {/* Result */}
                {result && (
                    <section className={`${styles.section} ${styles.resultSection} fade-in`}>
                        <div className={styles.resultHeader}>
                            <CheckCircle size={28} weight="fill" className={styles.successIcon} />
                            <h2>完了しました！</h2>
                        </div>
                        <div className={styles.transcriptionBox}>
                            <p>{result.transcription}</p>
                        </div>
                        <a
                            href={result.docxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-block"
                        >
                            Google Driveで開く
                        </a>
                    </section>
                )}
            </div>
        </>
    );
}
