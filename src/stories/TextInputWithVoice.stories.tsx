import { Meta, StoryObj } from 'storybook-solidjs';
import { TextInputWithVoice } from '../components/TextInputWithVoice';

export default {
    title: 'Components/TextInputWithVoice',
    component: TextInputWithVoice,
} as Meta<typeof TextInputWithVoice>;

export const Default: StoryObj<typeof TextInputWithVoice> = {
    args: {
        placeholder: 'Type a message or record voice',
        value: '',
        onInput: (e: Event) => console.log('Input:', e),
        onSend: (value: string) => console.log('Send:', value),
        onAudioRecorded: (audioBlob: Blob) => console.log('Audio Recorded:', audioBlob),
    },
};