import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const connectWallet = async (): Promise<{signer: ethers.Signer, wasAlreadyConnected: boolean} | null> => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let wasAlreadyConnected = accounts.length > 0;

      if (!wasAlreadyConnected) {
        // Requesting accounts will prompt the user for connection if not already done so.
        const requestedAccounts = await provider.send("eth_requestAccounts", []);
        wasAlreadyConnected = requestedAccounts.length > 0;
        if (wasAlreadyConnected) {
          console.log('Wallet connected after request');
        } else {
          console.log('User denied wallet connection');
        }
      } else {
        console.log('Wallet was already connected');
      }

      return { signer: provider.getSigner(), wasAlreadyConnected };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  } else {
    console.error('Ethereum wallet is not available');
    return null;
  }
};