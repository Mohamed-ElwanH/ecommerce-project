const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);

    const orderProducts = [];

    let totalPrice = 0;
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (cart.items.some((item) => item.isPriceChanged)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ error: "Confirm the price-changed items in your cart first" });
    }
    const { addressId } = req.body;
    const saved = req.user.addresses.id(addressId);
    if (!saved) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid addressId" });
    }
    const address = saved.toObject();
    delete address._id;
    for (let item of cart.items) {
      if (!item.product || item.product.isDeleted || !item.product.isActive) {
        throw new Error(
          "Cart contains an unavailable product: " + item.product?._id,
        );
      }
      const productId = item.product._id;
      const quantity = item.quantity;
      const priceAtOrderTime = item.product.price;

      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true, session },
      );
      if (!product) throw new Error("Product not found or out of stock");

      orderProducts.push({
        productId: productId,
        quantity: quantity,
        priceAtOrderTime: priceAtOrderTime,
      });
      totalPrice += item.product.price * item.quantity;
    }
    const newOrder = await Order.create(
      [
        {
          user: userId,
          products: orderProducts,
          totalPrice,
          address,
          status: "pending",
        },
      ],
      { session },
    );
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Order created", data: newOrder[0] });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
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
        order.status = "cancelled by user";
        await order.save();
        res.status(200).json({ message: "Order cancelled", data: order });
      } else
        res.status(403).json({ error: "Not authorized to cancel this order" });
    } else res.status(409).json({ error: "Cannot cancel order once shipped" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Status updated", data: order.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getAllOrdersHistory = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "-password")
      .populate("products.productId", "name slug");
    res.status(200).json({ message: "All orders", data: orders });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getUserOrdersHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("user", "-password")
      .populate("products.productId", "name slug");
    res.status(200).json({ message: "All user orders", data: orders });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
