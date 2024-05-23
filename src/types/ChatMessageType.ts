export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}