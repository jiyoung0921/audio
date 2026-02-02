import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { listDriveFolders, createDriveFolder } from '@/lib/google-apis';

// GET: List Drive folders
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const accessToken = (session as any).accessToken;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'アクセストークンがありません' },
                { status: 401 }
            );
        }

        const folders = await listDriveFolders(accessToken);

        return NextResponse.json({ success: true, folders });
    } catch (error: any) {
        console.error('List folders error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST: Create new folder
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, parentId } = await request.json();

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'フォルダ名が必要です' },
                { status: 400 }
            );
        }

        const accessToken = (session as any).accessToken;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'アクセストークンがありません' },
                { status: 401 }
            );
        }

        const folder = await createDriveFolder(name, parentId, accessToken);

        return NextResponse.json({ success: true, folder });
    } catch (error: any) {
        console.error('Create folder error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
