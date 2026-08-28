const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
    },
        priceAtOrderTime: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      title: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      area: String,
      building: String,
      floor: String,
      apartment: String,
      notes: String,
    },
    totalPrice:{
      type:Number,
      required:true
    },
    status:{
      type:String,
      required:true,
      enum:["pending", "in progress", "shipped", "received", "canceled by user", "canceled by admin", "rejected", "refunded"],
      default:"pending"
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
