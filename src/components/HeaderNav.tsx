import { Component, createSignal, onCleanup } from 'solid-js';
import { createEffect } from 'solid-js';
import i18n from '../i18n';
import { HiSolidFire, HiSolidCloudArrowUp } from 'solid-icons/hi';
import { useNavigate } from '@solidjs/router';
import { wallet, connectWallet, disconnectWallet, updateUserAvatar } from '../store/walletStore';
import { verifyAndCalculateLocalStreak } from '../utils/calculateStreaks';

interface HeaderNavProps {
  className?: string;
  headerClass?: string;
  isFixed?: boolean; // New prop to determine if the header should be fixed
}

const HeaderNav: Component<HeaderNavProps> = (props) => {
  const positionClass = props.isFixed ? 'absolute' : 'relative';
  const [userAvatar, setUserAvatar] = createSignal('');
  const navigate = useNavigate();
  const abbreviateEthAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
  const [localStreak, setLocalStreak] = createSignal(0);
  const [dataChecked, setDataChecked] = createSignal(false); // Signal to track if data check is complete
  const [isPWAInstalled, setIsPWAInstalled] = createSignal(false);
  const [deferredPrompt, setDeferredPrompt] = createSignal(null);
  const [installButtonVisible, setInstallButtonVisible] = createSignal(false);

  const [localText, setLocalText] = createSignal(i18n.t('installPWA'));
  const [walletButtonLabel, setWalletButtonLabel] = createSignal(i18n.t('Connect'));

  createEffect(() => {
    const updateLabels = () => {
      setLocalText(i18n.t('installPWA'));
      setWalletButtonLabel(wallet.isConnected ? i18n.t('disconnectWalletLabel') : i18n.t('connectWalletLabel'));
    };

    i18n.on('languageChanged', updateLabels);
    updateLabels(); // Also call it immediately to set initial value

    onCleanup(() => {
      i18n.off('languageChanged', updateLabels);
    });
  });

  createEffect(() => {
    if (wallet.isConnected && wallet.account) {
      // Set default avatar immediately
      setUserAvatar('/images/user.svg');

      const fetchAvatar = async () => {
        try {
          const avatar = await updateUserAvatar(wallet.account);
          if (typeof avatar === 'string') {
            setUserAvatar(avatar);
          }
        } catch (error) {
          console.error("Error loading user avatar:", error);
        }
      };
      fetchAvatar();

      const updateStreaks = async () => {
        const localStreakValue = await verifyAndCalculateLocalStreak(wallet.account);
        setLocalStreak(localStreakValue);
        setDataChecked(true);
      };
      updateStreaks();
    }
  });

  createEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired', e);
      e.preventDefault();  // This prevents Chrome 67 and earlier from automatically showing the prompt
      setDeferredPrompt(e);
      setInstallButtonVisible(true);  // Enables the Install button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    onCleanup(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    });
  });

  createEffect(() => {
    const handleAppInstalled = (e) => {
      console.log('PWA was installed', e);
      setInstallButtonVisible(false);  // Hide install button after installation
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    onCleanup(() => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    });
  });

  const handleInstallPWA = async () => {
    console.log('Install button clicked');
    if (deferredPrompt()) {
      const promptEvent = deferredPrompt();
      promptEvent.prompt(); // Show the install prompt
      const result = await promptEvent.userChoice;  // Wait for the user to respond
      console.log(`User response to the install prompt: ${result.outcome}`);
      setDeferredPrompt(null); // Reset the deferred prompt variable
      setInstallButtonVisible(false);  // Hide the install button
    }
  };

  const handleWalletAction = async () => {
    if (wallet.isConnected) {
      await disconnectWallet();
      window.umami && window.umami.track('Disconnect Wallet');
    } else {
      await connectWallet();
      window.umami && window.umami.track('Connect Wallet');
    }
  };

  return (
    <>
      <div class={`${positionClass} top-0 left-0 right-0 flex justify-between items-center px-4 pt-6 z-50 ${props.className}`}>
        <div class="flex-1 flex justify-start items-center text-xl font-bold space-x-3">
          <div class="flex items-center space-x-1" onClick={() => navigate('/streak')} style="cursor: pointer;">
            <HiSolidFire class="w-8 h-8 text-red-500" />
            <span class="text-sm">{localStreak()}</span>
          </div>
          <div class="flex items-center space-x-1" onClick={() => navigate('/save')} style="cursor: pointer;">
            <HiSolidCloudArrowUp class="w-8 h-8 text-white" />
          </div>
        </div>

        {installButtonVisible() && (
          <div class="flex-1 flex justify-center">
            <button onClick={handleInstallPWA} class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full text-sm">
              Install PWA
            </button>
          </div>
        )}

        <div class="flex-1 flex justify-end">
          <button onClick={handleWalletAction} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm" style="min-width: 120px;">
            {walletButtonLabel()}
          </button>
        </div>
      </div>
    </>
  );
}

export default HeaderNav;