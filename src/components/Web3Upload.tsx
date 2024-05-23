import { createSignal, createEffect, onMount, For, Component } from 'solid-js';
import { useWeb3Store } from '../store/web3Store';
import Button from './Button';
import { TextInput } from './TextInput';

interface Web3UploadProps {
  onUploadSuccess?: (signaturesFlashcardsCid: string) => void;  // Updated to accept a single string argument
}

const Web3Upload: Component<Web3UploadProps> = (props) => {
  const { state, authenticate, uploadData, setEmail } = useWeb3Store();
  const [isLoading, setIsLoading] = createSignal(false);
  const [buttonText, setButtonText] = createSignal('Backup Data');
  const [cids, setCids] = createSignal<{ signaturesCid?: string; flashcardsCid?: string }>({});

  onMount(() => {
    console.log('Web3Upload Component Mounted');
  });

  createEffect(() => {
    if (state.status === 'Saved!') {
      setButtonText('Save Streak to Chain');
      if (cids().signaturesCid) {
        props.onUploadSuccess?.(cids().signaturesCid);
      }
    }
  });

  const handleAction = async () => {
    if (!state.email) {
      console.error('No email provided');
      return;
    }
    setIsLoading(true);
    try {
      if (!state.isAuthenticated) {
        console.log('Authentication initiated');
        await authenticate(state.email);
        console.log('Authenticated successfully');
      }
      const result = await uploadData();
      if (result) {
        const signaturesFlashcardsCid = result.signaturesFlashcardsCid.toString();
        setCids({ signaturesCid: signaturesFlashcardsCid, flashcardsCid: signaturesFlashcardsCid });
        props.onUploadSuccess?.(signaturesFlashcardsCid);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmail(email);
  };

  return (
    <div class="flex flex-col items-center justify-center space-y-4 w-full">
      <TextInput
        placeholder="Email 输入你的电子邮箱 "
        value={state.email}
        onInput={handleEmailChange}
        class="w-full"
      />
      <Button onClick={handleAction} class={`w-full mt-4 ${isLoading() ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`} disabled={isLoading()}>
        {isLoading() ? (
          <div class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : buttonText()}
      </Button>
      <div class="mt-2 text-center">
        {state.status}
      </div>
    </div>
  );
}

export default Web3Upload;