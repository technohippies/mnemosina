import { Component } from 'solid-js';

interface TextInputProps {
    placeholder?: string;
    value?: string;
    onInput?: (e: Event) => void;
    onEnterPress?: () => void; // For handling Enter key press
    onKeyDown?: (e: KeyboardEvent) => void; // Add this line to include onKeyDown
    class?: string;
}

export const TextInput: Component<TextInputProps> = (props) => {
    const inputClass = `w-full p-4 border border-solid rounded-lg focus:outline-none text-black ${props.class ?? ''}`;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default Enter key action
            props.onEnterPress?.(); // Call the onEnterPress prop function if provided
        }
        // Call the original onKeyDown prop function if provided
        props.onKeyDown?.(e);
    };

    return (
        <input
            type="text"
            class={inputClass}
            placeholder={props.placeholder}
            value={props.value}
            onInput={props.onInput}
            onKeyDown={handleKeyDown} // Use the modified handleKeyDown function
        />
    );
};