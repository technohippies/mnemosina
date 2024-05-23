import { Component, createSignal, onCleanup } from 'solid-js';
import { HiSolidMicrophone, HiSolidStop } from 'solid-icons/hi';
import { karaokeStore, setKaraokeStore } from '../store/karaokeStore';

interface AudioRecorderProps {
  onTranscript: (transcript: string) => void;
  disabled: boolean;
}

const AudioRecorder: Component<AudioRecorderProps> = (props) => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = createSignal<Blob[]>([]);

  onCleanup(() => {
    if (isRecording()) {
      stopRecording();
    }
  });

  const startRecording = async () => {
    if (isRecording() || props.disabled) {
      console.log('Already recording or disabled.');
      return;
    }
    console.log('Attempting to start recording...');
    setAudioChunks([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted.');
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log('Recording started.');
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = () => {
    if (!isRecording()) {
      console.log('Not recording.');
      return;
    }
    console.log('Stopping recording...');
    mediaRecorder()?.stop();
    setIsRecording(false);
    mediaRecorder()?.stream.getTracks().forEach(track => track.stop());
    console.log('Recording stopped. Preparing to send data...');
    setIsProcessing(true);
    setTimeout(() => {
      const mimeType = 'audio/webm';
      const audioBlob = new Blob(audioChunks(), { type: mimeType });
      sendAudioToCloudflareWorker(audioBlob);
      setAudioChunks([]);
    }, 1000);
  };

  const sendAudioToCloudflareWorker = async (audioBlob: Blob) => {
    console.log('Preparing to send audio to Cloudflare worker...');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'filename.webm');
  
    try {
      const response = await fetch('https://dpgrm.tht3ch.workers.dev', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const transcript = data.results.channels[0].alternatives[0].transcript;
      console.log('AudioRecorder: ' + transcript);
      props.onTranscript(transcript);
    } catch (error) {
      console.error('Error sending audio to Cloudflare worker', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div class="flex justify-center items-center">
      <button
        class={`relative bottom-64 pointer-events-auto rounded-full p-6 mt-3 flex items-center justify-center focus:outline-none text-white font-bold z-50 ${
          isRecording() ? 'bg-orange-600' : 'bg-orange-500'
        } ${props.disabled ? 'invisible' : ''}`}
        onClick={() => isRecording() ? stopRecording() : startRecording()}
        disabled={props.disabled}
      >
                {isProcessing() && (
          <div class="absolute inset-0 flex justify-center items-center">
            <div class="animate-spin rounded-full bg-gradient-to-r from-orange-200 via-orange-400 to-orange-600 w-full h-full absolute opacity-75"></div>
          </div>
        )}
        {isRecording() ? <HiSolidStop size={36} color="#ffffff" /> : <HiSolidMicrophone size={36} color="#ffffff" />}

      </button>
    </div>
  );
};

export default AudioRecorder;
