const Product = require("../models/product.model");
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, price, stock, category, subCategory, slug } = req.body;
    // if (!req.files || req.files.length === 0)
    //   return res.status(400).json({ error: "At least one image required" });
    const images = req.files.map((f) => f.filename);
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
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json({message:'Product updated', data:updatedProduct})
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
exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) return res.status(400).json({ error: "Product needs a slug" });
  try {
    const product = await Product.findOne({ slug });
    res
      .status(200)
      .json({ message: `Get product by slug: ${slug}`, data: product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.deleteProduct = async(req, res)=>{
  const {id} = req.params;
  try{
    const product = await Product.findByIdAndDelete(id);
    if(!product) return res.status(404).json({error:"Product not found"})
    res.status(200).json({message:'Product deleted', data: product});
  }catch(e){
    res.status(500).json({error: e.message})
  }
}
