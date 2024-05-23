import { Component } from 'solid-js';

interface BotChatMessageProps {
  message: string;
}

const BotChatMessage: Component<BotChatMessageProps> = (props) => {
  return (
    <div class="absolute bottom-full mb-64 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-3 px-4 rounded-full shadow-lg min-w-64">
      {props.message}
    </div>
  );
};

export default BotChatMessage;