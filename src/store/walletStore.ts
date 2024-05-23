import { createStore } from 'solid-js/store';
import { ethers } from 'ethers';
import { connect as joyIDConnect, getConnectedAddress, initConfig } from '@joyid/evm';
import { JoyIDProvider } from '@joyid/ethers';

initConfig({
  name: "Rocbox",
  logo: "https://roc.box/images/icon-512x512-maskable.png",
  joyidAppURL: "https://app.joy.id"
});

interface WalletState {
  isConnected: boolean;
  account: string | null;
  userAvatar: string;
  provider: ethers.providers.JsonRpcProvider | null;
}

const initialState: WalletState = {
  isConnected: false,
  account: null,
  userAvatar: '/images/user.svg',
  provider: null,
};

const [wallet, setWallet] = createStore(initialState);

const initEthers = () => {
  const rpcURL = 'https://polygon.drpc.org';
  const network = {
    name: 'Polygon',
    chainId: 137,
  };
  const joyidConfig = {
    rpcURL,
    network,
    name: "Rocbox",
    logo: "https://roc.box/images/icon-512x512-maskable.png",
    joyidAppURL: "https://app.joy.id",
  };

  const provider = new JoyIDProvider(rpcURL, network, joyidConfig);
  setWallet('provider', provider);
};

const listAccounts = async () => {
  if (!wallet.provider) {
    initEthers();
  }
  return wallet.provider ? await wallet.provider.listAccounts() : [];
};

const connectWallet = async () => {
  try {
    const address = await joyIDConnect();
    if (address) {
      setWallet('account', address);
      setWallet('isConnected', true);
      await updateUserAvatar(address);
    }
  } catch (error) {
    console.error('Error connecting with JoyID:', error);
  }
};

const disconnectWallet = async () => {
  setWallet({
    isConnected: false,
    account: null,
    userAvatar: '/images/user.svg',
    provider: null
  });
};

const checkWalletConnected = async () => {
  const address = getConnectedAddress();
  if (address) {
    setWallet('account', address);
    setWallet('isConnected', true);
    await updateUserAvatar(address);
  } else {
    setWallet('isConnected', false);
    setWallet('account', null);
    setWallet('userAvatar', '/images/user.svg');
  }
};

const updateUserAvatar = async (address: string) => {
  if (!address) {
    console.error('No address provided for updating avatar');
    return;
  }
  const url = `https://profile.unstoppabledomains.com/api/resolve/${address}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.meta && data.meta.avatar) {
      setWallet('userAvatar', data.meta.avatar);
    } else {
      setWallet('userAvatar', '/images/user.svg');
    }
  } catch (error) {
    console.error('Error fetching avatar from Unstoppable Domains:', error);
    setWallet('userAvatar', '/images/user.svg');
  }
};

checkWalletConnected();

export { wallet, connectWallet, disconnectWallet, checkWalletConnected, updateUserAvatar, initEthers };