import { Component } from 'solid-js';
import SectionedList from '../components/SectionedList';

export default {
  title: 'Components/SectionedList',
  component: SectionedList,
};

const Template: Component<{ sections: any[] }> = (args) => <SectionedList {...args} />;

export const Default = Template.bind({});
Default.args = {
  sections: [
    {
      items: [
        { label: 'Image List Item 1', iconType: 'chevron', image: 'images/Gengar.png', isLocked: false },
        { label: 'Image List Item 2', iconType: 'chevron', image: 'images/Gengar.png', isLocked: true },
      ],
    },
    {
      items: [
        { label: 'Image List Item 1', iconType: 'chevron', image: 'images/Gengar.png', isLocked: true },
        { label: 'Image List Item 2', iconType: 'chevron', image: 'images/Gengar.png', isLocked: true },
      ],
    },
    // Add more sections as needed...
  ],
};