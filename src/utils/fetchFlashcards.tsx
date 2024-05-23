async function fetchFlashcards(): Promise<any[]> {
    console.log('fetchFlashcards started');
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MnemosinaDB');

        request.onerror = (event) => {
            // Access error from the request object directly
            console.error('Error opening database:', request.error);
            reject('Failed to open DB');
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            const db = request.result;
            const transaction = db.transaction(['flashcards'], 'readonly');
            const store = transaction.objectStore('flashcards');
            const getAllRequest = store.getAll();
            console.log('Fetching all flashcards from store');

            getAllRequest.onerror = (event) => {
                // Access error from the getAllRequest object directly
                console.error('Error fetching flashcards:', getAllRequest.error);
                reject('Failed to fetch flashcards');
            };

            getAllRequest.onsuccess = (event) => {
                console.log('Flashcards fetched successfully', getAllRequest.result);
                resolve(getAllRequest.result);
            };
        };

        request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded event triggered');
            const db = request.result;
            if (!db.objectStoreNames.contains('flashcards')) {
                console.log('Creating objectStore for flashcards');
                db.createObjectStore('flashcards', { keyPath: 'contentHash' });
            }
        };
    });
}

export { fetchFlashcards };