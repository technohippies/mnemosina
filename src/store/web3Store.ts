import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import { create } from '@web3-storage/w3up-client';
import { retrieveAllSignaturesAsJson } from '../utils/retrieveAllSignaturesAsJson'; 
import { fetchFlashcards } from '../utils/fetchFlashcards'; 
import { addUpload } from '../utils/saveCidToIDB';

const initialEmail = localStorage.getItem('email') || '';

const [state, setState] = createStore({
    client: null,
    isAuthenticated: false,
    email: initialEmail,
    uploads: [],
    space: null,
    status: '', 
});

function setEmail(email: string) {
    localStorage.setItem('email', email);
    setState('email', email);
}

async function initializeClient() {
    try {
        console.log('Initializing Web3 Storage client...');
        const client = await create();
        setState('client', client);
        console.log('Web3 Storage client initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Web3 Storage client:', error);
    }
}

createEffect(() => {
    initializeClient();
});

async function uploadData() {
    if (!state.client || !state.space) {
        console.error('Web3 Storage client or space is not initialized');
        setState('status', 'Error: Web3 Storage client or space is not initialized');
        return;
    }
    setState('status', 'Saving to your Web3.storage ...');
    try {
        const signaturesJson = await retrieveAllSignaturesAsJson();
        const flashcards = await fetchFlashcards();
        const signaturesFlashcardsData = {
            signatures: signaturesJson,
            flashcards: flashcards
        };
        const signaturesFlashcardsBlob = new Blob([JSON.stringify(signaturesFlashcardsData)], { type: 'application/json' });

        const signaturesFlashcardsCid = await state.client.uploadFile(signaturesFlashcardsBlob, { space: state.space.did() });

        console.log(`Data saved! CID: ${signaturesFlashcardsCid}`);

        await addUpload(signaturesFlashcardsCid.toString(), 'SignaturesFlashcards');

        setState('status', 'Saved!');
        setState('uploads', [
            ...state.uploads,
            { name: 'Signatures and Flashcards', cid: signaturesFlashcardsCid }
        ]);

        return { signaturesFlashcardsCid }; 
    } catch (error) {
        console.error('Failed to upload:', error);
        setState('status', `Error: ${error.message}`);
        return null;
    }
}

async function authenticateAndProvisionSpace(email: string) {
    if (!state.client) {
        console.error('Client not initialized');
        setState('status', 'Error: Client not initialized');
        return;
    }

    setState('status', 'Check your email to verify');
    try {
        const account = await state.client.login(email);
        const planStatus = await account.plan.get();
        if (!planStatus.ok) {
            throw new Error('Payment plan not set up.');
        }

        const space = await state.client.createSpace(`Backup ${new Date().toISOString().split('T')[0]}`);
        if (!space) {
            throw new Error('Failed to create space');
        }

        await account.provision(space.did());
        await space.save();
        await state.client.setCurrentSpace(space.did());

        const recovery = await space.createRecovery(account.did());
        await state.client.capability.access.delegate({
            space: space.did(),
            delegations: [recovery],
        });

        setState({
            space,
            isAuthenticated: true,
            status: 'Setup complete'
        });
    } catch (error) {
        console.error('Authentication and space provisioning failed:', error);
        setState('status', `Error: ${error.message}`);
    }
}

export function useWeb3Store() {
    return { state, authenticate: authenticateAndProvisionSpace, uploadData, setEmail };
}