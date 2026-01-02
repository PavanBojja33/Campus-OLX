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

/* ADD ITEM (with images) */
router.post(
  '/add',
  protect,
  upload.array('images', 5),
  addItem
);

/* GET PUBLIC ITEMS (only active) */
router.get('/', getItems);

/* GET MY ITEMS (PROFILE) */
router.get('/my', protect, getMyItems);

/* MARK AS SOLD (seller only) */
router.put(
  '/sold/:id',
  protect,
  isSeller,
  markAsSold
);

/* REMOVE ITEM (soft delete) */
router.put(
  '/remove/:id',
  protect,
  isSeller,
  removeItem
);

/* UPDATE ITEM (seller only) */
router.put(
  '/:id',
  protect,
  isSeller,
  updateItem
);

module.exports = router;
