import { UnifiedItem } from '../types/types';

export function sortFeedItems(items: UnifiedItem[], customStudy: boolean = false): UnifiedItem[] {
    console.log('sort called, customStudy:', customStudy);

    // Filter out items not due for review if they are flashcards, unless it's a custom study
    const dueItems = items.filter(item => {
        if (!customStudy && item.type === 'flashcard' && item.data.reviewDate) {
            return new Date(item.data.reviewDate) <= new Date();
        }
        return true; // Keep all items if custom study or if they are karaoke decks
    });

    // Sort items based on the SuperMemo2-like algorithm for flashcards
    // Karaoke decks are sorted by impression count, ensuring those with fewer impressions are seen first
    dueItems.sort((a, b) => {
        if (a.type === 'flashcard' && b.type === 'flashcard') {
            // Calculate priority based on interval and easeFactor for flashcards
            const priorityA = a.data.interval * a.data.easeFactor;
            const priorityB = b.data.interval * b.data.easeFactor;
            return priorityA - priorityB;
        } else if (a.type === 'karaokeDeck' && b.type === 'karaokeDeck') {
            // Sort karaoke decks by impression count, ascending
            return a.data.impressionCount - b.data.impressionCount;
        } else {
            // Mixed types: default to sorting by type first to group items
            return a.type.localeCompare(b.type);
        }
    });

    return dueItems;
}