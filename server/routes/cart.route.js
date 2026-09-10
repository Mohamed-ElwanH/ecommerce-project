const express = require("express");
const router = express.Router();
const {
  addItem,
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  confirmPriceChange,
  mergeGuestCart,
} = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middlewares");

router.get("/", authenticate, getCart);
router.put("/item", authenticate, addItem);
router.put("/item/quantity", authenticate, updateItemQuantity);
router.put("/item/confirm-price/:id", authenticate, confirmPriceChange);
router.delete("/", authenticate, removeItemFromCart);
router.post("/merge", authenticate, mergeGuestCart);

module.exports = router;