import { Component, createSignal, onMount } from 'solid-js';
import { ethers } from 'ethers';
import { wallet } from '../store/walletStore';
import { createUserTable } from '../utils/createUserTable';
import { useNavigate } from '@solidjs/router';
import { insertNewUserData } from '../utils/insertNewUserData';
import { verifyAndCalculateLocalStreak, calculatePublicStreak } from '../utils/calculateStreaks';
import { HiSolidFire, HiSolidXMark } from 'solid-icons/hi';
import { openDB } from 'idb';
import i18n from '../i18n';

declare global {
  interface Window {
    ethereum: any;
  }
}

const tableTokenAddress = '0x170fb206132b693e38adFc8727dCfa303546Cec1';
const tableTokenABI = [
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function tokensOfOwner(address owner) external view returns (uint256[] memory)"
];

const TablelandConnection: Component = () => {
  const [signer, setSigner] = createSignal<ethers.Signer | null>(null);
  const [signerAddress, setSignerAddress] = createSignal<string | null>(null);
  const [isConnected, setIsConnected] = createSignal(false);
  const [localStreak, setLocalStreak] = createSignal<number>(0);
  const [tableName, setTableName] = createSignal<string | null>(null);
  const [isTableOwned, setIsTableOwned] = createSignal(false);
  const [isDataMatch, setIsDataMatch] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [currentStreak, setCurrentStreak] = createSignal<number>(null); // Add this line
  const [longestStreak, setLongestStreak] = createSignal<number>(null); // Add this line
  const navigate = useNavigate();

  const fetchTableData = async (sqlQuery: string) => {
    const baseUrl = "https://testnets.tableland.network/api/v1/query";
    const encodedQuery = encodeURIComponent(sqlQuery);
    const apiUrl = `${baseUrl}?statement=${encodedQuery}&format=objects&unwrap=false&extract=false`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching table data:', error);
      return null;
    }
  };

  onMount(async () => {
    console.log('onMount started');
    // Use wallet store to check if the user is connected
    if (!wallet.isConnected) {
      console.error('Ethereum wallet is not available');
      setErrorMessage('Ethereum wallet is not available.');
      return;
    }

    try {
      console.log('Setting up provider and signer');
      const signer = wallet.provider.getSigner(); 
      setSigner(signer);
      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);
      setSignerAddress(signerAddress);
      setIsConnected(true);

      // Calculate local streak using verifyAndCalculateLocalStreak
      const localStreakValue = await verifyAndCalculateLocalStreak(signerAddress);
      setLocalStreak(localStreakValue);
      console.log('Local streak set to:', localStreakValue);

      console.log('Checking owned tokens');
      const tableTokenContract = new ethers.Contract(tableTokenAddress, tableTokenABI, signer);
      const tokenIds = await tableTokenContract.tokensOfOwner(signerAddress);
      console.log('Owned token IDs:', tokenIds);

      if (tokenIds.length === 0) {
        setIsTableOwned(false);
        console.log('No tokens owned');
        setCurrentStreak(0); // Set to 0 if no tokens
        setLongestStreak(0); // Set to 0 if no tokens
      } else {
        setIsTableOwned(true);
        const tokenURI = await tableTokenContract.tokenURI(tokenIds[0]);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        setTableName(metadata.name);

        console.log('Fetching table data for:', metadata.name);
        const sqlQuery = `SELECT * FROM ${metadata.name}`;
        const tableData = await fetchTableData(sqlQuery);
        console.log('Data to be passed to calculatecurrentStreak:', tableData);
        if (tableData) {
          try {
            calculatePublicStreak(tableData, (current, longest) => {
              setCurrentStreak(current);
              setLongestStreak(longest);
            });
          } catch (error) {
            console.error('Error in calculatecurrentStreak:', error);
            setCurrentStreak(0); // Set to 0 on error
            setLongestStreak(0); // Set to 0 on error
          }
        } else {
          setCurrentStreak(0); // Set to 0 if no data
          setLongestStreak(0); // Set to 0 if no data
        }
      }
    } catch (error) {
      console.error('Error with Ethereum contract or network:', error);
      setErrorMessage('Error: Is your wallet connected to Polygon? Did you change wallets?');
      setCurrentStreak(0); // Set to 0 on error
      setLongestStreak(0); // Set to 0 on error
    }
  });


  const refreshData = async () => {
    if (tableName()) {
      const baseUrl = "https://testnets.tableland.network/api/v1/query";
      const sqlQuery = `SELECT * FROM ${tableName()}`;
      const encodedQuery = encodeURIComponent(sqlQuery);
      const apiUrl = `${baseUrl}?statement=${encodedQuery}&format=objects&unwrap=false&extract=false`;
  
      try {
        const response = await fetch(apiUrl);
        const tableData = await response.json();
        calculatePublicStreak(tableData, (current, longest) => {
          setCurrentStreak(current);
          setLongestStreak(longest);
        });
        console.log('Data refreshed and public streak recalculated.');
        setIsDataMatch(true); // Update this based on your application logic
      } catch (error) {
        console.error('Error refreshing data from Tableland:', error);
      }
    }
  }

  const insertData = async () => {
    if (!tableName()) {
      console.error('Table name is not set.');
      return;
    }

    console.log('Attempting to open IndexedDB named W3Storage and fetch the most recent backup from mnemosyneBackups.');
    try {
      const db = await openDB('W3Storage', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('mnemosyneBackups')) {
            db.createObjectStore('mnemosyneBackups', { keyPath: 'id' });
            console.log('mnemosyneBackups object store created.');
          }
        }
      });

      const transaction = db.transaction('mnemosyneBackups', 'readonly');
      const store = transaction.objectStore('mnemosyneBackups');
      const allBackups = await store.getAll();
      if (allBackups.length === 0) {
        console.error('No backups found in IndexedDB.');
        return;
      }
      const mostRecentBackup = allBackups.reduce((a, b) => a.id > b.id ? a : b);
      console.log('Most recent backup fetched:', mostRecentBackup);

      const currentLocalStreak = localStreak(); // Assuming localStreak() is a function that retrieves the current streak
      console.log('Current local streak:', currentLocalStreak);

      console.log('Fetching the longest streak from Tableland database.');
      const sqlQuery = `SELECT MAX(ls) AS longestStreak FROM ${tableName()}`;
      const longestStreakData = await fetchTableData(sqlQuery);
      if (!longestStreakData || longestStreakData.length === 0) {
        console.error('Failed to fetch longest streak data or no data returned.');
        return;
      }
      const longestStreak = longestStreakData[0]?.longestStreak || 0; // Default to 0 if undefined
      console.log('Longest streak fetched:', longestStreak);

      // Compare and update if the current local streak is longer
      if (currentLocalStreak > longestStreak) {
        console.log('Current local streak is longer than the longest streak in the database. Updating...');
        await insertNewUserData(signer(), tableName(), mostRecentBackup.cid, currentLocalStreak, currentLocalStreak);
        console.log('Data inserted into table:', tableName());
        console.log('New longest streak updated:', currentLocalStreak);
      } else {
        console.log('Current local streak is not longer than the longest streak in the database.');
      }
    } catch (error) {
      console.error('Error during database operations:', error);
    }

    // Refresh data after insertion
    console.log('Refreshing data...');
    await refreshData();
  };

  const handleCreateUserTable = async () => {
    if (isTableOwned()) {
      console.log('User already owns a table:', tableName());
      return;
    }
    const signerValue = signer();
    if (!signerValue) {
      console.error('Signer is not set.');
      return;
    }
    const newTableName = await createUserTable(signerValue);
    if (newTableName) {
      setTableName(newTableName);
      setIsTableOwned(true);
      console.log('User table created:', newTableName);
    } else {
      console.error('Failed to create user table.');
    }
  };

  return (
    <div class="min-h-screen flex flex-col justify-center items-center text-white px-8 relative">
      <button class="absolute top-4 left-4 text-white" onClick={() => navigate('/')}>
        <HiSolidXMark size={32} />
      </button>

      <h1 class="text-4xl font-bold mb-2">Streak</h1>
      <div class="text-2xl mb-4 text-center">{isDataMatch() ? 'Your streak is up to date on chain!' : 'Prove that you study every day for rewards!'}</div>
      <HiSolidFire class="text-red-500 w-52 h-52 my-4" />
      <div class="flex w-full">
      <div class="flex-1 flex flex-col items-center">
          {localStreak() === null ? (
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          ) : (
            <>
              <div class="text-4xl font-bold">{localStreak()}</div>
              <div class="text-xl mt-2">Streak on Device 📱</div>
            </>
          )}
        </div>
        <div class="flex-1 flex flex-col items-center">
          {currentStreak() === null ? (
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          ) : (
            <>
              <div class="text-4xl font-bold">{currentStreak()}</div>
              <div class="text-xl mt-2">Streak on Chain ⛓️</div>
            </>
          )}
        </div>
        <div class="flex-1 flex flex-col items-center">
          {longestStreak() === null ? (
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          ) : (
            <>
              <div class="text-4xl font-bold">{longestStreak()}</div>
              <div class="text-xl mt-2">Streak Record ⛓️</div>
            </>
          )}
        </div>
      </div>
      {errorMessage() && <div class="mt-6 text-center text-red-500 font-bold">{errorMessage()}</div>}
      <button
        onClick={() => {
          console.log('Button clicked. isDataMatch:', isDataMatch(), 'isTableOwned:', isTableOwned());
          if (!isDataMatch() && isTableOwned()) {
            console.log('Attempting to insert data...');
            insertData();
          } else if (!isTableOwned()) {
            console.log('Attempting to create table...');
            handleCreateUserTable();
          }
        }}
        class={`mt-4 bg-${isDataMatch() ? 'gray' : (isTableOwned() ? 'orange' : 'blue')}-500 hover:bg-${isDataMatch() ? 'gray' : (isTableOwned() ? 'orange' : 'blue')}-700 text-white font-bold py-4 px-6 my-4 mt-8 w-full text-2xl rounded-full transition-colors duration-200`}
        disabled={isDataMatch()}
      >
        {isTableOwned() ? 'Broadcast Streak' : 'Start Streak'}
      </button>
      <p class="text-xl mt-2">Need $MATIC for Polygon Amoy?</p>
      <p class="text-xl mt-2 mb-4">DM <a href="https://xmtp.chat/dm/0x7Cc5e76b915B8FBc23F46293F0Ce1067eA053b3c" target="_blank" class="text-orange-600 underline font-bold">scarlett.vstudent.x</a> for free tokens</p>
    </div>
  );
};

export default TablelandConnection;
