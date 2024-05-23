import { onMount, onCleanup, For, batch, createEffect, createSignal, Show, lazy } from 'solid-js';
import { Portal } from 'solid-js/web';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';
import FooterNav from '../components/FooterNav';
import { initializeDecks } from '../utils/initializeDecks';
import { karaokeStore, setKaraokeStore } from '../store/karaokeStore';
import { setChatStore } from '../store/chatStore';
import { ChatMessage as ChatMessageType } from '../types/ChatMessageType';
import ChatMessage from '../components/ChatMessage';
import { UnifiedItem, UnifiedItemType } from '../types/types';
import { sortFeedItems } from '../utils/sortFeedItems';
import HeaderNav from '../components/HeaderNav';
import SignUpSlide from '../components/SignUpSlide';
import { wallet } from '../store/walletStore';
import AudioRecorder from '../components/AudioRecorder';

function Feed() {
  let slider: KeenSliderInstance | null = null;
  let sliderContainer: HTMLDivElement | undefined;
  const [showChatMessage, setShowChatMessage] = createSignal(false);
  const [chatMessage, setChatMessage] = createSignal<ChatMessageType | null>(null);
  const [userLanguage, setUserLanguage] = createSignal('en'); // default to 'en' temporarily
  const [languageSupported, setLanguageSupported] = createSignal(true); // New state to track language support
  const [feedItems, setFeedItems] = createSignal<UnifiedItem[]>([]);
  const [activeIndex, setActiveIndex] = createSignal(0); // Define activeIndex signal here

  const KaraokePlayer = lazy(() => import('../components/KaraokePlayer'));

  const initializeSlider = () => {
    if (sliderContainer) {
      slider = new KeenSlider(sliderContainer, {
        mode: "snap",
        slides: { perView: 'auto' },
        vertical: true,
        loop: false,
        rubberband: false,
        slideChanged: s => {
          const newActiveDeckIndex = s.track.details.rel;
          batch(() => {
            setActiveIndex(newActiveDeckIndex); // Update activeIndex here
            setKaraokeStore('activeDeckIndex', newActiveDeckIndex);
            setKaraokeStore('isSayItBackMoment', false);
            handleSwipe();
          });
        }
      });
    }
  };


  const handleTranscript = (transcript: string) => {
    batch(() => {
      setKaraokeStore('transcript', transcript);
      setChatStore('messages', (messages) => [
        ...messages,
        { id: Date.now(), text: transcript, sender: 'user' },
      ]);
    });
  };

  createEffect(() => {
    if (karaokeStore.isSayItBackMoment || !karaokeStore.videoPlaying) {
      console.log('Pausing all decks');
      broadcastToDecks('pause');
    } else if (karaokeStore.activeDeckIndex >= 0) {
      console.log('Playing active deck');
      broadcastToDecks('play');
    }
  });

  const handleShowMessage = (message: ChatMessageType) => {
    // Update the ChatStore with the new message
    setChatStore('messages', (messages) => [
      ...messages,
      message,
    ]);

    // Set the entire message for display
    setChatMessage(message);
    setShowChatMessage(true);
  };

  const broadcastToDecks = (action) => {
    setKaraokeStore('videoControlAction', action);
  };

  const getInitialLanguage = () => {
    const browserLang = navigator?.language || 'zh-CN';
    const supportedLangs = ['zh-CN', 'zh-HK'];

    // First, check for an exact match
    if (supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    // If no exact match, try a partial match (e.g., 'zh' for 'zh-CN')
    const partialMatch = supportedLangs.find(lang => lang.startsWith(browserLang.split('-')[0]));
    console.log(partialMatch);
    if (!partialMatch) {
      setLanguageSupported(false); // Update state to reflect unsupported language
    }

    return partialMatch || 'zh-CN'; // Default to 'zh-CN' if no matches
  };

  const handleSwipe = () => {
    // Wipe the chat message on swipe
    setChatMessage(null);
    setShowChatMessage(false);
  };

  onMount(async () => {
    const initialLanguage = getInitialLanguage();
    setUserLanguage(initialLanguage);
  
    const deckFile = '/subtitles/roc.json';
    console.log(deckFile);
    const response = await fetch(deckFile);
    if (!response.ok) {
      console.error('Failed to fetch deck data');
      return;
    }
    const deckData = await response.json();
    if (!deckData) return;
    const { decks } = deckData;
  
    const enrichedDecks = decks.map(deck => ({
      ...deck,
      backgroundImageUrl: `https://ipfs.filebase.io/ipfs/${deck.backgroundCID}`
    }));
  
    await initializeDecks(enrichedDecks, initialLanguage);
  
    const updatedDecks = karaokeStore.decks;
    let unifiedFeedItems: UnifiedItem[] = [];
    updatedDecks.forEach((deck, index) => {
      unifiedFeedItems.push({
        type: 'karaokeDeck' as UnifiedItemType,
        data: deck,
        sortOrder: index
      });
      if ((index + 1) % 2 === 0 && !wallet.isConnected) {
        unifiedFeedItems.push({
          type: 'signUp' as UnifiedItemType,
          data: {},
          sortOrder: index + 0.5
        });
      }
    });
  
    unifiedFeedItems = sortFeedItems(unifiedFeedItems);
  
    setFeedItems(unifiedFeedItems);
    setKaraokeStore('activeDeckIndex', 0);
    setKaraokeStore('isSayItBackMoment', false); // Reset isSayItBackMoment on page load
    initializeSlider();
  });

  onCleanup(() => {
    slider?.destroy();
  });

  return (
    <div class="relative h-screen">
      <HeaderNav isFixed={true} />
      <Show when={!languageSupported()} fallback={<div class="h-0"></div>}>
        <div class="text-center p-4 mt-20 bg-red-100 text-red-500 fixed top-0 left-0 right-0 z-50">
          您的浏览器语言不支持，默认为普通话
        </div>
      </Show>
      <div ref={el => sliderContainer = el} class="keen-slider h-screen z-10">
        <For each={feedItems()}>
          {(item, index) => (
            <div class="keen-slider__slide h-screen flex justify-center items-center relative"
              style={{ 'background-image': `url('${item.data.backgroundImageUrl}')`, 'background-size': 'cover', 'background-position': 'center' }}>
              <Show when={item.type === 'karaokeDeck'}>
                <KaraokePlayer
                  deck={item.data}
                  index={index}
                  onNextSlide={() => {
                    if (slider) {
                      setTimeout(() => {
                        slider.next();
                      }, 1000);
                    }
                  }}
                  onShowMessage={handleShowMessage}  // Reincorporated the onShowMessage prop
                  userLanguage={userLanguage()}
                />
              </Show>
              <Show when={item.type === 'signUp'}>
                <SignUpSlide />
              </Show>
            </div>
          )}
        </For>
      </div>
      <Portal>
      <AudioRecorder onTranscript={handleTranscript} disabled={!karaokeStore.isSayItBackMoment} />
      <img src="/images/avatar.png" class="absolute bottom-12 mb-6 z-40 w-40" />
      <Show when={showChatMessage()}>
          <div class="fixed bottom-0 left-0 right-0 p-4 z-20">
            <ChatMessage message={chatMessage() || { id: Date.now(), text: '', sender: 'bot' }} />
          </div>
        </Show>
      </Portal>
      <FooterNav />
    </div>
  );
}
export default Feed;