import { createSignal, onCleanup } from 'solid-js';
import { RiMediaVolumeDownFill, RiMediaVolumeUpFill } from 'solid-icons/ri';
import 'tailwindcss/tailwind.css';

type AudioButtonProps = {
    audioSrc: string | undefined;
};

export const AudioButton = (props: AudioButtonProps) => {
    const [isPlaying, setIsPlaying] = createSignal(false);
    let audioRef: HTMLAudioElement | undefined;

    const togglePlay = () => {
        if (audioRef && props.audioSrc) { 
            if (audioRef.paused) {
                audioRef.play().catch((error) => {
                    console.error("Playback failed:", error);
                });
                setIsPlaying(true);
            } else {
                audioRef.pause();
                setIsPlaying(false);
            }
        }
    };

    if (audioRef) {
        const handleAudioEnd = () => setIsPlaying(false);
        audioRef.addEventListener('ended', handleAudioEnd);

        onCleanup(() => {
            audioRef.removeEventListener('ended', handleAudioEnd);
        });
    }

    return (
        <button
            class="rounded-full p-6 bg-gray-600 flex items-center justify-center focus:outline-none hover:bg-gray-700 active:shadow-inner text-white font-bold" 
            onClick={togglePlay}
        >
            {isPlaying() ? <RiMediaVolumeUpFill size={28} color="#ffffff" /> : <RiMediaVolumeDownFill size={28} color="#ffffff" />}
            <audio ref={el => (audioRef = el)} src={props.audioSrc} />
        </button>
    );
};

export default AudioButton;