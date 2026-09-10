const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, price, stock, category, subCategory, slug } = req.body;
    // if (!req.files || req.files.length === 0)
    //   return res.status(400).json({ error: "At least one image required" });

    const images =
      req.files && req.files.length
        ? req.files.map((f) => f.filename)
        : ["placeholder.jpg"];
    const newProduct = await Product.create({
      name,
      desc,
      price,
      stock,
      images,
      category,
      subCategory,
      slug,
    });
    res.status(200).json({ message: "Product created", data: newProduct });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const old = await Product.findById(id);
    if (!old) return res.status(404).json({ error: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found" });

    const newPrice = Number(updates.price);
    if (
      updates.price !== undefined &&
      !Number.isNaN(newPrice) &&
      newPrice !== old.price
    ) {
      await Cart.updateMany(
        { "items.product": id },
        { $set: { "items.$[elem].isPriceChanged": true } },
        { arrayFilters: [{ "elem.product": id }] },
      );
    }

    res.status(200).json({ message: "Product updated", data: updatedProduct });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({ message: "Products list:", data: allProducts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  //non-ObjectId params belong to the slug route
  if (!mongoose.Types.ObjectId.isValid(id)) return next();
  try {
    const product = await Product.findById(id);
    if (!product || product.isDeleted || !product.isActive)
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Get product by id", data: product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) return res.status(400).json({ error: "Product needs a slug" });
  try {
    const product = await Product.findOne({ slug });
    if (!product || product.isDeleted || !product.isActive)
      return res.status(404).json({ error: "Product not found" });
    res
      .status(200)
      .json({ message: `Get product by slug: ${slug}`, data: product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true },
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    await Cart.updateMany({}, { $pull: { items: { product: id } } });
    res.status(200).json({ message: "Product deleted", data: product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
