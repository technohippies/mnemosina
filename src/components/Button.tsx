import { Component, createEffect, createSignal, JSXElement } from 'solid-js';
import i18n from '../i18n';

interface ButtonProps {
  labelKey?: string;
  class?: string;
  onClick: () => void;
  icon?: any;
  children?: JSXElement;
  disabled?: boolean; 
}

const Button: Component<ButtonProps> = (props) => {
  const [label, setLabel] = createSignal('');
  const [i18nReady, setI18nReady] = createSignal(false);

  createEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
    } else {
      i18n.on('initialized', () => setI18nReady(true));
    }

    if (props.labelKey && i18nReady()) {
      setLabel(i18n.t(props.labelKey));
    }
  });

  createEffect(() => {
    if (props.labelKey) {
      const updateLabel = () => {
        if (i18nReady()) {
          setLabel(i18n.t(props.labelKey));
        }
      };
      i18n.on('languageChanged', updateLabel);
      return () => i18n.off('languageChanged', updateLabel);
    }
  });

  // Conditionally apply hover effect based on the disabled prop
  const buttonClass = `inline-flex items-center justify-center bg-blue-500 ${!props.disabled ? 'hover:bg-blue-700' : ''} text-white font-bold py-4 px-4 rounded-full w-full ${props.class || ''}`;

  return (
    <button class={buttonClass} onClick={props.onClick} disabled={props.disabled}>
      {props.icon && <props.icon class="inline-block mr-2 align-middle" />}
      {i18nReady() && <span class="align-middle">{props.children || label()}</span>}
    </button>
  );
};

export default Button;