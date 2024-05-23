import { ethers } from 'ethers';
import { Database } from '@tableland/sdk';
import { UserTableSchema } from '../types/TableSchemas';

export const insertNewUserData = async (
  signer: ethers.Signer,
  tableName: string,
  ih: string,
  cs: number,
  ls: number
): Promise<void> => {
  if (!signer) {
    console.error('Signer is not set.');
    return;
  }
  if (!tableName) {
    console.error('Table name is not set.');
    return;
  }

  const userData: UserTableSchema = {
    ih,
    cs,
    ls,
  };

  try {
    const db = new Database({ signer });
    await db.prepare(`
      INSERT INTO ${tableName} (
        ih, 
        cs, 
        ls
      ) VALUES (
        '${userData.ih}', 
        ${userData.cs}, 
        ${userData.ls}
      );
    `).run();  
    console.log('User data inserted into table:', tableName);
  } catch (error) {
    console.error('Failed to insert user data into table:', tableName, error);
  }
};