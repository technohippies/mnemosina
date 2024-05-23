import GeneralList from '../components/GeneralList';

export default {
  title: 'Components/GeneralList',
  component: GeneralList,
};

const Template = (args) => <GeneralList {...args} />;

export const ChevronList = Template.bind({});
ChevronList.args = {
  items: [
    { label: 'List Item 1', iconType: 'chevron' },
    { label: 'List Item 2', iconType: 'chevron' },
    { label: 'List Item 3', iconType: 'chevron' },
  ],
};

export const PencilList = Template.bind({});
PencilList.args = {
  items: [
    { label: 'Edit Item 1', iconType: 'pencil', image: 'images/Gengar.png' },
    { label: 'Edit Item 2', iconType: 'pencil', image: 'images/Gengar.png' },
    { label: 'Edit Item 3', iconType: 'pencil', image: 'images/Gengar.png' },
  ],
};

export const AddList = Template.bind({});
AddList.args = {
  items: [
    { label: 'Add Item 1', iconType: 'add' },
    { label: 'Add Item 2', iconType: 'add' },
    { label: 'Add Item 3', iconType: 'add' },
  ],
};

export const DeleteList = Template.bind({});
DeleteList.args = {
  items: [
    { label: 'Delete Item 1', iconType: 'delete' },
    { label: 'Delete Item 2', iconType: 'delete' },
    { label: 'Delete Item 3', iconType: 'delete' },
  ],
};