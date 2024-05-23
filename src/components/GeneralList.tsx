import { For } from 'solid-js';
import { HiOutlineChevronRight, HiOutlinePencilSquare, HiSolidLockClosed, HiOutlineArrowTopRightOnSquare } from 'solid-icons/hi';

const GeneralList = (props) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'pencil':
        return <HiOutlinePencilSquare class="w-6 h-6" />;
      case 'chevron':
        return <HiOutlineChevronRight class="w-6 h-6" />;
      case 'link':
        return <HiOutlineArrowTopRightOnSquare class="w-6 h-6" />;
      default:
        return <HiOutlineChevronRight class="w-6 h-6" />;
    }
  };

  // Conditionally apply onClick handler or navigate to link
  const handleItemClick = (item) => {
    if (item.url && typeof item.url === 'string') {
      window.location.href = item.url;
    } else if (item.onClick && typeof item.onClick === 'function') {
      item.onClick();
    }
  };

  return (
    <ul class="list-none m-0 p-0">
      <For each={props.items}>{(item) =>
        <li 
          class="flex justify-between items-center p-4 hover:bg-gray-700 cursor-pointer bg-gray-600 mb-2 rounded-lg relative"
          onClick={() => handleItemClick(item)} // Triggers navigation or function
          style={{ cursor: item.onClick || item.url ? 'pointer' : 'default' }} // Changes cursor style conditionally
        >
          {item.image && (
            <div class="relative flex items-center justify-center mr-4 w-16 h-10">
              <img src={item.image} alt="" class={`rounded-lg object-cover w-full ${item.isLocked ? 'opacity-20' : ''}`} />
              {item.isLocked && (
                <div class="absolute inset-0 flex justify-center items-center">
                  <HiSolidLockClosed class="w-6 h-6 text-gray-800" />
                </div>
              )}
            </div>
          )}
          <span class="flex-1">{item.label}</span>
          {getIcon(item.iconType)}
        </li>
      }</For>
    </ul>
  );
};

export default GeneralList;