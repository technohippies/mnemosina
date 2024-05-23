import { Meta, StoryObj } from 'storybook-solidjs';
import AudioButton from '../components/AudioButton';

export default {
    title: 'Primitives/AudioButton',
    component: AudioButton,
} as Meta<typeof AudioButton>;

export const Default: StoryObj<typeof AudioButton> = {
    args: {
        audioSrc: '../audio/clefairy.mp3',
    },

};