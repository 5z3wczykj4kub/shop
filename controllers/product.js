const fs = require('fs').promises;
const path = require('path');

const Product = require('../models/product');

// helper functions
const pageNumberIsValid = (pageNumber) =>
  Number.isInteger(pageNumber) && pageNumber > 1;

const fetchProducts = (pageNumber, numberOfProducts) => {
  return Product.find()
    .skip(pageNumber * numberOfProducts - numberOfProducts)
    .sort({ addedDate: 'desc' })
    .limit(numberOfProducts);
};
const fetchProductsLength = () => Product.countDocuments();

// controllers
function getProductAndRenderView(viewFilename) {
  return async function (req, res, next) {
    const productID = req.params.id;

    try {
      const product = await Product.findById(productID);
      if (!product) throw new Error('product not found');
      res.render(viewFilename, { product });
    } catch (err) {
      next();
    }
  };
}

function getProductsAndRenderView(viewFilename) {
  return async function (req, res) {
    const pageNumber = +req.query.page;
    const numberOfProducts = 6;

    if (pageNumberIsValid(pageNumber)) {
      try {
        const [products, productsLength] = await Promise.all([
          fetchProducts(pageNumber, numberOfProducts),
          fetchProductsLength(),
        ]);
        const nextPage = pageNumber * numberOfProducts < productsLength;

        res.render(viewFilename, {
          products,
          pageNumber,
          nextPage,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const [products, productsLength] = await Promise.all([
          fetchProducts(1, numberOfProducts),
          fetchProductsLength(),
        ]);
        const nextPage = numberOfProducts < productsLength;

        res.render(viewFilename, {
          products,
          pageNumber: 1,
          nextPage,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
}

exports.getProduct = getProductAndRenderView('product');

exports.getEditProduct = getProductAndRenderView('edit-product');

exports.getProducts = getProductsAndRenderView('index');

exports.getDeleteProducts = getProductsAndRenderView('delete-product');

exports.addProduct = async (req, res) => {
  const name = req.body['product-name'];
  const description = req.body['product-description'];
  const price = req.body['product-price'];
  const imageName = req.file ? req.file.filename : null;

  const product = new Product({
    name,
    description,
    price,
    imageName,
  });

  try {
    await product.save();
    res.redirect(303, '/');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  const productID = req.body['product-id'];
  const productImageName = req.body['product-image-name'];
  const pageNumber = +req.body['page-number'];
  const productsLength = +req.body['products-length'];

  const deleteProductFromDatabase = () => Product.findByIdAndDelete(productID);
  const deleteImageFromFileSystem = () => {
    if (productImageName) {
      return fs.unlink(
        path.join(__dirname, '..', 'public', 'uploads', productImageName)
      );
    }
  };

  try {
    await Promise.all([
      deleteProductFromDatabase(),
      deleteImageFromFileSystem(),
    ]);
    if (!pageNumber) return res.redirect('/');
    res.redirect(
      303,
      `/delete-product?page=${
        productsLength === 1 ? pageNumber - 1 : pageNumber
      }`
    );
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  const queryProducts = req.query.products && req.query.products.split(',');

  if (queryProducts) {
    const products = await Product.find().where('_id').in(queryProducts);
    return res.render('cart', { products });
  }
  res.render('cart', { products: [] });
};

exports.editProduct = async (req, res) => {
  const productID = req.body['product-id'];
  const name = req.body['product-name'];
  const description = req.body['product-description'];
  const price = req.body['product-price'];
  const prevImageName = req.body['prev-product-image']
    ? req.body['prev-product-image']
    : null;
  const imageName = req.file ? req.file.filename : prevImageName;

  const updateProduct = () => {
    return Product.findById(productID).then((product) => {
      product.name = name;
      product.description = description;
      product.price = price;
      product.imageName = imageName;
      return product.save();
    });
  };
  const deleteImageFromFileSystem = () => {
    if (imageName && prevImageName && imageName !== prevImageName) {
      return fs.unlink(
        path.join(__dirname, '..', 'public', 'uploads', prevImageName)
      );
    }
  };

  try {
    await Promise.all([updateProduct(), deleteImageFromFileSystem()]);
    res.redirect(303, `/product/${productID}`);
  } catch (err) {
    console.log(err);
  }
};

// testing exports
exports.pageNumberIsValid = pageNumberIsValid;
