import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { updateCartBadge } from './product.js';
import { getLocalStorage } from './utils.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  // update the cart badge (count-based)
  const cart = getLocalStorage('so-cart') || [];
  updateCartBadge(cart.length);

  // build and render the product list
  const dataSource = new ProductData('tents');
  const list = new ProductList('tents', dataSource, '.product-list');
  await list.init();
});
