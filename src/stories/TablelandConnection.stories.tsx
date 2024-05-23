import { Component } from 'solid-js';
import TablelandConnection from '../components/TablelandConnection';

const meta = {
  title: 'Utilities/TablelandConnection',
  component: TablelandConnection,
  argTypes: {
    userData: {
      control: 'object'
    },
  },
};

export default meta;

const Template = (args) => <TablelandConnection {...args} />;

export const Default = Template.bind({});
Default.args = {
  userData: {
    ih: "bafkgho0000oos57",
    cs: 1,
    ls: 1,
  },
};