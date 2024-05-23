import { Component, createEffect, createSignal } from 'solid-js';
import i18n from '../i18n'; // Assuming this is your i18n setup
import Button from './Button';

interface ReviewDeckProps {
    newCount: number;
    learnCount: number;
    dueCount: number;
    isDeckFinished: boolean; // New prop to indicate if the deck is finished
    onStudyClick: () => void;
    totalCards: number; // New prop to indicate total number of cards
}

const ReviewDeck: Component<ReviewDeckProps> = (props) => {
    const buttonClass = props.isDeckFinished ? "bg-gray-500 hover:bg-gray-700" : "bg-blue-500 hover:bg-blue-700";

    const [titleText, setTitleText] = createSignal(i18n.t('reviewDeck'));
    const [newText, setNewText] = createSignal(i18n.t('new'));
    const [learnText, setLearnText] = createSignal(i18n.t('learn'));
    const [dueText, setDueText] = createSignal(i18n.t('due'));
    const [customStudyText, setCustomStudyText] = createSignal(i18n.t('customStudy'));
    const [finishedDeckText, setFinishedDeckText] = createSignal(i18n.t('finishedDeck'));
    const [noCardsText, setNoCardsText] = createSignal(i18n.t('noCards')); // New text for no cards

    createEffect(() => {
        const updateTexts = () => {
            setNewText(i18n.t('new'));
            setLearnText(i18n.t('learn'));
            setDueText(i18n.t('due'));
            setCustomStudyText(i18n.t('customStudy'));
            setFinishedDeckText(i18n.t('finishedDeck'));
            setNoCardsText(i18n.t('noCards')); // Update for no cards text
        };
        i18n.on('languageChanged', updateTexts);
        // Cleanup function to remove the event listener
        return () => i18n.off('languageChanged', updateTexts);
    });

    return (
        <div class="px-4 py-6 rounded-lg shadow space-y-4 bg-gray-800">
            <div class="flex justify-between items-center">
                <div class="text-center w-full mr-1 py-3 bg-gray-500 rounded-xl">
                    <p class="font-bold text-xl">{props.newCount}</p>
                    <p class="text-md text-gray-300">{newText()}</p>
                </div>
                <div class="text-center w-full mx-1 py-3 bg-gray-500 rounded-xl">
                    <p class="font-bold text-xl">{props.learnCount}</p>
                    <p class="text-md text-gray-300">{learnText()}</p>
                </div>
                <div class="text-center w-full ml-1 py-3 bg-gray-500 rounded-xl">
                    <p class="font-bold text-xl">{props.dueCount}</p>
                    <p class="text-md text-gray-300">{dueText()}</p>
                </div>
            </div>
            {props.totalCards === 0 ? (
                <>
                    <p class="text-center mt-2">{noCardsText()}</p>
                    <Button labelKey="customStudy" onClick={props.onStudyClick} class="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-full cursor-not-allowed" disabled />
                </>
            ) : props.isDeckFinished ? (
                <>
                    <p class="text-center mt-2">{finishedDeckText()}</p>
                    <Button labelKey="customStudy" onClick={props.onStudyClick} class={`w-full ${buttonClass} text-white font-bold py-2 px-4 rounded-full`} />
                </>
            ) : (
                <Button labelKey="study" onClick={props.onStudyClick} class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" />
            )}
        </div>
    );
};

export default ReviewDeck;