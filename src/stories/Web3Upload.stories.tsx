import { Component } from 'solid-js';
import Web3Upload from '../components/Web3Upload'; // Adjust the import path as necessary

const meta = {
  title: 'Integration/Web3Upload',
  component: Web3Upload,
  // Define any argTypes for controls you want to expose in Storybook for this component
};

export default meta;

export const Default = (args) => {
  // Since Web3Upload might not directly accept props for customization,
  // you can adjust this part based on what props it actually uses, if any.
  return <Web3Upload {...args} />;
};

// Set default args if your component uses props
Default.args = {
  // Define default values for props if necessary
};