import { Component } from 'solid-js';

interface ToggleButtonProps {
  onToggle: () => void;
  isToggled: boolean;
}

const ToggleButton: Component<ToggleButtonProps> = (props) => {
  return (
    <div class="relative inline-block w-14 h-7">
      <input
        id="toggleTwo"
        type="checkbox"
        class="sr-only"
        checked={props.isToggled}
        onChange={props.onToggle}
      />
      <label for="toggleTwo" class="block cursor-pointer h-5 w-14 bg-gray-300 rounded-full shadow-inner relative">
        <div
          class={`absolute left-0 -top-1 transition-all duration-300 ease-in-out rounded-full shadow-switch-1 h-7 w-7 ${props.isToggled ? 'translate-x-7 bg-blue-500' : 'bg-white'}`}
        ></div>
      </label>
    </div>
  );
};

export default ToggleButton;