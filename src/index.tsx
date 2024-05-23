import { Buffer } from 'buffer';
window.Buffer = Buffer; // Define Buffer globally

/* @refresh reload */
(window as any).global = window; // Polyfill global object

import './index.css';
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import Root from './pages/root';
import { checkWalletConnected } from './store/walletStore';

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
}

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

checkWalletConnected();

render(
  () => (
    <Router>
      <Root />
    </Router>
  ),
  root,
);