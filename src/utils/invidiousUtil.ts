// async function fetchVideoUrl(videoId: string): Promise<string | null> {
//     // Assuming you have a local video file you want to use as a fallback
//     const localVideoUrl = '/videos/Formation (1080p_25fps_H264-128kbit_AAC).mp4';

//     return localVideoUrl; // Return the local video URL directly
// }

// export { fetchVideoUrl };


async function fetchVideoUrl(videoId: string): Promise<string | null> {
    const invidiousInstances = [
        'https://iv.ggtyler.dev',
        'https://invidious.lunar.icu',
        'https://invidious.fdn.fr',
        'https://vid.puffyan.us',
        'https://invidious.nerdvpn.de',
        'https://invidious.lunar.icu',
        'https://inv.tux.pizza'
    ];

    for (const invidiousInstance of invidiousInstances) {
        const apiUrl = `${invidiousInstance}/api/v1/videos/${videoId}?local=true`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error(`Failed to fetch video details from ${invidiousInstance}. Status: ${response.status} ${response.statusText}`);
                continue; // Try the next instance
            }
            const data = await response.json();

            // First, try to find a video URL in formatStreams
            let videoStream = data.formatStreams?.find((stream: any) => stream.url);

            // If not found in formatStreams, try adaptiveFormats
            if (!videoStream) {
                videoStream = data.adaptiveFormats?.find((format: any) => format.url);
            }

            if (!videoStream) {
                console.error(`Video stream URL not found in response from ${invidiousInstance}:`, data);
                continue; // Try the next instance
            }

            return videoStream.url; // Successfully found a video URL
        } catch (error) {
            console.error(`Error fetching video URL from ${invidiousInstance}:`, error);
            // Continue to the next instance
        }
    }

    console.error('All invidious instances failed.');
    return null; // All instances failed
}

export { fetchVideoUrl };