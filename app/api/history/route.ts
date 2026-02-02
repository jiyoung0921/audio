import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getHistoryByUser, deleteHistoryItem } from '@/lib/db';
import { HistoryResponse, DeleteResponse } from '@/types';

export async function GET(): Promise<NextResponse<HistoryResponse>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
        }

        const items = getHistoryByUser(session.user.email);
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error('History fetch error:', error);
        return NextResponse.json(
            { success: false, error: '履歴の取得に失敗しました' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<DeleteResponse>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'IDが必要です' }, { status: 400 });
        }

        const deleted = deleteHistoryItem(id, session.user.email);

        if (!deleted) {
            return NextResponse.json({ success: false, error: '削除に失敗しました' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('History delete error:', error);
        return NextResponse.json(
            { success: false, error: '履歴の削除に失敗しました' },
            { status: 500 }
        );
    }
}
