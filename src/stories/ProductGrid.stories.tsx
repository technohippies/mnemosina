import ProductGrid from '../components/ProductGrid';
import { Component } from 'solid-js';

const meta = {
    title: 'Components/ProductGrid',
    component: ProductGrid,
    argTypes: {
        products: { control: 'object' },
    },
};

export default meta;

export const Default = (args) => {
    return <ProductGrid {...args} />;
};

Default.args = {
    products: [
        { id: 1, name: 'Product 1', price: 100, imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Product 2', price: 150, imageUrl: 'https://via.placeholder.com/150' }
    ]
};