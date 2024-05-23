import { ChatMessage as ChatMessageType } from '../types/ChatMessageType';

const ChatMessage = (props: { message: ChatMessageType }) => {
  return (
    <div class="absolute bottom-[240px] left-[105px] mr-8 bg-gray-700 text-white p-4 px-6 min-w-42 rounded-xl z-30">
      <div class="absolute bottom-[-7px] left-[24px] -translate-x-1/2 rotate-0 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-700"></div>
      {props.message.text}
    </div>
  );
};

export default ChatMessage;