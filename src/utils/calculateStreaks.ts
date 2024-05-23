import { openDB } from 'idb';
import { ethers } from 'ethers';

interface SignatureEntry {
  id: number;
  signature: string;
  timestamp: string;
}

const verifyAndCalculateLocalStreak = async (userAddress: string): Promise<number> => {
  const db = await openDB('SignaturesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('signatures')) {
        db.createObjectStore('signatures', { keyPath: 'id' });
      }
    },
  });
  const signatures: SignatureEntry[] = await db.getAll('signatures');
  signatures.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  let currentStreak = 0;
  let lastDate = new Date();

  for (const entry of signatures) {
    const isVerified = await verifySignature(userAddress, entry.signature, "签名开始您的学习课程 Sign to begin your study session");
    if (!isVerified) {
      console.error(`Signature mismatch for entry id ${entry.id}: The connected wallet is not the signer.`);
      continue; // Skip this entry if the signature does not match
    }

    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    if (currentStreak === 0) {
      currentStreak = 1; // Initialize streak with the first verified entry
      lastDate = entryDate;
    } else {
      const diffDays = (lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak++;
        lastDate = entryDate;
      } else if (diffDays > 1) {
        break; // Streak break if the days are not consecutive
      }
    }
  }

  console.log(`Calculated local streak: ${currentStreak}`);
  return currentStreak;
};

const verifySignature = async (address: string, signature: string, message: string): Promise<boolean> => {
  try {
    const signer = await ethers.utils.verifyMessage(message, signature);
    return signer === address;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};


function calculatePublicStreak(data, setStreakCallback: (currentStreak: number, longestStreak: number) => void) {
  let longestStreak = 0;
  let currentStreak = 0; // Start from 0, increment only on valid streak conditions
  console.log('Starting streak calculation with data:', data);

  if (data && data.length > 0) {
    currentStreak = data[0].cs; // Start with the first entry's streak count
    longestStreak = data[0].ls; // Initialize longestStreak with the first entry's longest streak count

    for (let i = 1; i < data.length; i++) {
      const prevDate = new Date(data[i - 1].timestamp);
      const currentDate = new Date(data[i].timestamp);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = data[i].cs; // Reset streak to current entry's streak count
      }
      longestStreak = Math.max(longestStreak, currentStreak); // Update longestStreak if currentStreak is greater
    }
  }

  console.log('Final current streak:', currentStreak);
  console.log('Final longest streak:', longestStreak);
  setStreakCallback(currentStreak, longestStreak); // Update the streak state via callback
}
export { verifyAndCalculateLocalStreak, calculatePublicStreak };