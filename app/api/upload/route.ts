import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { promises as fs } from 'fs';
import path from 'path';
import { UploadResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'ファイルが見つかりません' }, { status: 400 });
        }

        // Create uploads directory
        const uploadsDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name}`;
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);

        return NextResponse.json({ success: true, filePath: filepath });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: 'ファイルのアップロードに失敗しました' },
            { status: 500 }
        );
    }
}
