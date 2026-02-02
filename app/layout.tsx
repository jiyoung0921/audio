import type { Metadata } from 'next';
import { SessionProvider } from '@/components/SessionProvider';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
    title: '音声文字起こしアプリ',
    description: '音声を録音・アップロードして自動で文字起こしを行うアプリ',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                <SessionProvider>
                    <Header />
                    <main>{children}</main>
                </SessionProvider>
            </body>
        </html>
    );
}
