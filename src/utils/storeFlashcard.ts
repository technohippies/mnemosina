import { Word, Line } from '../types/types';
import { emitFlashcardUpdate } from '../store/karaokeStore';
const STORE_NAME = 'flashcards'; 

async function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('MnemosinaDB', 1);

        request.onupgradeneeded = event => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Update the keyPath to 'id' to match the property used in your data objects
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

                store.createIndex('reviewDate', 'reviewDate');
            }
        };

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function generateCompositeKey(baseWord: string, translationWord: string): string {
    return `${baseWord}|${translationWord}`;
}

async function storeFlashcard(line: Line): Promise<void> {
    console.log('Storing new line for initial learning');
    console.log('Line ID:', line.id); // Log the ID to verify it's being passed correctly

    if (typeof line.id === 'undefined') {
        console.error('Error: Line ID is undefined.');
        return; // Exit the function if id is undefined
    }

    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
            console.log('New line stored successfully.');
            emitFlashcardUpdate();  
            resolve();
        };
        transaction.onerror = () => {
            console.error('Transaction failed:', transaction.error);
            reject(transaction.error);
        };

        const lineToStore = {
            lineBase: line.lineBase,
            lineTranslation: line.lineTranslation,
            start: line.start,
            end: line.end,
            reviewDate: new Date().toISOString(),
            interval: 0,
            easeFactor: 2.3,
            learningStep: 1,
            id: line.id
        };

        console.log('Line to store:', lineToStore);

        store.put(lineToStore).onsuccess = () => {
            console.log('Put operation successful');
        };
        store.put(lineToStore).onerror = (event) => {
            console.error('Error in put operation:', event.target);
        };
    });
}

async function updateFlashcard(line: Line, correct: boolean): Promise<void> {
    console.log("Opening database for update...");
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const key = line.id; // Use line ID as the key
    console.log(`Generated key for update: ${key}`);

    return new Promise<void>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
            const data = request.result;
            if (data) {
                console.log("Flashcard found, updating...", data);
                if (correct) {
                    data.interval = Math.max(1, data.interval * data.easeFactor); // Increase interval
                    data.easeFactor = Math.min(2.5, data.easeFactor + 0.1); // Adjust ease factor slightly
                } else {
                    data.interval = Math.max(1, data.interval * 0.5); // Decrease interval
                    data.easeFactor = Math.max(1.3, data.easeFactor - 0.2); // Decrease ease factor
                }
                data.reviewDate = new Date(Date.now() + data.interval * 86400000).toISOString(); // Calculate next review date
                console.log("Updated flashcard data:", data);

                store.put(data); // Save the updated flashcard
                transaction.oncomplete = () => {
                    emitFlashcardUpdate();  // Notify subscribers that flashcards have been updated
                    resolve();
                };
                transaction.onerror = () => {
                    reject(transaction.error);
                };
            } else {
                console.error('Flashcard not found in database.');
                reject('Flashcard not found');
            }
        };
        request.onerror = () => {
            console.error("Error fetching flashcard for update:", request.error);
            reject(request.error);
        };
    });
}

async function countDueFlashcards(): Promise<number> {
    // console.log("Opening database to count due flashcards...");
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('reviewDate'); // Ensure this index is created during database setup

    const now = new Date().toISOString();
    // console.log("Current time (ISO):", now);

    const range = IDBKeyRange.upperBound(now);
    const request = index.count(range);

    return new Promise<number>((resolve, reject) => {
        request.onsuccess = () => {
            // console.log("Count of due flashcards:", request.result);
            resolve(request.result);
        };
        request.onerror = () => {
            // console.error("Error counting due flashcards:", request.error);
            reject(request.error);
        };
    });
}

export { storeFlashcard, updateFlashcard, countDueFlashcards };