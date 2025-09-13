import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    // matches the structure in /index.html
    const id = product?.Id ?? '';
    const href = `product_pages/index.html?product=${encodeURIComponent(id)}`;
    const img = product?.Image ?? '';
    const brand = product?.Brand?.Name ?? '';
    const name = product?.NameWithoutBrand ?? product?.Name ?? 'Product';
    const price =
      typeof product?.FinalPrice === 'number'
        ? `$${product.FinalPrice.toFixed(2)}`
        : `$${product?.FinalPrice ?? '0.00'}`;
  
    return `<li class="product-card">
      <a href="${href}">
        <img src="${img}" alt="Image of ${name}">
        <h2 class="card__brand">${brand}</h2>
        <h3 class="card__name">${name}</h3>
        <p class="product-card__price">${price}</p>
      </a>
    </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
      // You passed in this information to make the class as reusable as possible.
      // Being able to define these things when you use the class will make it very flexible
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = typeof listElement === 'string'
      ? document.querySelector(listElement)
      : listElement;

    this.products = [];
    }
  
    async init() {
        this.products = await this.dataSource.getData();
        this.renderList(this.products);
    }
    
  renderList(products) {
  if (!this.listElement) return;
  renderListWithTemplate(
      productCardTemplate, // your top-level template function
      this.listElement,    // where to render
      products,            // data
      'afterbegin',        // position (default is fine)
      true                 // clear existing content (replaces innerHTML approach)
    );
  }
}
