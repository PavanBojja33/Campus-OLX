const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const isSeller = require('../middleware/isSeller');

const {
  addItem,
  getItems,
  markAsSold,
  updateItem,
  getMyItems,
  removeItem
} = require('../controllers/itemController');

router.post(
  '/add',
  protect,
  upload.array('images', 5),
  addItem
);

router.get('/', getItems);

router.get('/my', protect, getMyItems);

router.put(
  '/sold/:id',
  protect,
  isSeller,
  markAsSold
);

router.put(
  '/remove/:id',
  protect,
  isSeller,
  removeItem
);

router.put(
  '/:id',
  protect,
  isSeller,
  updateItem
);

module.exports = router;
