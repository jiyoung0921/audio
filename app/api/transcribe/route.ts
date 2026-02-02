import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { transcribeAudio, uploadToDrive } from '@/lib/google-apis';
import { generateDocx } from '@/lib/docx-generator';
import { addHistoryItem } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import { TranscribeResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<TranscribeResponse>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
        }

        const { filePath, originalName, fileType, fileSize, folderId } = await request.json();

        if (!filePath) {
            return NextResponse.json({ success: false, error: 'ファイルパスが必要です' }, { status: 400 });
        }

        // Transcribe audio
        const transcription = await transcribeAudio(filePath);

        if (!transcription) {
            return NextResponse.json({ success: false, error: '文字起こし結果が空です' }, { status: 400 });
        }

        // Generate DOCX
        const docxPath = await generateDocx(transcription, originalName);

        // Upload to Google Drive
        const accessToken = (session as any).accessToken;
        const { fileId, webViewLink } = await uploadToDrive(
            docxPath,
            `transcription_${path.basename(originalName, path.extname(originalName))}.docx`,
            accessToken,
            folderId || undefined
        );

        // Save to history
        const historyId = addHistoryItem({
            filename: path.basename(filePath),
            originalName,
            fileType,
            fileSize,
            transcriptionText: transcription,
            docxFileId: fileId,
            docxFileUrl: webViewLink,
            createdAt: new Date().toISOString(),
            userId: session.user.email,
        });

        // Clean up temp files
        await fs.unlink(filePath).catch(() => { });
        await fs.unlink(docxPath).catch(() => { });

        return NextResponse.json({
            success: true,
            transcription,
            docxUrl: webViewLink,
            historyId,
        });
    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { success: false, error: '文字起こし処理に失敗しました' },
            { status: 500 }
        );
    }
}
