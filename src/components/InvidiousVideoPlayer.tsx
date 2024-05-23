import { createSignal, onMount } from 'solid-js';
import { fetchVideoUrl } from '../utils/invidiousUtil';

interface InvidiousVideoPlayerProps {
    videoId: string;
}

const InvidiousVideoPlayer = (props: InvidiousVideoPlayerProps) => {
    const [videoUrl, setVideoUrl] = createSignal<string | null>(null);

    onMount(async () => {
        const url = await fetchVideoUrl(props.videoId);
        setVideoUrl(url);
    });

    return (
        <video controls src={videoUrl()} class="w-full">
            Your browser does not support the video tag.
        </video>
    );
};

export default InvidiousVideoPlayer;