import { Component, createEffect, createSignal, onMount } from 'solid-js';
import ReviewDeck from '../components/ReviewDeck';
import LayoutWrapper from '../components/LayoutWrapper';
import { fetchFlashcards } from '../utils/fetchFlashcards';
import { useNavigate } from '@solidjs/router';

const DecksPage: Component = () => {
    const [flashcards, setFlashcards] = createSignal({ newCount: 0, learnCount: 0, dueCount: 0, totalCards: 0 });
    const [isDeckFinished, setIsDeckFinished] = createSignal(false);
    const navigate = useNavigate();

    const handleStudyClick = () => {
        console.log('Study button clicked');
        if (flashcards().totalCards === 0) {
            // No action if no cards are available
        } else if (flashcards().dueCount > 0) {
            navigate('/study'); // Navigate to the regular study page if there are due cards
        } else {
            navigate('/study?custom=true'); // Navigate to the custom study page if no due cards
        }
    };

    onMount(() => {
        console.log("DecksPage is mounted");
        loadFlashcards();
    });

    const loadFlashcards = async () => {
        try {
            const cards = await fetchFlashcards();
            const now = new Date();
            const newCount = cards.filter(card => card.learningStep === 1 && card.interval === 1).length;
            const learnCount = cards.filter(card => card.learningStep > 1 && card.interval <= 3).length;
            const dueCount = cards.filter(card => new Date(card.reviewDate) <= now).length;
            const totalCards = cards.length;
            setFlashcards({ newCount, learnCount, dueCount, totalCards });
            setIsDeckFinished(dueCount === 0 && totalCards > 0); // Set isDeckFinished based on dueCount and totalCards
        } catch (error) {
            console.error('Failed to load flashcards:', error);
        }
    };

    return (
        <LayoutWrapper onTranscript={handleTranscript} isFooterDisabled={false}>
            <div class="mt-24 mx-4">
                <ReviewDeck
                    newCount={flashcards().newCount}
                    learnCount={flashcards().learnCount}
                    dueCount={flashcards().dueCount}
                    isDeckFinished={isDeckFinished()}
                    onStudyClick={handleStudyClick}
                    totalCards={flashcards().totalCards}
                />
            </div>
        </LayoutWrapper>
    );
};

const handleTranscript = (transcript: string) => {
    console.log('Transcript:', transcript);
};

export default DecksPage;