import { Component, createSignal, createEffect } from 'solid-js';
import FlashcardInFeed from '../components/FlashcardInFeed';

// Mock data for the stories
const mockFlashcards = [
  {
    base_word: 'Hello',
    translation: {
      'en': 'Hello',
      'zh-CN': '你好',
    },
    image_cid: 'QmSomeHash'
  },
];

// Mock fetch function for Storybook
const fetchFlashcardsMock = () => Promise.resolve(mockFlashcards);

export default {
  title: 'Components/FlashcardInFeed',
  component: FlashcardInFeed,
};

const Template = (args: { displayMode: 'base' | 'translation'; userLanguage?: string; }) => {
  const [flashcards, setFlashcards] = createSignal([]);

  createEffect(() => {
    fetchFlashcardsMock().then(fetchedFlashcards => setFlashcards(fetchedFlashcards));
  });

  return <FlashcardInFeed {...args} flashcards={flashcards()} />;
};

export const BaseWord = Template.bind({});
BaseWord.args = {
  displayMode: 'base',
};

export const TranslationCN = Template.bind({});
TranslationCN.args = {
  displayMode: 'translation',
  userLanguage: 'zh-CN',
};