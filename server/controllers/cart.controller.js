const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
exports.createCart = async (req, res) => {
  try {
    const { user, items } = req.body;
    const newCart = await Cart.create({ user, items });
    res.status(200).json({ message: "Cart created", data: newCart });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(200).json({message:'Cart is empty', data:{items:[]}});
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

// exports.updateCart = async(req, res)=>{
//   try{
//     const userId = req.user._id;
//     const updates = req.body;
//     const cart = await Cart.findByIdAndUpdate(userId, i)
//   }
// }
