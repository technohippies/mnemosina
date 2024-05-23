export interface User {
  did: string;
  username?: string;
  nativeLanguage: string;
  targetLanguages: string[];
  signUpDate: number;
}

export interface Streak {
  did: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: number;
}

export interface Word {
  baseWord: string;
  translations: {
    en: string;
    "zh-CN"?: string;
    ja?: string;
    ko?: string;
  };
  partOfSpeech?: string;
  audioSourceCid?: string;
  imageCid?: string;
  ttsCidEn?: string;
  start: number;
  end: number;
}

export interface Line {
  lineBase: string;
  lineTranslation?: string;
  words: Word[];
  start: number;
  end: number;
}

export interface Annotations {
en: string;
"zh-CN"?: string;
"ja"?: string;
"ko"?: string;
}

export interface Section {
  sectionTitleBase: string;
  sectionTitleTranslation?: string;
  backgroundImageCid?: string;
  lines: Line[];
}

export interface Subtitle {
  id: number;
  start: number;
  end: number;
  baseText: string;
  section: string;
  userLangText: string;
}

export interface Flashcard {
  contentHash?: string;
  frontText?: string; 
  frontSubtext?: string; 
  frontImage?: string; 
  backText?: string; 
  backSubtext?: string; 
  backImage?: string;
  sourceAudio?: string;
  ttsAudio1?: string; 
  reviewDate: Date; 
  interval: number; 
  easeFactor: number;
  learningStep: number;
  order?: number; 
}

export interface DeckData {
  schemaVersion: string;
  videoId: string;
  platform: string;
  baseLanguage: string;
  translationLanguage: string;
  deck: {
    deckTitleBase: string;
    deckTitleTranslation?: string;
    deckArtist: string;
    backgroundImageCid?: string;
    sections: Section[];
  };
}

export interface Video {
  video_cid: string;
  video_thumb: string;
  video_length_secs: number;
  flashcards: Flashcard[]; 
}

export interface FlashcardContainer {
  level_1?: Flashcard[];
  level_2?: Flashcard[];
  level_3?: Flashcard[];
  level_4?: Flashcard[];
}

export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}