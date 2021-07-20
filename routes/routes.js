const express = require('express');

const {
  getProduct,
  getProducts,
  getDeleteProducts,
  addProduct,
  deleteProduct,
  getCart,
  getEditProduct,
  editProduct,
} = require('../controllers/product');

const router = express.Router();

router.get('/', getProducts);

router.get('/cart', getCart);

router.get('/add-product', (req, res) => {
  res.render('add-product');
});
router.post('/add-product', addProduct);

router.get('/delete-product', getDeleteProducts);
router.post('/delete-product', deleteProduct);

router.get('/product/:id', getProduct);

router.get('/edit-product/:id', getEditProduct);
router.post('/edit-product', editProduct);

router.use((req, res) => {
  res.status(404).render('404');
});

module.exports = router;
