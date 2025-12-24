const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const isSeller = require('../middleware/isSeller');

const {
  addItem,
  getItems,
  markAsSold,
  deleteItem,
  updateItem
} = require('../controllers/itemController');

/* ADD ITEM (with images) */
router.post(
  '/add',
  protect,
  upload.array('images', 5),
  addItem
);

/* GET ITEMS */
router.get('/', getItems);

/* MARK AS SOLD (seller only) */
router.put(
  '/sold/:id',
  protect,
  isSeller,
  markAsSold
);

/* DELETE ITEM (seller only) */
router.delete(
  '/:id',
  protect,
  isSeller,
  deleteItem
);

/* UPDATE ITEM (seller only) */
router.put(
  '/:id',
  protect,
  isSeller,
  updateItem
);

module.exports = router;
