import { ethers } from 'ethers';
import { Database } from '@tableland/sdk';

export const createUserTable = async (signer: ethers.Signer): Promise<string | null> => {
  if (!signer) {
    console.log('Signer is not set.');
    return null;
  }
  try {
    const db = new Database({ signer });
    const prefix = "mu";
    const { meta } = await db
      .prepare(`
        CREATE TABLE ${prefix} (
          id INTEGER PRIMARY KEY,
          ih TEXT,
          cs INTEGER,
          ls INTEGER
        );
      `)
      .run();
    await meta.txn?.wait();
    const name = meta.txn?.names[0] ?? "";

    console.log('User table created:', name);
    return name;
  } catch (error) {
    console.error('Failed to create user table:', error);
    return null;
  }
};