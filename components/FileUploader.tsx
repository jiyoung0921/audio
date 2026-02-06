'use client';

import { useRef, useState } from 'react';
import { CloudUpload, Folder } from './Icons';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
    onFileSelected: (file: File) => void;
}

export default function FileUploader({ onFileSelected }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            onFileSelected(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelected(file);
        }
    };

    return (
        <div
            className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*,.mp3,.m4a,.wav,.ogg,.webm,.mp4,.aac,*/*"
                onChange={handleFileChange}
                className={styles.fileInput}
            />

            <div className={styles.content}>
                <div className={styles.icon}>
                    <CloudUpload size={40} color="var(--primary)" />
                </div>
                <p className={styles.title}>ファイルをドラッグ＆ドロップ</p>
                <p className={styles.hint}>または</p>
                <button
                    type="button"
                    className={styles.selectButton}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Folder size={18} />
                    <span>ファイルを選択</span>
                </button>
                <p className={styles.formats}>MP3, M4A, WAV, WebM, MP4</p>
            </div>
        </div>
    );
}
