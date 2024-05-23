import { Component, JSXElement, createEffect, onCleanup } from 'solid-js';
import HeaderNav from './HeaderNav'; // Import HeaderNav component
import FooterNav from './FooterNav'; // Import FooterNav component
import i18n from '../i18n'; // Ensure you have the i18n instance imported

interface ScrollableWrapperProps {
  children: JSXElement;
  streak: number; // Add streak to the props
  showSaveIcon: boolean; // Optionally control the save icon visibility
}

const ScrollableWrapper: Component<ScrollableWrapperProps> = (props) => {
  // You might want to manage state that depends on the current language
  // For example, if HeaderNav or FooterNav needs any language-specific props
  createEffect(() => {
    const updateLanguage = () => {
      // This function can be used to trigger any updates that depend on the language change.
      // For now, it's just a placeholder.
      console.log("Language changed to: ", i18n.language);
    };

    i18n.on('languageChanged', updateLanguage);

    onCleanup(() => {
      i18n.off('languageChanged', updateLanguage);
    });
  });

  return (
    <div class="flex flex-col h-full overflow-y-auto">
      <HeaderNav isFixed={false} /> 
      <div class=""> 
        {props.children}
      </div>
      <FooterNav onTranscript={() => {}} disabled={false} />
    </div>
  );
};

export default ScrollableWrapper;