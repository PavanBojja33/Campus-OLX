const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const isSeller = require('../middleware/isSeller');
const { addItem, getItems, markAsSold, deleteItem } = require('../controllers/itemController');

const { updateItem } = require('../controllers/itemController');

router.post('/add', protect, addItem);
router.get('/', getItems);
router.put('/sold/:id', protect, markAsSold);
router.post(
    '/add',
    protect,
    upload.array('images', 5),
    addItem
);
router.put(
    '/sold/:id',
    protect,
    isSeller,
    markAsSold
);
router.delete(
    '/:id',
    protect,
    isSeller,
    deleteItem
);
router.put(
    '/:id',
    protect,
    isSeller,
    updateItem
);


module.exports = router;
