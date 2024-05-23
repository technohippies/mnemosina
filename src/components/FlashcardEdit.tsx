import { Component, createSignal, createEffect } from 'solid-js';
import { Flashcard } from '../types/oldTypes'; // Adjust the path as necessary
import { TextInput } from './TextInput'; // Assuming TextInput is in the same directory
import { HiOutlineChevronLeft, HiOutlinePhoto, HiOutlineXMark, HiOutlineTrash } from 'solid-icons/hi'; // Import necessary icons
import Button from './Button'; // Import the Button component
import i18n from '../i18n';

interface FlashcardEditProps {
    flashcard: Flashcard;
    onSave: (updatedFlashcard: Flashcard) => void;
    labelKey: string; // Add this line
}

export const FlashcardEdit: Component<FlashcardEditProps> = (props) => {
    const [editedFlashcard, setEditedFlashcard] = createSignal({ ...props.flashcard });
    const [saveState, setSaveState] = createSignal('');
    const [label, setLabel] = createSignal(i18n.t(props.labelKey));

    createEffect(() => {
        const updateLabel = () => setLabel(i18n.t(props.labelKey));
        // Listen for language changes to update the label
        i18n.on('languageChanged', updateLabel);
        // Cleanup listener when the component is unmounted
        return () => i18n.off('languageChanged', updateLabel);
    });

    const handleDelete = () => {
        // Implement the delete logic here
        console.log('Delete action triggered');
    };


    const handleImageChange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedFlashcard({ ...editedFlashcard(), image: e.target?.result as string });
                autoSave();
            };
            reader.readAsDataURL(file);
        }
    };

    const autoSave = () => {
        setSaveState('Saving to device...');
        setTimeout(() => {
            props.onSave(editedFlashcard());
            setSaveState('Saved to device');
            setTimeout(() => setSaveState(''), 2000);
        }, 1000);
    };

    const removePhoto = () => {
        updateField('frontImage', ''); // Assuming 'image' is the key for the photo in your Flashcard type
    };

    const updateField = (field: keyof Flashcard, value: string) => {
        setEditedFlashcard({ ...editedFlashcard(), [field]: value });
        autoSave();
    };

    return (
        <div class="flashcard-edit ">
            <nav class="flex justify-between items-center p-4 ">
                <div class="flex-1">
                    <button class="back-arrow text-2xl">
                        <HiOutlineChevronLeft />
                    </button>
                </div>
                <h1 class="flex-1 text-center text-lg">{i18n.t('edit')}</h1>
                <div class="flex-1 text-right">
                    {saveState() === 'Saving to device...' && <span>{i18n.t('savingToDevice')}</span>}
                    {saveState() === 'Saved to device' && <span>{i18n.t('savedToDevice')}</span>}
                    {saveState() === '' && <span class="invisible">Placeholder</span>}
                </div>
            </nav>
            <div class="content bg-gray-100 px-4 py-6 rounded-xl">
                <h2 class="text-xl font-bold">{i18n.t('front')}</h2>
                <div class="mt-4">
                    <h3 class="mb-2 text-lg">{i18n.t('image')}</h3>
                    {editedFlashcard().frontImage ? (
                        <div class="flex items-center">
                            <img src={editedFlashcard().frontImage} class="rounded-xl max-w-64" style="width: 40%;" />
                            <div class="ml-4 flex items-center"> {/* Ensure vertical centering */}
                                <Button labelKey="removePhoto" class="bg-red-500 hover:bg-red-700 min-w-32" onClick={removePhoto} icon={HiOutlineXMark} />
                            </div>
                        </div>
                    ) : (
                        <label class="bg-gray-100 text-center h-32 rounded-xl flex flex-col justify-center items-center cursor-pointer">
                            <HiOutlinePhoto class="text-2xl mb-1" />
                            <span class="font-bold">{i18n.t('addPhoto')}</span>
                            <input type="file" accept="image/*" onInput={handleImageChange} style="display: none;" />
                        </label>
                    )}
                </div>
                <div class="mt-4">
                    <h3 class="mb-2 text-lg">Text</h3>
                    <TextInput
                        placeholder="Front Text"
                        value={editedFlashcard().frontText}
                        onInput={(e) => updateField('frontText', (e.target as HTMLInputElement).value)}
                    />
                </div>
                <h2 class="text-xl mt-8 font-bold">{i18n.t('back')}</h2>
                <div class="mt-4">
                    <h3 class="mb-2 text-lg">{i18n.t('text')}</h3>
                    <TextInput
                        placeholder="Back Text"
                        value={editedFlashcard().backText}
                        onInput={(e) => updateField('backText', (e.target as HTMLInputElement).value)}
                    />
                </div>
                <div class="mt-4 w-full">
                    <Button
                        labelKey="deleteFlashcard"
                        class="bg-red-500 hover:bg-red-700 text-white w-full"
                        onClick={handleDelete}
                        icon={HiOutlineTrash}
                    />
                </div>
            </div>

        </div>
    );
};