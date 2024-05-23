import { DeckData, Subtitle } from '../types/oldTypes';

export const parseSubtitles = (deckData: DeckData): { subtitles: Subtitle[], annotations: string[] } => {
  let subtitles: Subtitle[] = [];
  let annotations: string[] = [];
  let idCounter = 1;

  if (!deckData || !deckData.deck || !deckData.deck.sections) {
    console.error("Invalid deckData structure:", JSON.stringify(deckData, null, 2));
    return { subtitles, annotations };
  }

  deckData.deck.sections.forEach((section, sectionIndex) => {
    const annotation = section.sectionTitleTranslation;
    if (annotation) {
      annotations.push(annotation);
    } else {
      console.error(`Annotation not found in section ${sectionIndex}`);
    }

    if (!section.lines) {
      console.error(`Missing lines in section ${sectionIndex}`);
      return;
    }

    section.lines.forEach((line, lineIndex) => {
      if (!line) {
        console.error(`Undefined line at section ${sectionIndex}, line ${lineIndex}`);
        return;
      }

      const baseText = line.lineBase;
      const userLangText = line.lineTranslation;

      subtitles.push({
        id: idCounter++,
        start: line.start,
        end: line.end,
        baseText: baseText,
        userLangText: userLangText || baseText,
        section: section.sectionTitleTranslation || section.sectionTitleBase,
      });
    });
  });

  if (subtitles.length === 0) {
    console.error("No subtitles were parsed. Check the provided deckData structure.");
  }

  return { subtitles, annotations };
};