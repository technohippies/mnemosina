import { Component } from 'solid-js';
import AudioRecorder from './AudioRecorder';

interface SimpleFooterProps {
    onTranscript: (transcript: string) => void;
    disabled: boolean;
}

const SimpleFooter: Component<SimpleFooterProps> = (props) => {
    return (
        <div class="fixed inset-x-0 bottom-0 z-20"> {/* Ensure it's always at the bottom and above other content */}
            <div class="text-white bg-gray-800">
                <img src="/images/avatar.png" class="absolute bottom-full mb-0 z-40 w-40 h-40" />
                <div class="flex justify-center items-end px-4 h-full">
                    <AudioRecorder onTranscript={props.onTranscript} disabled={props.disabled} />
                </div>
            </div>
        </div>
    );
};

export default SimpleFooter;