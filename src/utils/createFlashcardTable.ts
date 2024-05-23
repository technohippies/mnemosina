import { ethers } from 'ethers';
import { Database } from '@tableland/sdk';

export const createFlashcardTable = async (signer: ethers.Signer): Promise<string | null> => {
    if (!signer) {
        console.log('Signer is not set.');
        return null;
    }
    try {
        const db = new Database({ signer });
        const prefix = "flashcard";
        const { meta } = await db
            .prepare(`
    CREATE TABLE ${prefix} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      walletAddress TEXT,
      deckCID TEXT,
      sourceLanguage TEXT,
      targetLanguage TEXT,
      partOfSpeech TEXT,
      audioFromVideoCID TEXT,
      ttsEnUSCID TEXT,
      ttsEnUKCID TEXT,
      videoStillCID TEXT,
      level INTEGER,
      clipTime TEXT
    );
  `)
            .run();
        await meta.txn?.wait();
        const name = meta.txn?.names[0] ?? "";
        console.log('Flashcard table created:', name);
        return name;
    } catch (error) {
        console.error('Failed to create flashcard table:', error);
        return null;
    }
};