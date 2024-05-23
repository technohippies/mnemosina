import { Component } from 'solid-js';
import { TextInput } from './TextInput';
import { HiOutlinePaperAirplane } from 'solid-icons/hi'; // Ensure this is imported

interface TextInputWithButtonProps {
    placeholder: string;
    value: string;
    onInput: (e: Event) => void;
    onButtonClick: () => void;
    buttonText?: string; // Add this line
  }

export const TextInputWithButton: Component<TextInputWithButtonProps> = (props) => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            props.onButtonClick();
        }
    };

    return (
        <div class="flex items-center space-x-2">
            <TextInput 
                placeholder={props.placeholder} 
                value={props.value} 
                onInput={props.onInput}
                onKeyDown={handleKeyDown} // Pass the handler here
                class="rounded-l-lg rounded-r-none"
            />
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-r-lg border border-blue-500 hover:border-blue-700 flex items-center justify-center"
                onClick={props.onButtonClick}
                aria-label="Send" // Accessibility label for screen readers
            >
                <HiOutlinePaperAirplane class="w-6 h-6" /> {/* Using the icon instead of text */}
            </button>
        </div>
    );
};