import { createSignal } from 'solid-js';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'solid-icons/hi';

const Dropdown = (props) => {
    const [isOpen, setIsOpen] = createSignal(false);

    const toggleDropdown = () => setIsOpen(!isOpen());

    return (
        <div>
            <div class="w-full rounded-xl bg-gray-800 py-4 px-6 flex justify-between items-center cursor-pointer text-lg font-bold" onClick={toggleDropdown}>
                <span class="text-left text-md">{props.label}</span>
                {isOpen() ? <HiOutlineChevronUp size={24} /> : <HiOutlineChevronDown size={24} />}
            </div>
            {isOpen() && (
                <div class="w-full rounded-xl bg-gray-800 p-6 mt-2 text-lg">
                    {props.children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;