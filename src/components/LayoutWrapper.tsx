import { Component, JSXElement } from 'solid-js';
import HeaderNav from './HeaderNav';
import FooterNav from './FooterNav';

type LayoutWrapperProps = {
  children: JSXElement;
  onTranscript?: (transcript: string) => void;
  isFooterDisabled: boolean;
  headerClass?: string;
};

const LayoutWrapper: Component<LayoutWrapperProps> = (props) => {
  return (
    <div class="flex flex-col h-screen relative">
      <HeaderNav isFixed={true} className={props.headerClass || "absolute top-0 left-0 right-0 z-10"}/>
      <div class="flex-grow overflow-hidden relative z-0"> 
        {props.children}
      </div>
      {!props.isFooterDisabled && (
        <FooterNav onTranscript={props.onTranscript} disabled={false} />
      )}
    </div>
  );
};

export default LayoutWrapper;