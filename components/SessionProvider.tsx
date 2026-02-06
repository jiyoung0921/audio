'use client';

import { SessionProvider as NextAuthSessionProvider, useSession } from 'next-auth/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';

function AuthToastWrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const prevStatusRef = useRef<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: '',
        type: 'info',
        visible: false,
    });

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type, visible: true });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    useEffect(() => {
        const prevStatus = prevStatusRef.current;

        // Detect login: was not authenticated, now is
        if (prevStatus === 'unauthenticated' && status === 'authenticated') {
            showToast('ログインしました！', 'success');
        }

        // Detect logout: was authenticated, now is not
        if (prevStatus === 'authenticated' && status === 'unauthenticated') {
            showToast('ログアウトしました', 'info');
        }

        prevStatusRef.current = status;
    }, [status, showToast]);

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={hideToast}
                duration={3000}
            />
            {children}
        </>
    );
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthSessionProvider>
            <AuthToastWrapper>
                {children}
            </AuthToastWrapper>
        </NextAuthSessionProvider>
    );
}
