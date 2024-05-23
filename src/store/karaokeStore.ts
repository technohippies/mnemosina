import { createStore } from 'solid-js/store';

// Define the event emitter
function createEventEmitter() {
  let listeners: (() => void)[] = [];
  return {
    subscribe: (callback: () => void) => {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter(listener => listener !== callback);
      };
    },
    emit: () => {
      listeners.forEach(listener => listener());
    }
  };
}

// Create an instance of the event emitter for flashcard updates
const flashcardsUpdated = createEventEmitter();

// Create the store with an additional property for the event emitter
export const [karaokeStore, setKaraokeStore] = createStore({
  decks: [],
  activeDeckIndex: -1,
  isSayItBackMoment: false,
  videoPlaying: false,
  transcript: '',
  videoControlAction: '',
  flashcardsUpdated: flashcardsUpdated // This will not be reactive but can be used for subscriptions
});

// Export the emitter's methods for external use
export const subscribeToFlashcardUpdates = flashcardsUpdated.subscribe;
export const emitFlashcardUpdate = flashcardsUpdated.emit;