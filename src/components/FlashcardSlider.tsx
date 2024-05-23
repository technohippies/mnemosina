import { createSignal, For, onMount, Show, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { batch } from 'solid-js';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';
import { fetchFlashcards } from '../utils/fetchFlashcards';
import { sortFeedItems } from '../utils/sortFeedItems';
import FlashcardInFeed from './FlashcardInFeed';
import { karaokeStore, setKaraokeStore } from '../store/karaokeStore';
import { setChatStore } from '../store/chatStore';
import ChatMessage from '../components/ChatMessage';
import { ChatMessage as ChatMessageType } from '../types/ChatMessageType';
import ProgressBar from '../components/ProgressBar';
import { HiSolidXMark } from 'solid-icons/hi';
import { useNavigate, useSearchParams } from '@solidjs/router';
import SimpleFooter from './SimpleFooter';

function FlashcardSlider() {
    let slider: KeenSliderInstance | null = null;
    let sliderContainer: HTMLDivElement | undefined;
    const [feedItems, setFeedItems] = createSignal([]);
    const [showChatMessage, setShowChatMessage] = createSignal(false);
    const [chatMessage, setChatMessage] = createSignal<ChatMessageType | null>(null);
    const [activeIndex, setActiveIndex] = createSignal(0);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [customStudy, setCustomStudy] = createSignal(searchParams.custom === 'true');

    createEffect(() => {
        setCustomStudy(searchParams.custom === 'true');
        console.log('Custom Study Mode updated:', customStudy());
    })
    
    const isActive = (index: number) => {
        const active = activeIndex() === index;
        console.log(`isActive check for index ${index}: ${active}, current activeIndex: ${activeIndex()}`);
        return active;
    };

    const determineDisplayMode = (flashcard) => {
        return flashcard.learningStep > 2 ? 'translation' : 'base';
    };

    const initializeSlider = () => {
        if (sliderContainer) {
            slider = new KeenSlider(sliderContainer, {
                mode: "snap",
                slides: { perView: 'auto' },
                vertical: true,
                loop: false,
                rubberband: false,
                slideChanged: s => {
                    const newActiveDeckIndex = s.track.details.rel;
                    console.log(`Slide changed to index ${newActiveDeckIndex}`);
                    batch(() => {
                        setActiveIndex(newActiveDeckIndex);
                        setKaraokeStore('activeDeckIndex', newActiveDeckIndex);
                        setKaraokeStore('isSayItBackMoment', false);
                        handleSwipe();
                    });

                    // if (newActiveDeckIndex === feedItems().length - 1) {
                    //     console.log('Last slide reached, navigating to save.');
                    //     navigate('/save');
                    // }
                }
            });

            console.log('Slider initialized:', slider);
        } else {
            console.log('Slider container not found');
        }
    };

    const handleSwipe = () => {
        setChatMessage(null);
        setShowChatMessage(false);
    };

    const handleShowMessage = (message: ChatMessageType) => {
        setChatStore('messages', (messages) => [...messages, message]);
        setChatMessage(message);
        setShowChatMessage(true);
    };

    const handleTranscript = (transcript: string) => {
        batch(() => {
            setKaraokeStore('transcript', transcript);
            setChatStore('messages', (messages) => [...messages, { id: Date.now(), text: transcript, sender: 'user' }]);
    
            // Assuming the audio recorder will call this function if the answer is correct
            checkIfLastCardAndNavigate();
        });
    };
    
    const checkIfLastCardAndNavigate = () => {
        const isLastCard = activeIndex() === feedItems().length - 1;
        if (isLastCard) {
            console.log('Last flashcard processed, navigating to save.');
            navigate('/save');
        }
    };

    onMount(async () => {
        const isCustomStudy = searchParams.custom === 'true';
        setCustomStudy(isCustomStudy);

        const flashcards = await fetchFlashcards();
        console.log('Fetched flashcards:', flashcards); // Log to verify structure

        let sortedItems = sortFeedItems(flashcards.map((flashcard) => ({
            type: 'flashcard',
            data: { ...flashcard, displayMode: determineDisplayMode(flashcard) },
            sortOrder: flashcard.reviewDate
        })), isCustomStudy);

        console.log('Sorted items:', sortedItems); // Log to verify data before setting
        setFeedItems(sortedItems);
        initializeSlider();
    });
    createEffect(() => {
        console.log('Current active index:', activeIndex() + 1);
        console.log('Total number of feed items:', feedItems().length);
    });


    return (
        <div>
            <div class="flex items-center w-full p-4">
                <button onClick={() => navigate('/decks')} class="close-btn mr-4 text-3xl"><HiSolidXMark /></button>
                <div class="flex-grow">
                    <ProgressBar value={activeIndex()} max={feedItems().length} />
                </div>
            </div>
            <div ref={el => sliderContainer = el} class="keen-slider h-screen">
                <For each={feedItems()}>
                    {(item, index) => {
                        console.log(`Rendering FlashcardInFeed at index ${index()}`, item);
                        return (
                            <div class="keen-slider__slide">
                                <FlashcardInFeed
                                    flashcard={item.data}
                                    index={index()}
                                    displayMode={item.data.displayMode}
                                    isActive={isActive}
                                    onShowMessage={handleShowMessage}
                                    onNextSlide={() => {
                                        if (slider) {
                                            console.log(`Moving to next slide from index ${index()}`);
                                            setTimeout(() => {
                                                slider.next();
                                            }, 1000);
                                        }
                                    }}
                                />
                            </div>
                        );
                    }}
                </For>
            </div>
            <Portal>
                <Show when={showChatMessage()}>
                    <div class="fixed bottom-0 left-0 right-0 p-4">
                        <ChatMessage message={chatMessage() || { id: Date.now(), text: '', sender: 'bot' }} />
                    </div>
                </Show>
            </Portal>
            <SimpleFooter onTranscript={handleTranscript} disabled={false} />
        </div>
    );
}

export default FlashcardSlider;