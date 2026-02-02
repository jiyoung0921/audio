export interface HistoryItem {
    id: number;
    filename: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    transcriptionText: string;
    docxFileId: string;
    docxFileUrl: string;
    createdAt: string;
    userId: string;
}

export interface TranscriptionResult {
    text: string;
    confidence: number;
}

export interface UploadResponse {
    success: boolean;
    filePath?: string;
    error?: string;
}

export interface TranscribeResponse {
    success: boolean;
    transcription?: string;
    docxUrl?: string;
    historyId?: number;
    error?: string;
}

export interface HistoryResponse {
    success: boolean;
    items?: HistoryItem[];
    error?: string;
}

export interface DeleteResponse {
    success: boolean;
    error?: string;
}

export type ProcessingStep = 'upload' | 'transcribe' | 'docx' | 'drive' | 'complete' | 'error';

export interface ProcessingStatus {
    step: ProcessingStep;
    progress: number;
    message: string;
}

export interface ErrorDetail {
    code: string;
    message: string;
    stack?: string;
    timestamp: string;
}

export interface DriveFolder {
    id: string;
    name: string;
    parents?: string[];
}

export interface RenameRequest {
    historyId: number;
    newName: string;
    driveFileId: string;
}
