import { Component } from 'solid-js';
import Dropdown from '../components/Dropdown';
import PWABanner from '../components/PWABanner';

const meta = {
  title: 'Components/PWABanner',
  component: PWABanner,
};

export default meta;

export const Default = () => {
  return (
    <PWABanner />
  );
};