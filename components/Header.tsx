'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    🎤 音声文字起こし
                </Link>

                {session && (
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.navLink}>
                            ホーム
                        </Link>
                        <Link href="/history" className={styles.navLink}>
                            履歴
                        </Link>
                        <Link href="/settings" className={styles.navLink}>
                            設定
                        </Link>
                    </nav>
                )}

                <div className={styles.user}>
                    {session ? (
                        <>
                            <span className={styles.userName}>{session.user?.name || session.user?.email}</span>
                            <button onClick={() => signOut()} className="btn btn-secondary">
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <button onClick={() => signIn('google')} className="btn btn-primary">
                            Googleでログイン
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
