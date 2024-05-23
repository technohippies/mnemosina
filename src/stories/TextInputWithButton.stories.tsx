import { TextInputWithButton } from '../components/TextInputWithButton';

const meta = {
    title: 'Primitives/TextInputWithButton',
    component: TextInputWithButton,
    // Add any argTypes if needed for specific controls
};

export default meta;

export const Default = {
    args: {
        placeholder: 'Enter text...',
        buttonText: 'Send',
        onButtonClick: () => alert('Button clicked!'),
    },
};