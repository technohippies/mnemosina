// src/utils/audioTranscription.ts

interface TranscriptionOptions {
    audioBlob: Blob;
    subtitles?: string[];
    setIsProcessing?: (isProcessing: boolean) => void;
    cloudflareWorkerEndpoint: string;
    onSuccess: (transcript: string) => void;
    onError?: (error: any) => void;
  }
  
  export async function sendAudioForTranscription({
    audioBlob,
    subtitles = [],
    setIsProcessing,
    cloudflareWorkerEndpoint,
    onSuccess,
    onError,
  }: TranscriptionOptions): Promise<void> {
    setIsProcessing?.(true);
    console.log('Sending audio to transcription service through Cloudflare Worker...');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'filename.webm');
  
    if (subtitles.length > 0) {
      formData.append('keywords', subtitles.join(','));
      console.log("Subtitles have been added to formData.");
    } else {
      console.log("No subtitles to add to formData.");
    }
  
    try {
      const response = await fetch(cloudflareWorkerEndpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const transcript = data.results.channels[0].alternatives[0].transcript;
      console.log('Transcription:', transcript);
      if (transcript) {
        onSuccess(transcript);
      } else {
        console.log('No transcription available');
      }
    } catch (error) {
      console.error('Error sending audio to transcription service through Cloudflare Worker', error);
      onError?.(error);
    }
    setIsProcessing?.(false);
  }