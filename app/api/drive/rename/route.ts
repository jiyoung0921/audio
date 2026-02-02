import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { renameDriveFile } from '@/lib/google-apis';
import { updateHistoryFilename } from '@/lib/db';

// PATCH: Rename file in Drive and update history
export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { historyId, newName, driveFileId } = await request.json();

        if (!historyId || !newName || !driveFileId) {
            return NextResponse.json(
                { success: false, error: '必要なパラメータが不足しています' },
                { status: 400 }
            );
        }

        const accessToken = (session as any).accessToken;
        const userId = session.user.email!;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'アクセストークンがありません' },
                { status: 401 }
            );
        }

        // Rename in Google Drive
        const updatedFile = await renameDriveFile(driveFileId, newName + '.docx', accessToken);

        // Update history in database
        const updated = updateHistoryFilename(historyId, userId, newName);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: '履歴の更新に失敗しました' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            file: updatedFile,
        });
    } catch (error: any) {
        console.error('Rename error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
