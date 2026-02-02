'use client';

import { useState, useRef, useEffect } from 'react';
import { generateFilename } from '@/lib/utils';
import styles from './AudioRecorder.module.css';

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob, filename: string) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const filename = generateFilename();
                onRecordingComplete(blob, filename);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('マイクへのアクセスに失敗しました');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            setRecordingTime(0);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.recorder}>
            <div className={styles.visualizer}>
                {isRecording && !isPaused && (
                    <div className={styles.waveform}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                {isPaused && <div className={styles.pausedIcon}>⏸</div>}
                {!isRecording && <div className={styles.micIcon}>🎤</div>}
            </div>

            {isRecording && (
                <div className={styles.timer}>{formatTime(recordingTime)}</div>
            )}

            <div className={styles.controls}>
                {!isRecording ? (
                    <button onClick={startRecording} className="btn btn-primary">
                        🎙 録音開始
                    </button>
                ) : (
                    <>
                        {!isPaused ? (
                            <button onClick={pauseRecording} className="btn btn-secondary">
                                ⏸ 一時停止
                            </button>
                        ) : (
                            <button onClick={resumeRecording} className="btn btn-success">
                                ▶️ 再開
                            </button>
                        )}
                        <button onClick={stopRecording} className="btn btn-danger">
                            ⏹ 停止
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
