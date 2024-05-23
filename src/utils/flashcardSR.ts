import { Flashcard } from '../types/oldTypes';

let reviewSessionChanges = [];

function updateFlashcardReview(flashcard: Flashcard, quality: number): Flashcard {
  const MIN_EASE_FACTOR = 1.3;
  const responseQuality = quality;

  // Update ease factor
  flashcard.easeFactor = Math.max(MIN_EASE_FACTOR, flashcard.easeFactor + (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02)));

  // Calculate next review interval and update learning step
  if (responseQuality < 3) {
    // If response is less than 3, reset interval and potentially adjust learning step
    flashcard.interval = 1;
    flashcard.learningStep = Math.max(1, flashcard.learningStep - 1); // Optionally decrease learning step, ensuring it doesn't go below 1
  } else {
    // Increase learning step and adjust interval accordingly
    flashcard.learningStep += 1;
    if (flashcard.learningStep === 2) {
      flashcard.interval = 1; // Or another initial interval for early learning steps
    } else if (flashcard.learningStep === 3) {
      flashcard.interval = 6; // Example of a next step interval
    } else {
      // For higher learning steps, use the ease factor to determine the interval
      if (flashcard.interval === 0) {
        flashcard.interval = 1;
      } else {
        flashcard.interval = Math.round(flashcard.interval * flashcard.easeFactor);
      }
    }
  }

  // Update review date
  const now = new Date();
  now.setDate(now.getDate() + flashcard.interval);
  flashcard.reviewDate = now;
  reviewSessionChanges.push({ ...flashcard, reviewDate: flashcard.reviewDate.toISOString() });

  return flashcard;
}

export { reviewSessionChanges, updateFlashcardReview };

// export const categorizeFlashcards = (flashcards: Flashcard[]) => {
//   const now = new Date();
//   const counts = { new: 0, learn: 0, due: 0 };

//   flashcards.forEach(card => {
//     const reviewDate = new Date(card.review_date);
//     if (card.interval === 0) {
//       counts.new += 1;
//     } else if (card.learning_step > 0 || reviewDate > now) {
//       counts.learn += 1;
//     } else {
//       counts.due += 1;
//     }
//   });

//   return counts;
// };