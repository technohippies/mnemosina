import { Component, createEffect, createSignal } from 'solid-js';
import LayoutWrapper from '../components/LayoutWrapper';
import { useNavigate } from '@solidjs/router';
import { fetchUserProfile } from '../utils/fetchUserProfile';

const Profile: Component = () => {
  const [userAvatar, setUserAvatar] = createSignal('/images/user.svg');
  const [userName, setUserName] = createSignal('');
  const [userWalletAddress, setUserWalletAddress] = createSignal(''); // Store wallet address
  const [isLoading, setIsLoading] = createSignal(true); // Loading state
  const navigate = useNavigate();
  
  createEffect(() => {
    fetchUserProfile(setUserAvatar, setUserName, setIsLoading, setUserWalletAddress);
  });

  return (
    <LayoutWrapper isFooterDisabled={false}>
      <div class="relative text-center">
        <img src="/images/cover.png" alt="Cover" class="w-full h-64 object-cover" />
        <img src={userAvatar()} alt="Avatar" class="w-36 h-36 rounded-full border-4 border-white absolute top-36 left-1/2 transform -translate-x-1/2" />
        <div class="mt-16 px-8">
          {isLoading() ? (
            <div class="spinner">Loading...</div>
          ) : (
            userName() ? (
              <h1 class="text-xl">Hi! {userName()}!</h1>
            ) : (
              <div>
                <p class="text-lg font-bold mb-2">{userWalletAddress()}</p>
                <p>You don't have a web3 domain name yet so you don't have a profile!</p>
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg py-4 px-6 rounded-full mt-6"
                  onClick={() => navigate('/store')}
                >
                  Buy Your Name
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Profile;