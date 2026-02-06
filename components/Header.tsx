'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Microphone, User, SignOut } from './Icons';
import styles from './Header.module.css';

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Microphone size={18} weight="fill" />
                </div>
                <span className={styles.logoText}>VoiceDoc</span>
            </div>

            <div className={styles.auth}>
                {status === 'loading' ? (
                    <div className={styles.skeleton}></div>
                ) : session ? (
                    <div className={styles.userMenu}>
                        <div className={styles.avatar}>
                            {session.user?.image ? (
                                <img src={session.user.image} alt="" />
                            ) : (
                                <User size={16} />
                            )}
                        </div>
                        <button
                            onClick={() => signOut()}
                            className={styles.signOutBtn}
                            aria-label="ログアウト"
                        >
                            <SignOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn('google')}
                        className={styles.signInBtn}
                    >
                        ログイン
                    </button>
                )}
            </div>
        </header>
    );
}
