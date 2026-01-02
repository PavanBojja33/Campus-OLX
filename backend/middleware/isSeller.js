const Item = require("../models/Item");

const isSeller = async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (item.seller.toString() !== req.user.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  req.item = item;
  next();
};

module.exports = isSeller;
