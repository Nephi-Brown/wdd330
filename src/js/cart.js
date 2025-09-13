import { getLocalStorage } from './utils.mjs';
import { updateCartBadge } from './product.js';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    document.querySelector('.product-list').innerHTML =
      '<p>Your cart is empty.</p>';
    updateCartFooter([]); // ensure footer stays hidden
    updateCartBadge(); // keeps badge hidden/0 when empty
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  // Update/show total
  updateCartFooter(cartItems);
  updateCartBadge();
}

function cartItemTemplate(item) {
  const newItem = `<li class='cart-card divider'>
  <a href='#' class='cart-card__image'>
    <img
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors?.[0]?.ColorName ?? ''}</p>
  <p class='cart-card__quantity'>qty: 1</p>
  <p class='cart-card__price'>$${Number(item.FinalPrice).toFixed(2)}</p>
</li>`;

  return newItem;
}

function updateCartFooter(cart) {
  const footerEl = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total');

  // If the footer HTML doesn't exist yet, do nothing (keeps this file safe to include anywhere)
  if (!footerEl || !totalEl) return;

  if (!Array.isArray(cart) || cart.length === 0) {
    footerEl.classList.add('hide');
    totalEl.textContent = '$0.00';
    return;
  }

  const total = getCartTotal(cart);
  totalEl.textContent = formatCurrency(total);
  footerEl.classList.remove('hide');
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => {
    const qty = Number(item?.quantity ?? 1);
    const price = coercePrice(
      item?.FinalPrice ?? item?.price ?? item?.Price ?? item?.ListPrice,
    );
    return sum + price * (Number.isFinite(qty) ? qty : 1);
  }, 0);
}

function coercePrice(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
}

function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

renderCartContents();

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge(); // ensure correct on initial load
  renderCartContents();
});
