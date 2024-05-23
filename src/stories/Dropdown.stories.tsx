import { Component } from 'solid-js';
import Dropdown from '../components/Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export default meta;

export const Standard = () => {
  return (
    <Dropdown label="Dropdown Label">
      This is the content that will show when the dropdown is clicked.
    </Dropdown>
  );
};