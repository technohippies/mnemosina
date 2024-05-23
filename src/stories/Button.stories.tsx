import { Component } from 'solid-js';
import Button from '../components/Button';
import i18n from '../i18n'; // Adjust the import path as necessary

const meta = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    labelKey: { control: 'text' }, // Allow the labelKey to be editable through Storybook controls
  },
};

export default meta;

export const Primary = (args) => {
  // Directly pass the labelKey prop to the Button component
  // Ensure that the labelKey is being used inside the Button component to fetch and display the translated text
  return <Button {...args}>{i18n.t(args.labelKey)}</Button>;
};

Primary.args = {
  labelKey: 'buttonLabel', // Provide a default translation key
};