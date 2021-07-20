const addToCartButton = document.querySelector(
  '.product-view__controls__add-to-cart-button'
);
const settings = document.querySelector('.product-view__controls__settings');
const settingsBackdrop = document.querySelector(
  '.product-view__controls__settings__backdrop'
);
const settingsModal = document.querySelector(
  '.product-view__controls__settings__modal'
);
const settingsModalCloseIcon = document.querySelector(
  '.product-view__controls__settings__modal__header > i'
);
const settingsModalDeleteButton = document.querySelector(
  '.product-view__controls__settings__modal__body__delete-button'
);

updateAddToCartButton(addToCartButton);

// event listeners
addToCartButton.addEventListener('click', addToCart);
settings.addEventListener('click', () => {
  settingsBackdrop.classList.add('active');
  settingsModal.classList.add('active');
});
[settingsBackdrop, settingsModalCloseIcon].forEach((element) => {
  element.addEventListener('click', () => {
    settingsBackdrop.classList.remove('active');
    settingsModal.classList.remove('active');
  });
});
settingsModalDeleteButton.parentElement.addEventListener(
  'submit',
  deleteProduct
);

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

  updateAddToCartButton(addToCartButton);
  updateCartProductsNumber();
  updateGoToCartLinkHref();
}

// update cart button
function updateAddToCartButton(addToCartButton) {
  const productID = addToCartButton.dataset.productId;
  const localStorageProducts = JSON.parse(localStorage.getItem('products'));

  if (localStorageProducts && localStorageProducts.includes(productID)) {
    addToCartButton.innerHTML =
      'Remove from <i class="fas fa-shopping-cart"></i>';
  } else {
    addToCartButton.innerHTML = 'Add to <i class="fas fa-shopping-cart"></i>';
  }
}

// delete product
function deleteProduct(event) {
  event.preventDefault();
  const productID =
    settingsModalDeleteButton.parentElement.firstElementChild.value;
  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products'))
    : [];
  const updatedLocalStorageProducts = localStorageProducts.filter(
    (localStorageProduct) => localStorageProduct !== productID
  );
  localStorage.setItem('products', JSON.stringify(updatedLocalStorageProducts));
  event.target.submit();
}
