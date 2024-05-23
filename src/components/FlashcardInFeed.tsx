import { createEffect, Show } from 'solid-js';
import type { FlashcardInFeedProps } from '../types/types';
import { predefinedMessages } from '../data/predefinedMessages';
import { addMessage } from '../store/chatStore';
import { setKaraokeStore, karaokeStore } from '../store/karaokeStore';
import { updateFlashcard } from '../utils/storeFlashcard'; // Import the update function

function FlashcardInFeed(props: FlashcardInFeedProps) {
    console.log('FlashcardInFeed data:', props.flashcard);

    createEffect(() => {
        if (props.isActive(props.index)) {
            const messageId = props.displayMode === 'translation' ? 7 : 5; // Adjust message ID based on display mode
            const responseMessage = predefinedMessages.find(msg => msg.id === messageId);
            if (responseMessage) {
                props.onShowMessage({
                    id: Date.now(),
                    text: responseMessage.text(), // Call the function to get the string
                    sender: 'bot'
                });
                // Set isSayItBackMoment to true when the appropriate message is found
                setKaraokeStore('isSayItBackMoment', true);
            }
        }
    });
    
    createEffect(() => {
        if (karaokeStore.isSayItBackMoment && props.isActive(props.index) && karaokeStore.transcript) {
            const transcript = karaokeStore.transcript.toLowerCase();
            const line = props.flashcard;
            const baseMatch = transcript === line.lineBase.toLowerCase();
            const translationMatch = transcript === line.lineTranslation?.toLowerCase();
            const correctResponse = (props.displayMode === 'base' && baseMatch) || (props.displayMode === 'translation' && translationMatch);
    
            let messageDetails = null;
            if (correctResponse) {
                messageDetails = predefinedMessages.find(msg => msg.id === 1); // Correct response message
                props.onNextSlide();
                setKaraokeStore('isSayItBackMoment', false);
                setKaraokeStore('transcript', '');
    
                // Update the spaced repetition data for the flashcard
                updateFlashcard(line, true).then(() => {
                    console.log('Flashcard updated successfully.');
                }).catch(error => {
                    console.error('Failed to update flashcard:', error);
                });
            } else {
                messageDetails = predefinedMessages.find(msg => msg.id === 3); // Incorrect response message
                setKaraokeStore('transcript', '');
            }
    
            if (messageDetails) {
                addMessage(messageDetails.text, messageDetails.sender);
                props.onShowMessage({
                    id: Date.now(),
                    text: messageDetails.text,
                    sender: 'bot',
                });
            }
        }
    });
    
    return (
        <div class="flex justify-center items-center min-h-screen text-white text-3xl font-bold">
            <div class="text-center pb-52">
                <Show when={props.flashcard.lineBase && props.flashcard.lineTranslation}>
                    <p class={
                        props.transcript?.toLowerCase() === props.flashcard.lineBase.toLowerCase() ||
                        props.transcript?.toLowerCase() === props.flashcard.lineTranslation.toLowerCase()
                            ? "text-green-500" : ""
                    }>
                        {props.displayMode === 'base' ? props.flashcard.lineBase : props.flashcard.lineTranslation}
                    </p>
                </Show>
                <Show when={!props.flashcard.lineBase || !props.flashcard.lineTranslation}>
                    <p>Missing data</p>
                </Show>
            </div>
        </div>
    );
}

export default FlashcardInFeed;