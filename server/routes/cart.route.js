const express = require("express");
const router = express.Router();
const {
  createCart,
  addItem,
  getCart,
  removeItemFromCart,
  updateItemQuantity,
} = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middlewares");

router.post("/", authenticate, createCart);
router.get("/", authenticate, getCart);
router.put("/item", authenticate, addItem);
router.put("/item/quantity", authenticate, updateItemQuantity);
router.delete("/", authenticate, removeItemFromCart);

module.exports = router;
