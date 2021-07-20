const products = document.querySelectorAll(
  '#cart__item__details__outer__checkbox'
);
const selectAll = document.querySelector('.cart__controls__select');
const deleteSelected = document.querySelector('.cart__controls__delete');

updateGoToCartLinkHref();
checkCartValidity();

// events
if (products.length > 0) {
  products.forEach((product) => {
    product.addEventListener('change', checkboxChangeHandler);
  });
  selectAll.addEventListener('click', selectAllClickHandler);
  deleteSelected.addEventListener('click', deleteSelectedClickHandler);
}

// event handlers
function checkboxChangeHandler() {
  if (products.length === getCheckedProductsLength()) {
    selectAll.dataset.allChecked = true;
    selectAll.innerText = 'Unselect all';
  } else {
    delete selectAll.dataset.allChecked;
    selectAll.innerText = 'Select all';
  }
  toggleDeleteSelected();
}

function selectAllClickHandler() {
  if (selectAll.dataset.allChecked) {
    products.forEach((product) => {
      product.checked = false;
    });
    delete selectAll.dataset.allChecked;
    selectAll.innerText = 'Select all';
  } else {
    products.forEach((product) => {
      product.checked = true;
    });
    selectAll.dataset.allChecked = true;
    selectAll.innerText = 'Unselect all';
  }
  toggleDeleteSelected();
}

function deleteSelectedClickHandler(event) {
  if (!event.target.classList.contains('active')) {
    return;
  }

  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products'))
    : [];
  const checkedProducts = [...products]
    .filter((product) => {
      return product.checked;
    })
    .map((checkedProduct) => checkedProduct.value);

  const updatedLocalStorageProducts = localStorageProducts.filter(
    (localStorageProduct) => {
      return !checkedProducts.includes(localStorageProduct);
    }
  );

  localStorage.setItem('products', JSON.stringify(updatedLocalStorageProducts));
  redirectToCart();
}

// helper functions
function checkCartValidity() {
  const searchParams = new URLSearchParams(location.search).getAll(
    'products'
  )[0];
  const searchParamsProducts = searchParams
    ? searchParams.split(',').sort()
    : [];

  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products')).sort()
    : [];

  if (localStorageProducts.length > products.length) {
    localStorage.setItem(
      'products',
      JSON.stringify(Array.from(products).map((product) => product.value))
    );
    updateCartProductsNumber();
  }

  if (searchParamsProducts.length !== localStorageProducts.length) {
    redirectToCart();
  } else {
    localStorageProducts.forEach((localStorageProduct, index) => {
      if (localStorageProduct !== searchParamsProducts[index]) {
        redirectToCart();
      }
    });
  }
}

function getCheckedProductsLength() {
  return [...products].filter((product) => product.checked).length;
}

function toggleDeleteSelected() {
  if (getCheckedProductsLength() > 0) {
    deleteSelected.classList.add('active');
  } else {
    deleteSelected.classList.remove('active');
  }
}
