import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { HiSolidXMark, HiSolidCloudArrowUp } from 'solid-icons/hi';
import { useNavigate } from '@solidjs/router';
import { fetchFlashcards } from '../utils/fetchFlashcards';
import Web3Upload from './Web3Upload';
import i18n from '../i18n'; // Import i18n

const SaveProgress: Component = () => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = createSignal([]);
    const [translations, setTranslations] = createSignal({
        saveStreakTitle: i18n.t('saveStreakTitle'),
        beforeBroadcasting: i18n.t('beforeBroadcasting'),
        dataOnlyInBrowser: i18n.t('dataOnlyInBrowser'),
        getFreeStorage: i18n.t('getFreeStorage')
    });

    createEffect(() => {
        fetchFlashcards().then(setFlashcards).catch(error => {
            console.error('Failed to fetch flashcards:', error);
        });

        const updateTranslations = () => {
            setTranslations({
                saveStreakTitle: i18n.t('saveStreakTitle'),
                beforeBroadcasting: i18n.t('beforeBroadcasting'),
                dataOnlyInBrowser: i18n.t('dataOnlyInBrowser'),
                getFreeStorage: i18n.t('getFreeStorage')
            });
        };

        i18n.on('languageChanged', updateTranslations);
        onCleanup(() => i18n.off('languageChanged', updateTranslations));
    });

    const handleUploadSuccess = (signaturesFlashcardsCid) => {
        navigate('/streak', { state: { signaturesFlashcardsCid } });
    };

    return (
        <div class="min-h-screen flex flex-col text-white px-8 relative">
            <button class="absolute top-4 left-4 text-white" onClick={() => navigate('/')}>
                <HiSolidXMark size={32} />
            </button>
            <HiSolidCloudArrowUp class="text-white w-32 h-32 mt-4 mx-auto" />
            <div class="text-left w-full">
                <h1 class="text-xl font-bold">{translations().saveStreakTitle}</h1>
                <p class="mb-4">{translations().beforeBroadcasting}</p>
            </div>
          
            <div
                class="w-full h-28 p-4 bg-gray-800 text-gray-400 font-mono text-sm border border-gray-700 rounded overflow-y-auto"
            >
                {flashcards().map(card => JSON.stringify(card, null, 2)).join('\n')}
            </div>
            <p class="mt-4 text-left">{translations().dataOnlyInBrowser}</p>
            <p class="mt-4 mb-6 text-left">
                <span class="font-bold text-blue-500">{translations().getFreeStorage}</span>
            </p>
            <Web3Upload onUploadSuccess={handleUploadSuccess} />
        </div>
    );
};

export default SaveProgress;