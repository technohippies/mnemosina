import { FlashcardEdit } from '../components/FlashcardEdit';
import { Flashcard } from '../types/oldTypes'; // Ensure this path is correct

export default {
  title: 'Components/FlashcardEdit',
  component: FlashcardEdit,
};

const Template = (args) => <FlashcardEdit {...args} />;

export const Default = Template.bind({});
Default.args = {
  flashcard: {
    id: '1',
    moduleName: 'Module Name',
    videoName: 'Video Name',
    orderIndex: 1,
    sourceText: 'Source Text',
    sourceAudio: 'Source Audio URL',
    transliteration: 'Transliteration Text',
    targetText: 'Target Text',
    image: '', // No image by default
    frontTitle: '耿鬼',
    frontImage: '',
    backTitle: 'Gengar',
    backSubtitle: 'Back Subtitle',
    audio: 'Audio URL',
    review_date: new Date(),
    interval: 1,
    ease_factor: 2.5,
    learning_step: 1,
  },
  onSave: async (updatedFlashcard: Flashcard) => {
    console.log('Saving', updatedFlashcard);
  },
};

export const WithImage = Template.bind({});
WithImage.args = {
  ...Default.args,
  flashcard: {
    ...Default.args.flashcard,
    image: 'https://via.placeholder.com/150', // Example placeholder image
  },
};