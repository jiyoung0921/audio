import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { promises as fs } from 'fs';
import path from 'path';

export async function generateDocx(
    transcriptionText: string,
    originalFilename: string
): Promise<string> {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: '音声文字起こし結果',
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            after: 400,
                        },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `元ファイル: ${originalFilename}`,
                                bold: true,
                            }),
                        ],
                        spacing: {
                            after: 200,
                        },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `作成日時: ${new Date().toLocaleString('ja-JP')}`,
                                italics: true,
                            }),
                        ],
                        spacing: {
                            after: 400,
                        },
                    }),
                    new Paragraph({
                        text: '文字起こし内容',
                        heading: HeadingLevel.HEADING_2,
                        spacing: {
                            before: 200,
                            after: 200,
                        },
                    }),
                    ...transcriptionText.split('\n').map(
                        (line) =>
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: line,
                                    }),
                                ],
                                spacing: {
                                    after: 100,
                                },
                            })
                    ),
                ],
            },
        ],
    });

    // Save to temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const filename = `transcription_${Date.now()}.docx`;
    const filepath = path.join(tempDir, filename);

    const { Packer } = await import('docx');
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(filepath, buffer);

    return filepath;
}
