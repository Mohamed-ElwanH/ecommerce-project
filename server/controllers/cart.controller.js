const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
  exports.getCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
      );
      if (!cart)
        return res
          .status(200)
          .json({ message: "Cart is empty", data: { items: [] } });
      res.status(200).json({ message: "Cart", data: cart });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  exports.addItem = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);
      let cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, items: [] });

      if (!product) return res.status(404).json({ error: "Product not found" });
      const existingProduct = cart.items.find(
        (i) => i.product.toString() === productId,
      );
      if (existingProduct) existingProduct.quantity += quantity;
      else
        cart.items.push({ product: productId, quantity, price: product.price });

      await cart.save();
      res.status(200).json({ message: "Item added", data: cart });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  exports.updateItemQuantity = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId, quantity } = req.body;
      let cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      let item = cart.items.find((i) => i.product.toString() === productId);
      if (!item) return res.status(404).json({ error: "Item not found" });
      item.quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Item quantity updated" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  exports.removeItemFromCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.body;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      cart.items = cart.items.filter((i) => i.product.toString() != productId);
      await cart.save();
      res.status(200).json({ message: "Removed Item", data: cart });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  exports.confirmPriceChange = async (req, res) => {
    try {
      const userId = req.user._id;
      const productId = req.params.id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ error: "Cart not found" });

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: "Product not found" });

      const item = cart.items.find((i) => i.product.toString() === productId);
      if (!item)
        return res.status(404).json({ error: "Item not found in cart" });

      item.price = product.price;
      item.isPriceChanged = false;

      await cart.save();
      res.status(200).json({ message: "New price confirmed", data: cart });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
  exports.mergeGuestCart = async (req, res) => {
    const guestItems = Array.isArray(req.body.items) ? req.body.items : [];
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    for (const gi of guestItems) {
      const product = await Product.findById(gi.productId);
      if (!product || product.isDeleted || !product.isActive) continue;
      const qty = Math.max(1, parseInt(gi.quantity) || 1);
      const existing = cart.items.find((i) => i.product.equals(product._id));
      if (existing) existing.quantity += qty;
      else
        cart.items.push({
          product: product._id,
          quantity: qty,
          price: product.price,
          isPriceChanged: gi.price != null && gi.price !== product.price,
        });
    }
    await cart.save();
    res.status(200).json({ message: "Cart merged", data: cart });
  };
