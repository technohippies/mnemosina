import { Component, createSignal, onCleanup } from 'solid-js';
import { TextInput } from './TextInput';
import { HiOutlinePaperAirplane, HiSolidMicrophone, HiSolidStop } from 'solid-icons/hi';
import { sendAudioForTranscription } from '../utils/audioTranscription';

interface TextInputWithVoiceProps {
    placeholder?: string;
    value?: string;
    onInput?: (value: string) => void;
    onSend: (value: string) => void;
    onKaraokeMoment?: (transcript: string) => void;
    isKaraokeMoment?: () => boolean;
    setIsProcessing?: (isProcessing: boolean) => void;
    keywords?: string[]; // Renamed prop for more general use
}

export const TextInputWithVoice: Component<TextInputWithVoiceProps> = (props) => {
    const [isRecording, setIsRecording] = createSignal(false);
    const [inputValue, setInputValue] = createSignal(props.value || '');
    const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = createSignal<Blob[]>([]);

    const cloudflareWorkerEndpoint = 'https://dpgrm.tht3ch.workers.dev';

    const handleAudioRecorded = async (audioBlob: Blob) => {
        await sendAudioForTranscription({
            audioBlob,
            subtitles: props.keywords, // Use the renamed prop
            setIsProcessing: props.setIsProcessing,
            cloudflareWorkerEndpoint,
            onSuccess: (transcript) => {
                if (props.isKaraokeMoment?.()) {
                    console.log('Processing karaoke response...');
                    props.onKaraokeMoment?.(transcript);
                } else {
                    console.log('Handling as a regular message...');
                    props.onSend(transcript);
                }
            },
            onError: (error) => {
                console.error('Error processing audio transcription', error);
            },
        });
    };

    const visualizeAudio = (analyser) => {
        const canvas = document.getElementById('audioVisualizer') as HTMLCanvasElement;

        const canvasContext = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = () => {
            if (!isRecording()) return; // Stop drawing if not recording

            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            canvasContext.fillStyle = 'rgb(255, 255, 255)';
            canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'rgb(0, 0, 0)';
            canvasContext.beginPath();

            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();
        };

        draw();
    };

    const startRecording = async () => {
        if (isRecording()) {
            console.log('Already recording.');
            return;
        }
        console.log('Attempting to start recording...');
        setAudioChunks([]);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted.');

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            // Optional: Configure the analyser if needed, e.g., analyser.fftSize = 2048;

            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioChunks((prev) => [...prev, event.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

            // Start visualizing
            visualizeAudio(analyser);
        } catch (error) {
            console.error('Error accessing the microphone', error);
        }
    };

    const stopRecording = () => {
        if (!isRecording()) {
            console.log('Not recording.');
            return;
        }
        console.log('Stopping recording...');
        mediaRecorder()?.stop();
        setIsRecording(false);
        mediaRecorder()?.stream.getTracks().forEach(track => track.stop());
        console.log('Recording stopped. Preparing to send data...');
        setTimeout(async () => {
            const mimeType = 'audio/webm';
            const audioBlob = new Blob(audioChunks(), { type: mimeType });
            await handleAudioRecorded(audioBlob); // Call the internal function directly
            setAudioChunks([]);
        }, 1000);
    };

    const handleIconClick = () => {
        if (isRecording()) {
            stopRecording();
        } else {
            // If there's text input, send it; otherwise, start recording
            if (inputValue().trim()) {
                // Call the onSend prop with the current text input value
                props.onSend(inputValue().trim());
                // Clear the input field after sending
                setInputValue('');
            } else {
                // No text input, start recording
                startRecording();
            }
        }
    };

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newValue = target.value;
        setInputValue(newValue); // Update local state
        props.onInput?.(newValue); // Notify parent component
    };

    onCleanup(() => {
        if (isRecording()) {
            stopRecording();
        }
    });

    return (
        <div class="flex items-center space-x-2">
            {!isRecording() && (
                <TextInput
                    placeholder={props.placeholder}
                    value={inputValue()}
                    onInput={handleInput}
                    class="rounded-l-lg rounded-r-none"
                />
            )}
            {isRecording() && (
                <canvas id="audioVisualizer" class="w-full h-10 rounded-l-lg"></canvas> // Visualizer canvas
            )}
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-r-lg border border-blue-500 hover:border-blue-700 flex items-center justify-center"
                onClick={handleIconClick}
                aria-label={isRecording() ? "Stop recording" : "Send message or start recording"}
            >
                {isRecording() ? <HiSolidStop class="w-6 h-6" /> : (inputValue().trim() && !isRecording() ? <HiOutlinePaperAirplane class="w-6 h-6" /> : <HiSolidMicrophone class="w-6 h-6" />)}
            </button>
        </div>
    );
};