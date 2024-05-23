import { Component } from 'solid-js';
import { HiOutlineXMark } from 'solid-icons/hi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}

const Modal: Component<ModalProps> = (props) => {
  return (
    <div class={`modal-backdrop fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 ${props.isOpen ? '' : 'hidden'}`} onclick={(e) => {
      if ((e.target as Element).classList.contains('modal-backdrop')) {
        props.onClose();
      }
    }}>
      <div class="bg-white rounded-xl overflow-hidden transform transition-all sm:max-w-lg w-full relative" onclick={e => e.stopPropagation()}>
        <button class="absolute top-0 right-0 m-4 p-2" onclick={props.onClose}> 
          <HiOutlineXMark class="w-6 h-6" />
        </button>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;