export async function retrieveAllSignaturesAsJson() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('SignaturesDB');

        openRequest.onerror = () => {
            reject(new Error('Error opening IndexedDB.'));
        };

        openRequest.onupgradeneeded = (event) => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('signatures')) {
                db.createObjectStore('signatures');
            }
        };

        openRequest.onsuccess = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('signatures')) {
                reject(new Error('No study sessions on this device found'));
                return;
            }
            const transaction = db.transaction(['signatures'], 'readonly');
            const store = transaction.objectStore('signatures');
            const getAllRequest = store.getAll();

            getAllRequest.onerror = () => {
                reject(new Error('Error fetching signatures.'));
            };

            getAllRequest.onsuccess = () => {
                if (!getAllRequest.result) {
                    reject(new Error('No signatures found.'));
                    return;
                }
                const signatures = getAllRequest.result;
                resolve(JSON.stringify(signatures));
            };
        };
    });
}