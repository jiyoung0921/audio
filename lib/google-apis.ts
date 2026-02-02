import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';
import { promises as fs } from 'fs';

// Gemini 2.5 Flash for Audio Transcription
export async function transcribeAudio(audioFilePath: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Using Gemini 2.5 Flash for audio transcription
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    try {
        // Read audio file
        const audioData = await fs.readFile(audioFilePath);
        const base64Audio = audioData.toString('base64');

        // Determine MIME type based on file extension
        const ext = audioFilePath.toLowerCase().split('.').pop();
        let mimeType = 'audio/webm';
        if (ext === 'mp3') mimeType = 'audio/mp3';
        else if (ext === 'm4a') mimeType = 'audio/mp4';
        else if (ext === 'wav') mimeType = 'audio/wav';
        else if (ext === 'ogg') mimeType = 'audio/ogg';

        // Generate content with audio
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Audio,
                    mimeType: mimeType,
                },
            },
            '音声の内容を日本語で文字起こししてください。句読点を適切に付けて、読みやすい形式で出力してください。',
        ]);

        const response = await result.response;
        const transcription = response.text();

        if (!transcription) {
            throw new Error('文字起こし結果が空です');
        }

        return transcription;
    } catch (error) {
        console.error('Transcription error:', error);
        throw new Error('文字起こしに失敗しました');
    }
}

// Google Drive API
export async function uploadToDrive(
    filePath: string,
    filename: string,
    accessToken: string,
    folderId?: string
): Promise<{ fileId: string; webViewLink: string }> {
    const drive = google.drive({ version: 'v3' });

    const fileMetadata = {
        name: filename,
        parents: folderId
            ? [folderId]
            : process.env.GOOGLE_DRIVE_FOLDER_ID
                ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
                : undefined,
    };

    const media = {
        mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        body: await fs.readFile(filePath).then((buffer) => {
            const { Readable } = require('stream');
            return Readable.from(buffer);
        }),
    };

    try {
        const response = await drive.files.create(
            {
                requestBody: fileMetadata,
                media: media,
                fields: 'id, webViewLink',
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return {
            fileId: response.data.id!,
            webViewLink: response.data.webViewLink!,
        };
    } catch (error) {
        console.error('Google Drive upload error:', error);
        throw new Error('Google Driveへのアップロードに失敗しました');
    }
}

// List Drive Folders
export async function listDriveFolders(accessToken: string) {
    const drive = google.drive({ version: 'v3' });

    try {
        const response = await drive.files.list(
            {
                q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields: 'files(id, name, parents)',
                orderBy: 'name',
                pageSize: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.files || [];
    } catch (error) {
        console.error('List folders error:', error);
        throw new Error('フォルダ一覧の取得に失敗しました');
    }
}

// Create Drive Folder
export async function createDriveFolder(
    name: string,
    parentId: string | undefined,
    accessToken: string
) {
    const drive = google.drive({ version: 'v3' });

    const folderMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined,
    };

    try {
        const response = await drive.files.create(
            {
                requestBody: folderMetadata,
                fields: 'id, name',
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Create folder error:', error);
        throw new Error('フォルダの作成に失敗しました');
    }
}

// Rename Drive File
export async function renameDriveFile(
    fileId: string,
    newName: string,
    accessToken: string
) {
    const drive = google.drive({ version: 'v3' });

    try {
        const response = await drive.files.update(
            {
                fileId: fileId,
                requestBody: { name: newName },
                fields: 'id, name, webViewLink',
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Rename file error:', error);
        throw new Error('ファイル名の変更に失敗しました');
    }
}
