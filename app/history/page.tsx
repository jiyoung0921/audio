'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HistoryList from '@/components/HistoryList';
import { Clock } from '@/components/Icons';
import styles from './page.module.css';

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div>
            <div className={styles.hero}>
                <div className={styles.iconWrapper}>
                    <Clock size={28} color="var(--primary)" />
                </div>
                <h1 className={styles.title}>履歴</h1>
                <p className={styles.subtitle}>
                    録音・アップロードしたファイル
                </p>
            </div>

            <div className="card">
                <HistoryList />
            </div>
        </div>
    );
}
