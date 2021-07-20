const products = document.querySelectorAll('.product-card');

const deleteProductButtons = document.querySelectorAll(
  '.product-card__delete-product__button'
);

products.forEach((product) => {
  const productID = product.querySelector('input[name="product-id"]').value;
  product.addEventListener('click', () => {
    location.href = `/product/${productID}`;
  });
});

deleteProductButtons.forEach((deleteProductButton) => {
  deleteProductButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const productID = deleteProductButton.parentElement.firstElementChild.value;

    const localStorageProducts = localStorage.getItem('products')
      ? JSON.parse(localStorage.getItem('products'))
      : [];
    const updatedLocalStorageProducts = localStorageProducts.filter(
      (localStorageProduct) => localStorageProduct !== productID
    );

    localStorage.setItem(
      'products',
      JSON.stringify(updatedLocalStorageProducts)
    );
  });
});
