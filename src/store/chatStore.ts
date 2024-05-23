import { createStore } from 'solid-js/store';

interface ChatStore {
  isVisible: boolean;
  messages: Array<{ id: number; text: string; sender: 'user' | 'bot' }>;
}

const [chatStore, setChatStore] = createStore<ChatStore>({
  isVisible: false,
  messages: [],
});

// Function to add a message to the chatStore
function addMessage(text: string, sender: 'user' | 'bot') {
  setChatStore('messages', (messages) => [
    ...messages,
    { id: Date.now(), text, sender },
  ]);
}

export { chatStore, setChatStore, addMessage };