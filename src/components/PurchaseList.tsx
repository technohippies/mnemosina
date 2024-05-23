import { For, Show, createSignal, createEffect, onCleanup } from 'solid-js';
import i18n from '../i18n'; // Import i18n

const PurchaseList = (props) => {
  const [translations, setTranslations] = createSignal({
    buy: i18n.t('buy'),
    customNameRequest: i18n.t('customNameRequest')
  });

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBuyClick = (url) => {
    openInNewTab(url);
  };

  createEffect(() => {
    const updateTranslations = () => {
      setTranslations({
        buy: i18n.t('buy'),
        customNameRequest: i18n.t('customNameRequest')
      });
    };

    i18n.on('languageChanged', updateTranslations);
    onCleanup(() => i18n.off('languageChanged', updateTranslations));
  });

  return (
    <ul class="list-none m-0 p-0 font-bold">
      <For each={props.items}>{(item, index) =>
        <>
          <li
            class="flex justify-between items-center py-6 px-4 bg-gray-600 mb-2 rounded-lg relative"
            style={{ height: '80px' }}
          >
            <div class="flex items-center min-w-52">
              <span class="flex-1 text-left">{item.label}</span>
            </div>
            <div class="flex items-center">
              {item.icon && (
                <img src={item.icon} alt="icon" class="w-5 h-5 mr-2" />
              )}
              <span class="min-w-4 mr-4 text-right">{item.price}</span>
            </div>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 min-w-28 rounded-full"
              onClick={() => handleBuyClick(item.url)}
            >
              {translations().buy}
            </button>
          </li>
          <Show when={index() === 2}>
            <li class="text-center py-8">
              <p class="text-lg pb-4">
                {translations().customNameRequest.split(',').map((part, index) => (
                  <>
                    {index > 0 && <br />}
                    {part}
                  </>
                ))}
              </p>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-6 mb-4 rounded-full mx-auto" onClick={() => openInNewTab('https://xmtp.chat/dm/0x7Cc5e76b915B8FBc23F46293F0Ce1067eA053b3c')}>
                DM Scarlett斯嘉丽
              </button>
            </li>
          </Show>
        </>
      }</For>
    </ul>
  );
};

export default PurchaseList;