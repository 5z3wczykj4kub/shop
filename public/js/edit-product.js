const productImage = document.querySelector('#edit-product-image');
const productImageButton = document.querySelector('.product-image__button');
const productImageFilename = document.querySelector(
  '.product-image__file-name'
);
const productImagePreview = document.querySelector('.product-view__image')

productImage.addEventListener('change', () => {
  if (productImage.files.length > 0) {
    productImageButton.classList.add('active');
    productImageFilename.textContent = productImage.files[0].name;
    productImagePreview.src =  URL.createObjectURL(productImage.files[0])
    productImagePreview.classList.remove('product-view__no-image')
  }
});
