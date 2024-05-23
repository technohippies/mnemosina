import { Component, createEffect, createSignal } from 'solid-js';


interface PWABannerProps {}

// Extend the Window interface to include deferredPrompt
declare global {
    interface Window {
        deferredPrompt: any; // You can define a more specific type based on your usage
    }
}

const PWABanner: Component<PWABannerProps> = () => {
    const [showBanner, setShowBanner] = createSignal(false);

    const isPWAInstalled = (): boolean => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone ||
               document.referrer.includes('android-app://');
      }
    createEffect(() => {
        if (!isPWAInstalled()) {
            setShowBanner(true);
        }
    });

    const handleClick = async () => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
            const promptEvent = window.deferredPrompt;
            if (promptEvent) {
                promptEvent.prompt(); // Show the prompt
                const result = await promptEvent.userChoice; // Wait for the user to respond to the prompt
                if (result.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                window.deferredPrompt = null; // Reset the deferred prompt variable
            }
        }
    };

    return (
        <div>
            {showBanner() && (
                <div onClick={handleClick} class="top-0 w-full bg-light-blue-200 z-50 cursor-pointer text-center">
                    <span>Never forget to study! Install this as PWA.</span>
                </div>
            )}
        </div>
    );
};

export default PWABanner;