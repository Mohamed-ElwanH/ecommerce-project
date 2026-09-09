const express = require("express");
const router = express.Router();
const {
  createCart,
  addItem,
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  confirmPriceChange,
} = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middlewares");

router.post("/", authenticate, createCart);
router.get("/", authenticate, getCart);
router.put("/item", authenticate, addItem);
router.put("/item/quantity", authenticate, updateItemQuantity);
router.put("/item/confirm-price/:id", authenticate, confirmPriceChange);
router.delete("/", authenticate, removeItemFromCart);

module.exports = router;
