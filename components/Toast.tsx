'use client';

import { useState, useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.icon}>{icons[type]}</span>
            <span className={styles.message}>{message}</span>
        </div>
    );
}

// Global toast state manager
let toastCallback: ((message: string, type: ToastType) => void) | null = null;

export function setToastCallback(callback: (message: string, type: ToastType) => void) {
    toastCallback = callback;
}

export function showToast(message: string, type: ToastType = 'info') {
    if (toastCallback) {
        toastCallback(message, type);
    }
}
