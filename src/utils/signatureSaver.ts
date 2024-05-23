import { openDB } from 'idb';
import { wallet } from '../store/walletStore'; // Import wallet which includes the provider
import { JoyIDSigner } from '@joyid/ethers';

export const saveSignature = async () => {
    console.log("Checking Ethereum provider and signer...");
    if (!wallet.isConnected) {
        console.error("Wallet not connected.");
        throw new Error("Wallet not connected. Please connect your wallet.");
    }

    if (!wallet.provider) {
        console.error("Ethereum provider not available.");
        throw new Error("Ethereum provider not available. Please install it.");
    }

    console.log("Getting address...");
    const signer = new JoyIDSigner(wallet.provider, wallet.account); // Assuming account is the connected address
    const address = await signer.getAddress();
    const message = "签名开始您的学习课程 Sign to begin your study session";
    console.log("Signing message...");
    const signature = await signer.signMessage(message);

    console.log("Opening IndexedDB...");
    const db = await openDB('SignaturesDB', 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (!db.objectStoreNames.contains('signatures')) {
                console.log("Creating 'signatures' object store with explicit keyPath...");
                db.createObjectStore('signatures', { keyPath: 'id' });
            }
        },
    });

    console.log("Creating transaction...");
    const tx = db.transaction('signatures', 'readwrite');
    const store = tx.objectStore('signatures');
    console.log("Adding signature to store...");
    const entry = {
        id: new Date().getTime(), // Use current timestamp as a unique key
        address: address,
        signature: signature,
        timestamp: new Date().toISOString()
    };
    await store.add(entry);
    await tx.done;

    console.log("Signature saved successfully.");
    return signature;
};

export const hasSigned = async () => {
    console.log("Opening database...");
    const db = await openDB('SignaturesDB', 1, {
        upgrade(db) {
            console.log("Upgrading database...");
            if (!db.objectStoreNames.contains('signatures')) {
                console.log("Creating 'signatures' object store with explicit keyPath...");
                db.createObjectStore('signatures', { keyPath: 'id', autoIncrement: true });
            }
        },
    });

    console.log("Accessing 'signatures' object store...");
    try {
        const tx = db.transaction('signatures', 'readonly');
        const store = tx.objectStore('signatures');
        const cursor = await store.openCursor(null, 'prev'); // Get the most recent entry

        if (cursor) {
            const currentTime = new Date().getTime(); // Get current time as timestamp
            const signatureTime = new Date(cursor.value.timestamp).getTime(); // Convert stored date to timestamp
            const timeDiff = (currentTime - signatureTime) / 60000; // Difference in minutes

            console.log("Time difference:", timeDiff);
            if (timeDiff <= 15) {
                return true; // Signature is valid
            }
        }
        return false; // No valid signature found
    } catch (error) {
        console.error("Error accessing 'signatures' object store:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

export const hasSignedOtherAddress = async (currentAddress) => {
    const db = await openDB('SignaturesDB', 1);
    const tx = db.transaction('signatures', 'readonly');
    const store = tx.objectStore('signatures');
    let cursor = await store.openCursor(); // Use 'let' instead of 'const'

    while (cursor) {
        if (cursor.value.address !== currentAddress) {
            return true; // Found a signature from a different address
        }
        cursor = await cursor.continue(); // Now valid as 'cursor' is mutable
    }
    return false;
};