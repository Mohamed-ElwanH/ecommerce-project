const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women"],
    },
    subCategory: [{ type: String, required: true }],
    //slug is how the id becomes the product name in the url
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      //for visiblity
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isTopSale: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Product", productSchema);
