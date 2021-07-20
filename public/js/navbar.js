const burger = document.querySelector('.navbar__burger');
const sidedrawer = document.querySelector('.sidedrawer');
const sidedrawerSignIn = document.querySelector('.sidedrawer__sign-in p');
const sidedrawerGoBack = document.querySelector(
  '.sidebar-right .sidedrawer__link'
);
const sidebarLeft = document.querySelector('.sidebar-left');
const sidebarRight = document.querySelector('.sidebar-right');
const backdrop = document.querySelector('.backdrop');
const goToCartLink = document.querySelector('.sidedrawer__link[href="/cart"]');

updateCartProductsNumber();
updateGoToCartLinkHref();

// sidedrawer
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  sidedrawer.classList.toggle('active');
  backdrop.classList.toggle('active');
  changeBodyOverflow();
});

sidedrawerSignIn.addEventListener('click', () => {
  sidebarLeft.classList.add('active');
  sidebarRight.classList.add('active');
});

sidedrawerGoBack.addEventListener('click', () => {
  sidebarLeft.classList.remove('active');
  sidebarRight.classList.remove('active');
});

backdrop.addEventListener('click', () => {
  burger.classList.remove('active');
  sidedrawer.classList.remove('active');
  backdrop.classList.remove('active');
  changeBodyOverflow();
});

backdrop.addEventListener('transitionstart', () => {
  backdrop.classList.add('backdrop--move');
});

backdrop.addEventListener('transitionend', () => {
  if (backdrop.classList.contains('active')) {
    return;
  }
  backdrop.classList.remove('backdrop--move');
});

function changeBodyOverflow() {
  if (burger.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'visible';
  }
}

// redirect to cart
function redirectToCart() {
  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products')).join(',')
    : '';

  location.href = localStorageProducts
    ? `/cart?products=${localStorageProducts}`
    : '/cart';
}

// update go to cart link href
function updateGoToCartLinkHref() {
  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products')).join(',')
    : '';

  goToCartLink.href = localStorageProducts
    ? `/cart?products=${localStorageProducts}`
    : '/cart';
}

// update cart products number
function updateCartProductsNumber() {
  const localStorageProducts = localStorage.getItem('products')
    ? JSON.parse(localStorage.getItem('products'))
    : [];
  const cartProductsNumber = localStorageProducts.length;

  goToCartLink.innerHTML = `<i class="fas fa-shopping-cart sidedrawer__icon"></i>GO TO CART (${cartProductsNumber})`;
}
