import { doubleMetaphone } from 'double-metaphone';

// Helper function to remove punctuation from a string
const sanitizeString = (str: string): string => {
  return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
};

export const calculateSimilarity = (userResponse: string, expectedLyrics: string): number => {
  // Sanitize inputs to remove punctuation
  userResponse = sanitizeString(userResponse);
  expectedLyrics = sanitizeString(expectedLyrics);

  const userResponseCodes = doubleMetaphone(userResponse);
  const expectedLyricsCodes = doubleMetaphone(expectedLyrics);

  // Check for direct phonetic code matches and assign high score for exact matches
  const directMatchScore = userResponseCodes.some(code => expectedLyricsCodes.includes(code)) ? 40 : 0;

  // Calculate length similarity as a percentage of the maximum possible length
  const maxLength = Math.max(userResponse.length, expectedLyrics.length);
  const lengthSimilarityScore = (1 - Math.abs(userResponse.length - expectedLyrics.length) / maxLength) * 10;

  // Introduce a basic content overlap check
  const userResponseWords = new Set(userResponse.toLowerCase().split(/\s+/));
  const expectedLyricsWords = new Set(expectedLyrics.toLowerCase().split(/\s+/));
  const commonWords = [...userResponseWords].filter(word => expectedLyricsWords.has(word));
  const contentOverlapScore = (commonWords.length / expectedLyricsWords.size) * 50;

  // Combine scores: phonetic match, length similarity, and content overlap
  const combinedScore = directMatchScore + lengthSimilarityScore + contentOverlapScore;

  return combinedScore;
};