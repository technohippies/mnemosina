import { Component, createMemo, createEffect } from 'solid-js';

interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  const percentage = createMemo(() => {
    if (props.max === 0) return 0; // Prevent division by zero
    return (props.value / props.max) * 100;
  });

  return (
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${props.colorClass || 'bg-blue-500'}`}
        style={{ width: `${percentage()}%` }}
      />
    </div>
  );
};

export default ProgressBar;