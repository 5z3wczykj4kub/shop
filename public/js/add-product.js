const productImage = document.querySelector('#product-image');
const productImageButton = document.querySelector('.product-image__button');
const productImageFilename = document.querySelector(
  '.product-image__file-name'
);

productImage.addEventListener('change', () => {
  if (productImage.files.length > 0) {
    productImageButton.classList.add('active');
    productImageFilename.textContent = productImage.files[0].name;
  }
});
