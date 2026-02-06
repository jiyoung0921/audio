'use client';

import { useState, useRef, useEffect } from 'react';
import { generateFilename } from '@/lib/utils';
import { Microphone, StopCircle, PauseCircle, PlayCircle } from './Icons';
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

    // Not recording state - show large mic button
    if (!isRecording) {
        return (
            <div className={styles.recorder}>
                <button className={styles.mainButton} onClick={startRecording}>
                    <Microphone size={48} weight="fill" />
                </button>
                <p className={styles.hint}>タップして録音開始</p>
            </div>
        );
    }

    // Recording state - Apple Voice Memos style
    return (
        <div className={styles.recorder}>
            {/* Waveform visualization */}
            <div className={styles.waveformArea}>
                <div className={`${styles.waveform} ${isPaused ? styles.paused : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {/* Timer */}
            <div className={styles.timer}>
                {isPaused && <span className={styles.pausedLabel}>一時停止中</span>}
                <span className={styles.time}>{formatTime(recordingTime)}</span>
            </div>

            {/* Controls - Apple Voice Memos style */}
            <div className={styles.controls}>
                {/* Left: Pause/Resume */}
                <button
                    className={styles.controlButton}
                    onClick={isPaused ? resumeRecording : pauseRecording}
                    aria-label={isPaused ? '再開' : '一時停止'}
                >
                    {isPaused ? (
                        <PlayCircle size={56} color="var(--primary)" />
                    ) : (
                        <PauseCircle size={56} color="var(--text-muted)" />
                    )}
                </button>

                {/* Right: Stop */}
                <button
                    className={styles.controlButton}
                    onClick={stopRecording}
                    aria-label="停止"
                >
                    <StopCircle size={56} color="var(--danger)" />
                </button>
            </div>

            {/* Labels below buttons */}
            <div className={styles.controlLabels}>
                <span>{isPaused ? '再開' : '一時停止'}</span>
                <span>完了</span>
            </div>
        </div>
    );
}
