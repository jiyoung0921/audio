'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HistoryList from '@/components/HistoryList';
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
                <div className="loading"></div>
                <p>読み込み中...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="container">
            <div className={styles.hero}>
                <h1 className={styles.title}>📚 履歴</h1>
                <p className={styles.subtitle}>
                    これまでに録音・アップロードしたファイルの履歴
                </p>
            </div>

            <div className="card">
                <HistoryList />
            </div>
        </div>
    );
}
