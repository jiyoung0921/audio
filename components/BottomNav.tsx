'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, Clock, Gear } from './Icons';
import styles from './BottomNav.module.css';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'fill'; className?: string }>;
}

const navItems: NavItem[] = [
    { href: '/', label: 'ホーム', icon: House },
    { href: '/history', label: '履歴', icon: Clock },
    { href: '/settings', label: '設定', icon: Gear },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            <div className={styles.navContainer}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon
                                size={24}
                                weight={isActive ? 'fill' : 'regular'}
                                className={styles.icon}
                            />
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
