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

async function updateSubtitlesImpression(videoId: string, start: number, end: number, baseSubtitle: string, translationSubtitle: string): Promise<void> {
    const subtitleKey = `${videoId}-${start}-${end}`;

    const db = await setupDatabase();
    const transaction = db.transaction('subtitles', 'readwrite');
    const store = transaction.objectStore('subtitles');

    let subtitleData = await store.get(subtitleKey);
    if (!subtitleData) {
        // Include both baseSubtitle and translationSubtitle in the new entry
        subtitleData = { subtitleKey, videoId, impressionCount: 0, baseSubtitle, translationSubtitle };
    }
    subtitleData.impressionCount += 1;
    await store.put(subtitleData);
    await transaction.done;
}

async function hasVideoBeenSeen(videoId: string): Promise<boolean> {
    const db = await setupDatabase();
    const transaction = db.transaction('subtitles', 'readonly');
    const store = transaction.objectStore('subtitles');
    const index = store.index('videoId');
    const count = await index.count(videoId);
    await transaction.done;
    return count > 0;
}

export { updateSubtitlesImpression, hasVideoBeenSeen };