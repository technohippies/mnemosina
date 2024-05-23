import { createEffect, onCleanup, createSignal, batch, Show, onMount } from 'solid-js';
import { unwrap } from "solid-js/store";
import { KaraokePlayerProps } from '../types/types';
import { calculateSimilarity } from '../utils/calculateSimilarity';
import { karaokeStore, setKaraokeStore } from '../store/karaokeStore';
import { predefinedMessages } from '../data/predefinedMessages';
import { HiSolidPlay } from 'solid-icons/hi'
import { storeFlashcard } from '../utils/storeFlashcard';
import { updateSubtitlesImpression } from '../utils/updateSubtitlesImpression';

const KaraokePlayer = ({ deck, index, onNextSlide, onShowMessage }: KaraokePlayerProps) => {
    const [videoRef, setVideoRef] = createSignal(null);
    const [currentSubtitle, setCurrentSubtitle] = createSignal('');
    const [baseSubtitle, setBaseSubtitle] = createSignal('');
    const [lastPausedIndex, setLastPausedIndex] = createSignal(-1);
    const [showMessage, setShowMessage] = createSignal(false);
    const [messageText, setMessageText] = createSignal('');
    const [hasVideoPlayed, setHasVideoPlayed] = createSignal(false);

    let subtitles = [];
    try {
        if (!deck.sections || !Array.isArray(deck.sections)) {
            throw new Error("Sections are undefined or not an array");
        }
        subtitles = deck.sections.flatMap(section =>
            section.lines ? section.lines.map(line => ({
                id: line.id,
                start: line.start,
                end: line.end,
                baseText: line.lineBase,
                userText: line.lineTranslation || line.lineBase,
                words: line.words,
            })) : []
        );
    } catch (error) {
        console.error("Error processing subtitles:", error);
        console.log("Deck structure:", deck);
    }

    onMount(() => {
        const startMessage = predefinedMessages.find(msg => msg.id === 6);
        if (startMessage) {
            onShowMessage?.({
                id: Date.now(),
                text: startMessage.text(),
                sender: 'bot',
            });
        }
    });

    createEffect(() => {
        const video = videoRef();
        let onNextSlideCalled = false;

        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const currentSubtitleIndex = subtitles.findIndex(sub => sub.start <= currentTime && sub.end >= currentTime);

            console.log(`Current Time: ${currentTime}`);
            console.log(`Current Subtitle Index: ${currentSubtitleIndex}`);

            if (currentSubtitleIndex !== -1 && lastPausedIndex() !== currentSubtitleIndex) {
                setBaseSubtitle(subtitles[currentSubtitleIndex].baseText);
                setCurrentSubtitle(subtitles[currentSubtitleIndex].userText);

                console.log(`Checking pause condition for subtitle: ${subtitles[currentSubtitleIndex].baseText}`);
                console.log(`Subtitle should end at: ${subtitles[currentSubtitleIndex].end}, currentTime: ${currentTime}`);

                // Adjusted pause condition to be more lenient
                if (currentTime >= subtitles[currentSubtitleIndex].end - 0.5 && !video.paused) {
                    console.log(`Pause condition met. Attempting to pause at: ${currentTime}`);
                    if (subtitles[currentSubtitleIndex].pauseAt !== false) {
                        batch(() => {
                            setKaraokeStore('isSayItBackMoment', true);
                            setKaraokeStore('videoPlaying', false);
                        });
                        video.pause();
                        setLastPausedIndex(currentSubtitleIndex);
                        console.log('Video paused successfully.');
                        updateSubtitlesImpression(deck.videoId, subtitles[currentSubtitleIndex].start, subtitles[currentSubtitleIndex].end, subtitles[currentSubtitleIndex].baseText, subtitles[currentSubtitleIndex].userText)
                            .then(() => console.log('Subtitle impression updated'))
                            .catch(error => console.error('Failed to update subtitle impression:', error));
                    } else {
                        console.log(`Pausing is disabled for this subtitle.`);
                    }
                } else {
                    console.log('Pause condition not met.');
                }
            } else if (currentSubtitleIndex === -1 && subtitles.length > 0 && currentTime >= subtitles[subtitles.length - 1].end && !onNextSlideCalled) {
                console.log(`No active subtitles. Moving to next slide.`);
                onNextSlide();
                onNextSlideCalled = true;
            }
        };

        const handleAnimationFrame = () => {
            handleTimeUpdate();
            if (karaokeStore.videoPlaying) {
                requestAnimationFrame(handleAnimationFrame);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        requestAnimationFrame(handleAnimationFrame);

        onCleanup(() => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        });
    });
    

    createEffect(() => {
        const video = videoRef();
        if (!video) return;

        // Control video play based on hasVideoPlayed signal
        if (hasVideoPlayed()) {
            video.play();
        } else {
            video.pause();
        }
    });

    createEffect(() => {
        if (karaokeStore.isSayItBackMoment && index() === karaokeStore.activeDeckIndex) {
            const sayItBackMessage = predefinedMessages.find(msg => msg.id === 5);
            if (sayItBackMessage) {
                const messageText = sayItBackMessage.text(); // Call the function to get the translated text
                setMessageText(messageText);
                setShowMessage(true);

                onShowMessage?.({
                    id: Date.now(),
                    text: messageText,
                    sender: 'bot',
                });
            }
        }
    });

    createEffect(() => {
        if (karaokeStore.isSayItBackMoment && index() === karaokeStore.activeDeckIndex && karaokeStore.transcript !== '') {
            const similarity = calculateSimilarity(karaokeStore.transcript, baseSubtitle());
            console.log(`Similarity between '${karaokeStore.transcript}' and base subtitle '${baseSubtitle()}': ${similarity}`);
            let messageDetails = null;
            if (similarity > 30) {
                console.log("Similarity > 30, continuing video playback.");
                batch(() => {
                    setKaraokeStore('isSayItBackMoment', false);
                    setKaraokeStore('videoPlaying', true);
                    setKaraokeStore('transcript', ''); // Clear the transcript after processing
                    messageDetails = predefinedMessages.find(msg => msg.id === 1); // Correct response message
                    videoRef().play(); // Resume video playback
    
                    console.log("Deck sections (raw):", JSON.parse(JSON.stringify(deck.sections))); // Attempt to log raw data
    
                    // Find the current line based on the baseSubtitle
                    const currentLine = deck.sections.flatMap(section => section.lines)
                        .find(line => line.lineBase === baseSubtitle());
    
                    if (currentLine) {
                        console.log("Current line details:", currentLine);
                        storeFlashcard(currentLine).then(() => {
                            console.log("Flashcard storage successful.");
                        }).catch(error => {
                            console.error("Error storing flashcards:", error);
                        });
                    } else {
                        console.error("No matching line found for the base subtitle.");
                    }
                });
            } else {
                console.log("Similarity <= 30, not resuming video playback.");
                messageDetails = predefinedMessages.find(msg => msg.id === 3); // Incorrect response message
                setKaraokeStore('transcript', '');
                setShowMessage(false); // Reset showMessage state before setting it to true again
            }
    
            if (messageDetails && messageDetails.text) {
                setMessageText(messageDetails.text);
                setShowMessage(true);
                onShowMessage?.({
                    id: Date.now(), // Correct usage of Date.now() to get the current timestamp
                    text: messageDetails.text,
                    sender: 'bot',
                });
            }
        }
    });
    

    return (
        <div class="justify-center text-center">
            <div class="subtitle text-2xl text-white min-h-16 mb-16 px-6">
                <div class="mb-6">{baseSubtitle()}</div> 
                <div>{currentSubtitle()}</div>
            </div>
            <Show when={index() === 0 && !hasVideoPlayed()}>
                <div class="flex justify-center items-end absolute inset-x-0 bottom-32 mb-8"> {/* Centering the button near the bottom */}
                    <button class="bg-rose-500 rounded-full p-6" onClick={() => { videoRef().play(); setHasVideoPlayed(true); setShowMessage(false); }}>
                        <HiSolidPlay class="text-white h-12 w-12" />
                    </button>
                </div>
            </Show>
            <video ref={setVideoRef} controls src={deck.source} class="invisible h-6" />
        </div>
    );
};

export default KaraokePlayer;
