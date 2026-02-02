import Database from 'better-sqlite3';
import path from 'path';
import { HistoryItem } from '@/types';

const dbPath = path.join(process.cwd(), 'transcription.db');
let db: Database.Database | null = null;

function getDb(): Database.Database {
    if (!db) {
        db = new Database(dbPath);
        initializeDb(db);
    }
    return db;
}

function initializeDb(database: Database.Database) {
    database.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      fileType TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      transcriptionText TEXT NOT NULL,
      docxFileId TEXT NOT NULL,
      docxFileUrl TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      userId TEXT NOT NULL
    )
  `);
}

export function addHistoryItem(item: Omit<HistoryItem, 'id'>): number {
    const db = getDb();
    const stmt = db.prepare(`
    INSERT INTO history (
      filename, originalName, fileType, fileSize,
      transcriptionText, docxFileId, docxFileUrl,
      createdAt, userId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(
        item.filename,
        item.originalName,
        item.fileType,
        item.fileSize,
        item.transcriptionText,
        item.docxFileId,
        item.docxFileUrl,
        item.createdAt,
        item.userId
    );

    return result.lastInsertRowid as number;
}

export function getHistoryByUser(userId: string): HistoryItem[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM history WHERE userId = ? ORDER BY createdAt DESC');
    return stmt.all(userId) as HistoryItem[];
}

export function deleteHistoryItem(id: number, userId: string): boolean {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM history WHERE id = ? AND userId = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
}

export function updateHistoryFilename(id: number, userId: string, newFilename: string): boolean {
    const db = getDb();
    const stmt = db.prepare('UPDATE history SET filename = ? WHERE id = ? AND userId = ?');
    const result = stmt.run(newFilename, id, userId);
    return result.changes > 0;
}

export function closeDb() {
    if (db) {
        db.close();
        db = null;
    }
}
