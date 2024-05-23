export async function retrieveFlashcardsAsJson() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('decksDB'); // Open the correct database

        openRequest.onerror = () => {
            reject('Error opening IndexedDB.');
        };

        openRequest.onsuccess = () => {
            const db = openRequest.result;
            const transaction = db.transaction(['decks'], 'readonly'); // Access the 'decks' object store
            const store = transaction.objectStore('decks');
            const getAllRequest = store.getAll(); // Fetch all decks

            getAllRequest.onerror = () => {
                reject('Error fetching decks.');
            };

            getAllRequest.onsuccess = () => {
                if (!getAllRequest.result || getAllRequest.result.length === 0) {
                    reject('No decks found.');
                    return;
                }
                // Assuming there's only one deck for simplification
                const deck = getAllRequest.result[0];

                // Assuming the flashcards are stored within the deck object under a 'flashcards' key
                const flashcards = deck.flashcards;

                // You can apply any necessary sorting or processing to the flashcards here
                // For example, sorting by 'reviewDate' and then by 'order'
                const sortedFlashcards = flashcards.sort((a, b) => {
                    const dateComparison = new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
                    if (dateComparison === 0) {
                        return a.order - b.order;
                    }
                    return dateComparison;
                });

                resolve(JSON.stringify(sortedFlashcards));
            };
        };
    });
}