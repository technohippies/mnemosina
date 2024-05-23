import { openDB } from 'idb';

async function setupDatabase() {
    const db = await openDB('SubtitlesDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('subtitles')) {
                const store = db.createObjectStore('subtitles', { keyPath: 'subtitleKey' });
                store.createIndex('videoId', 'videoId', { unique: false });
            }
        },
    });
    return db;
}

export async function fetchImpressionCount(videoId: string): Promise<number> {
    const db = await setupDatabase();
    const transaction = db.transaction('subtitles', 'readonly');
    const store = transaction.objectStore('subtitles');
    const index = store.index('videoId');
    const count = await index.count(videoId);
    await transaction.done;
    return count;
}