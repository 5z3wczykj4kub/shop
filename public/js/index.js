const products = document.querySelectorAll('.product-card');
const addToCartButtons = document.querySelectorAll(
  '.product-card__add-to-cart__button'
);

updateAddToCartButtons();
updateGoToCartLinkHref();

// redirect to product page
products.forEach((product) => {
  const productID = product.querySelector('.product-card__add-to-cart__button')
    .dataset.productId;
  product.addEventListener('click', () => {
    location.href = `/product/${productID}`;
  });
});

addToCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCart);
});

// add to cart
function addToCart(event) {
  event.stopPropagation();
  const productID = event.currentTarget.dataset.productId;
  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products'))
    : [];
  const productsSet = new Set([...localStorageProducts]);

  if (productsSet.has(productID)) {
    productsSet.delete(productID);
  } else {
    productsSet.add(productID);
  }

  localStorage.setItem('products', JSON.stringify([...productsSet]));

  updateAddToCartButtons();
  updateCartProductsNumber();
  updateGoToCartLinkHref();
}

// update cart buttons
function updateAddToCartButtons() {
  addToCartButtons.forEach((addToCartButton) =>
    updateAddToCartButton(addToCartButton)
  );
}

// update cart button
function updateAddToCartButton(addToCartButton) {
  const productID = addToCartButton.dataset.productId;
  const localStorageProducts = JSON.parse(localStorage.getItem('products'));

  if (localStorageProducts && localStorageProducts.includes(productID)) {
    addToCartButton.innerHTML =
      'Remove from <i id="product-card__add-to-cart__icon" class="fas fa-shopping-cart"></i>';
  } else {
    addToCartButton.innerHTML =
      'Add to <i id="product-card__add-to-cart__icon" class="fas fa-shopping-cart"></i>';
  }
}
