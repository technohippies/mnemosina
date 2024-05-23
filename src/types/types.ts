import { ChatMessage as ChatMessageType } from './ChatMessageType';

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

export interface Word {
  baseWord: string;
  translationWord: string | { [key: string]: string }; // Allow both string and object types
  start?: number;
  end?: number;
  ttsCid?: {
    [key: string]: string; // Supports multiple languages for TTS audio
  };
  imageCid?: string;
}

export interface Line {
  id: string;
  lineBase: string;
  lineTranslation?: string;
  imagePath?: string;
  start: number;
  end: number;
  words: Word[];
}

export interface Section {
  sectionTitle: {
    [key: string]: string; // Supports multiple languages
  };
  lines: Line[];
}

export interface Deck {
  videoId: string;
  source: string;
  deckTitle: {
    [key: string]: string; // Supports multiple languages
  };
  deckArtist: string;
  sections: Section[];
  impressionCount?: number;
}

export interface KaraokePlayerProps {
  deck: Deck;
  index: () => number;
  onNextSlide: () => void;
  onShowMessage?: (message: ChatMessageType) => void;
  userLanguage: string;
}

export interface StoreState {
  transcript: string;
  isSayItBackMoment: boolean;
  activeDeckIndex: number;
  decks: Deck[];
  flashcardsUpdated: {
    subscribe: (callback: () => void) => () => void; // Subscription method with a callback
  };
}

export interface FlashcardInFeedProps {
  flashcard: Line;  // Using the Line interface directly
  displayMode: 'base' | 'translation';
  userLanguage?: string;
  transcript?: string;
  onShowMessage?: (message: ChatMessageType) => void;
  isActive: (index: number) => boolean;
  index: number;
  onNextSlide: () => void; 
}

export type UnifiedItemType = 'karaokeDeck' | 'signUp' | 'flashcardsDue' | 'flashcard';

export interface UnifiedItem {
  type: UnifiedItemType;
  data: any; // This could be more specific based on the type, e.g., KaraokeDeck | SignUpInfo | FlashcardsDueInfo
  sortOrder: number; // Used for sorting/reordering
}