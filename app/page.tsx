'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import FileUploader from '@/components/FileUploader';
import ProgressModal from '@/components/ProgressModal';
import { ProcessingStatus, ErrorDetail } from '@/types';
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
            // Step 1: Upload
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
                    message: uploadData.error || 'ファイルのアップロードに失敗しました',
                };
            }

            setProcessingStatus({
                step: 'upload',
                progress: 25,
                message: 'アップロード完了',
            });

            // Step 2: Transcribe
            setProcessingStatus({
                step: 'transcribe',
                progress: 30,
                message: 'Gemini 2.5 Flashで文字起こし中...',
            });

            // Get selected folder ID from localStorage
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
                step: 'transcribe',
                progress: 50,
                message: '文字起こし完了',
            });

            // Step 3: DOCX (already done in transcribe API)
            setProcessingStatus({
                step: 'docx',
                progress: 75,
                message: 'DOCXファイル生成完了',
            });

            // Step 4: Drive (already done in transcribe API)
            setProcessingStatus({
                step: 'drive',
                progress: 90,
                message: 'Google Driveへ保存完了',
            });

            // Complete
            setProcessingStatus({
                step: 'complete',
                progress: 100,
                message: '全ての処理が完了しました',
            });

            setResult({
                transcription: transcribeData.transcription,
                docxUrl: transcribeData.docxUrl,
            });

            // Auto-close modal after 2 seconds
            setTimeout(() => {
                setIsProcessing(false);
            }, 2000);
        } catch (err: any) {
            console.error('Processing error:', err);

            const errorDetail: ErrorDetail = {
                code: err.code || 'ERR_UNKNOWN',
                message: err.message || '不明なエラーが発生しました',
                stack: err.stack,
                timestamp: new Date().toISOString(),
            };

            setError(errorDetail);
            setProcessingStatus({
                step: 'error',
                progress: 0,
                message: 'エラーが発生しました',
            });
        }
    };

    const closeModal = () => {
        setIsProcessing(false);
        setError(undefined);
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
                    <h1 className={styles.welcomeTitle}>🎤 音声文字起こしアプリ</h1>
                    <p className={styles.welcomeText}>
                        音声を録音またはアップロードして、AIが自動で文字起こしを行います。
                    </p>
                    <p className={styles.welcomeText}>
                        結果はDOCXファイルとしてGoogle Driveに保存されます。
                    </p>
                    <p className={styles.welcomeHint}>
                        始めるには、右上の「Googleでログイン」をクリックしてください。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ProgressModal
                isOpen={isProcessing}
                status={processingStatus}
                error={error}
                onClose={closeModal}
            />

            <div className="container">
                <div className={styles.hero}>
                    <h1 className={styles.title}>音声文字起こし</h1>
                    <p className={styles.subtitle}>
                        音声を録音またはアップロードして、自動で文字起こしを行います
                    </p>
                </div>

                <div className="card fade-in">
                    <h2 className={styles.sectionTitle}>🎙 音声を録音</h2>
                    <AudioRecorder
                        onRecordingComplete={(blob, filename) =>
                            handleFileProcess(blob, filename)
                        }
                    />
                </div>

                <div className={styles.divider}>または</div>

                <div className="card fade-in">
                    <h2 className={styles.sectionTitle}>📁 ファイルをアップロード</h2>
                    <FileUploader
                        onFileSelected={(file) => handleFileProcess(file, file.name)}
                    />
                </div>

                {result && (
                    <div className={`card ${styles.result} fade-in`}>
                        <h2 className={styles.resultTitle}>✅ 完了しました！</h2>
                        <div className={styles.transcription}>
                            <h3>文字起こし結果:</h3>
                            <p>{result.transcription}</p>
                        </div>
                        <a
                            href={result.docxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            📄 Google DriveでDOCXを開く
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
