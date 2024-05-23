import { Component, createSignal, createEffect, onCleanup } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { HiOutlineHome, HiSolidHome, HiOutlineRectangleStack, HiSolidRectangleStack, HiOutlineBuildingStorefront, HiSolidBuildingStorefront, HiOutlineUser, HiSolidUser } from 'solid-icons/hi';
import { countDueFlashcards } from '../utils/storeFlashcard';
import { subscribeToFlashcardUpdates } from '../store/karaokeStore';

const FooterNav: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dueCount, setDueCount] = createSignal(0);

  const isActive = (path: string) => location.pathname === path;

  const fetchDueCount = async () => {
    const count = await countDueFlashcards();
    setDueCount(count);
  };

  createEffect(() => {
    fetchDueCount();
    const interval = setInterval(fetchDueCount, 60000);
    return () => clearInterval(interval);
  });

  const unsubscribe = subscribeToFlashcardUpdates(() => {
    fetchDueCount();
  });

  onCleanup(() => {
    unsubscribe();
  });

  return (
    <div class="relative z-10">
      <div class="fixed inset-x-0 bottom-0 text-white bg-gray-800 z-10">
        <div class="flex justify-between items-center max-w-screen-xl mx-auto px-4 py-4">
          <div class="flex-1 text-center cursor-pointer" onClick={() => navigate('/')}>
            {isActive('/') ? <HiSolidHome size="24" class="text-gray-400 mx-auto" /> : <HiOutlineHome size="24" class="text-gray-400 mx-auto" />}
          </div>
          <div class="flex-1 text-center cursor-pointer" onClick={() => navigate('/decks')}>
            <div class="relative inline-block">
              {isActive('/decks') ? <HiSolidRectangleStack size="24" class="text-gray-400 mx-auto mt-2" /> : <HiOutlineRectangleStack size="24" class="text-gray-400 mx-auto mt-2" />}
              {dueCount() > 0 && (
                <span class="absolute top-2 left-5 transform translate-x-2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-2 text-sm font-bold leading-none text-white bg-orange-600 rounded-full h-20" style="min-width:20px; height:24px;">
                  {dueCount()}
                </span>
              )}
            </div>
          </div>
          <div class="flex-1 text-center cursor-pointer" onClick={() => navigate('/store')}>
            {isActive('/store') ? <HiSolidBuildingStorefront size="24" class="text-gray-400 mx-auto" /> : <HiOutlineBuildingStorefront size="24" class="text-gray-400 mx-auto" />}
          </div>
          <div class="flex-1 text-center cursor-pointer" onClick={() => navigate('/profile')}>
            {isActive('/profile') ? <HiSolidUser size="24" class="text-gray-400 mx-auto" /> : <HiOutlineUser size="24" class="text-gray-400 mx-auto" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterNav;