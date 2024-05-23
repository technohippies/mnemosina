import PurchaseList from '../components/PurchaseList';

export default {
  title: 'Components/PurchaseList',
  component: PurchaseList,
};

const Template = (args) => <PurchaseList {...args} />;

export const DefaultPurchaseList = Template.bind({});
DefaultPurchaseList.args = {
  items: [
    { label: 'Item 1', price: 10 },
    { label: 'Item 2', price: 20 },
    { label: 'Item 3', price: 30 },
  ],
};