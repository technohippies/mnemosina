import { Component, createSignal } from 'solid-js';
import FlashcardInFeed from './FlashcardInFeed';
import FooterNav from './FooterNav';
import type { Word } from '../types/types';


const FlashcardFeedWithFooter: Component<{ flashcards: Word[]; onTranscript: (transcript: string) => void; disabled: boolean; displayMode: 'base' | 'translation'; userLanguage?: string; }> = (props) => {
  // Create a signal to manage the transcript state
  const [transcript, setTranscript] = createSignal('');

  // A wrapper function to update the transcript and call the original onTranscript prop
  const handleTranscript = (newTranscript: string) => {
    console.log("newTranscript : " + newTranscript);
    setTranscript(newTranscript); // Update the local transcript state
    props.onTranscript(newTranscript); // Call the parent's onTranscript if needed
  };

  return (
    <div class="flex flex-col h-screen">
      <div class="flex-1 overflow-auto">
        {/* Pass the transcript as a prop to FlashcardInFeed */}
        <FlashcardInFeed
          flashcards={props.flashcards}
          displayMode={props.displayMode}
          userLanguage={props.userLanguage}
          transcript={transcript()}
          onCorrectResponse={() => {
            // Define what happens on correct response, e.g., move to the next slide
            console.log("Correct response! Moving to the next slide.");
            // Invoke any logic here to change the slide or update the state accordingly
          }}
        />
      </div>
      <div>
        {/* Use the wrapper function to handle transcript updates */}
        <FooterNav onTranscript={handleTranscript} disabled={props.disabled} />
      </div>
    </div>
  );
};

export default FlashcardFeedWithFooter;