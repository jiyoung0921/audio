'use client';

import { useState } from 'react';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
    onFileSelected: (file: File) => void;
}

export default function FileUploader({ onFileSelected }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

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
        } else {
            alert('音声ファイルを選択してください');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelected(file);
        }
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={styles.icon}>📁</div>
                <p className={styles.text}>
                    ファイルをドラッグ&ドロップ
                </p>
                <p className={styles.or}>または</p>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                    📂 ファイルを選択
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </label>
                <p className={styles.formats}>
                    対応形式: MP3, M4A, WAV, OGG, WebM
                </p>
            </div>
        </div>
    );
}
