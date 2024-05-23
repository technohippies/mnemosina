import { ethers } from 'ethers';

export const fetchUserProfile = async (setUserAvatar, setUserName, setIsLoading, setUserWalletAddress) => {
  setIsLoading(true);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  setUserWalletAddress(walletAddress);

  const url = `https://profile.unstoppabledomains.com/api/resolve/${walletAddress}`;
  console.log("Fetching URL:", url);

  try {
    const resp = await fetch(url, { method: 'GET' });
    console.log("Response status:", resp.status);
    if (!resp.ok) {
      throw new Error(`Failed to fetch profile: ${resp.status}`);
    }

    const data = await resp.json();
    console.log("Response data:", data);
    if (data && data.avatarUrl) {
      setUserAvatar(data.avatarUrl);
    }
    setUserName(data.name || '');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    setUserAvatar('/images/user.svg');
  } finally {
    setIsLoading(false);
  }
};
