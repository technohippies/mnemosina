import { openDB } from 'idb';

const DB_NAME = 'W3Storage';
const STORE_NAME = 'mnemosyneBackups';
const DB_VERSION = 1;

async function initDB() {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
    return db;
}

export async function addUpload(cid: string, name: string) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.add({ cid, name });
    await tx.done;
}

export async function getAllUploads() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const allUploads = await store.getAll();
    await tx.done;
    return allUploads;
}