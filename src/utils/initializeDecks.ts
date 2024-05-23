import { fetchVideoUrl } from './invidiousUtil';
import { loadJsonFromIPFSorIPNSPath } from './loadFromIPFSorIPNS';
import { setKaraokeStore } from '../store/karaokeStore';
import { fetchImpressionCount } from './fetchImpressionCount'; // Import the utility function

export async function initializeDecks(decksData, userLanguage) {
    console.log('initializeDecks called with decksData:', decksData, 'userLanguage:', userLanguage);
    const decks = await Promise.all(decksData.map(async (deck) => {
        let videoUrl = '';
        try {
            videoUrl = await fetchVideoUrl(deck.videoId);
        } catch (error) {
            console.error("Error fetching video URL:", error);
        }

        let deckSubtitles = {};
        try {
            if (deck.subtitles && deck.subtitles[userLanguage]) {
                const subtitlesCID = deck.subtitles[userLanguage];
                const subtitlesData = await loadJsonFromIPFSorIPNSPath(subtitlesCID);
                console.log("Fetched subtitles data:", subtitlesData);

                // Directly use the fetched subtitles data
                deckSubtitles = subtitlesData.deck;
            }
        } catch (error) {
            console.error("Error fetching subtitles:", error);
        }

        // Fetch impression count
        const impressionCount = await fetchImpressionCount(deck.videoId);

        // Return the deck with the video URL, subtitles data, and impression count added
        return {
            ...deck,
            source: videoUrl,
            ...deckSubtitles, // Merge the entire subtitles data into the deck object
            impressionCount // Add the fetched impression count
        };
    }));

    setKaraokeStore("decks", decks);
}