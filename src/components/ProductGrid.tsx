import { Component, For } from 'solid-js';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  icon?: string; // Optional SVG icon
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: Component<ProductGridProps> = (props) => {
  return (
    <div class="grid grid-cols-2 gap-4 text-xl">
      <For each={props.products}>{(product) => (
        <div class="bg-gray-800 rounded-xl flex flex-col">
          <img src={product.imageUrl} alt={product.name} class="w-full min-h-64 bg-gray-700 object-cover rounded-t-xl" />
          <div class="p-4 flex-grow">
            <div class="font-bold min-h-28">{product.name}</div>
            <div class="my-4 font-bold flex items-center">
              {product.icon && (
                <img src={product.icon} alt="icon" class="w-5 h-5 mr-2" />
              )}
              {product.price}
            </div>
          </div>
          <a href={product.buyUrl} target="_blank" class="mt-auto w-full bg-blue-500 text-white py-6 text-lg rounded-b-xl block text-center font-bold">Buy on OKX</a>
        </div>
      )}</For>
    </div>
  );
};

export default ProductGrid;