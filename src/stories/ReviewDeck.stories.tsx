import { Component } from 'solid-js';
import ReviewDeck from '../components/ReviewDeck';

export default {
  title: 'Components/ReviewDeck',
  component: ReviewDeck,
  argTypes: {
    newCount: { control: 'number' },
    learnCount: { control: 'number' },
    dueCount: { control: 'number' },
    isDeckFinished: { control: 'boolean' }, // Add control for isDeckFinished
    onStudyClick: { action: 'studyClicked' },
  },
};

const Template = (args) => <ReviewDeck {...args} />;

export const Default = Template.bind({});
Default.args = {
  newCount: 0,
  learnCount: 20,
  dueCount: 0,
  isDeckFinished: false, // Default state showing ongoing study session
  onStudyClick: () => console.log('Study clicked!'),
};

export const DeckCompleted = Template.bind({});
DeckCompleted.args = {
  ...Default.args,
  isDeckFinished: true, // State showing the deck is completed
};