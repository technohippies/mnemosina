import { createEffect, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import FlashcardSlider from './FlashcardSlider';
import { hasSigned } from '../utils/signatureSaver';

const StudyGuard = () => {
  const navigate = useNavigate();
  const [signed, setSigned] = createSignal(false);

  createEffect(async () => {
    console.log("Checking signature...");
    const signatureValid = await hasSigned();
    console.log("Signature valid:", signatureValid);
    if (!signatureValid) {
      console.log("No valid signature found, navigating to /sign.");
      navigate('/sign'); // Redirect to sign page if not signed
    } else {
      console.log("Valid signature found, setting signed to true.");
      setSigned(true);
    }
  });

  // Reactive statement to handle rendering based on the signed state
  const content = () => signed() ? <FlashcardSlider /> : <div>Loading... Please ensure your signature is valid.</div>;

  return (
    <div>
      {content()}
    </div>
  );
};

export default StudyGuard;