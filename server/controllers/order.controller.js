const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    const orderProducts = [];
    const { address } = req.body;
    let totalPrice = 0;
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    for (let item of cart.items) {
      orderProducts.push({
        productId: item.product._id,
        quantity: item.quantity,
        priceAtOrderTime: item.product.price,
      });
      totalPrice += item.product.price * item.quantity;
    }
    const newOrder = await Order.create({
      user: userId,
      products: orderProducts,
      totalPrice,
      address,
      status: "pending",
    });

    res.status(201).json({ message: "Order created", data: newOrder });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.body.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status === "pending" || order.status === "in progress") {
      if (userId === order.user.toString()) {
        order.status = "canceled by user";
        await order.save();
        res.status(200).json({ message: "Order deleted", data: order });
      } else
        res.status(403).json({ error: "Not authorized to cancel this order" });
    } else res.status(409).json({ error: "Cannot cancel order once shipped" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
