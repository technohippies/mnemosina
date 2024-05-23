import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { saveSignature } from '../utils/signatureSaver';
import Button from './Button';
import i18n from '../i18n'; // Import i18n
import { HiOutlineXMark } from 'solid-icons/hi'; // Import the X icon
import { initEthers } from '../store/walletStore'; // Import initEthers

const SignatureSaver = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = createSignal('');
    const [translations, setTranslations] = createSignal({
        pageTitle: i18n.t('signToStudy'),
        instructionText: i18n.t('earnRewards'),
        buttonText: i18n.t('sign'),
        errorMessage: i18n.t('failedToSaveSignature')
    });

    createEffect(() => {
        const updateTranslations = () => {
            setTranslations({
                pageTitle: i18n.t('signToStudy'),
                instructionText: i18n.t('earnRewards'),
                buttonText: i18n.t('sign'),
                errorMessage: i18n.t('failedToSaveSignature')
            });
        };

        i18n.on('languageChanged', updateTranslations);
        onCleanup(() => i18n.off('languageChanged', updateTranslations));
    });

    const handleSign = async () => {
        initEthers(); // Initialize Ethereum provider
        try {
            await saveSignature();
            const customStudy = searchParams.custom === 'true';
            navigate(customStudy ? '/study?custom=true' : '/study');
        } catch (error) {
            console.error("Failed to save signature:", error);
            setError(translations().errorMessage);
        }
    };

    return (
        <div class="flex flex-col items-center justify-center h-screen px-12 text-center">
            <button class="absolute top-4 left-4 text-white" onClick={() => navigate('/decks')}>
                <HiOutlineXMark size={32} />
            </button>
            <h1 class="text-3xl font-bold text-center">{translations().pageTitle}</h1>
            <p class="mt-2 mb-6 text-xl">{translations().instructionText}</p>
            <Button onClick={handleSign} class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 text-2xl rounded">
                {translations().buttonText}
            </Button>
            {error() && <p class="mt-4 text-red-500">{error()}</p>}
        </div>
    );
};

export default SignatureSaver;