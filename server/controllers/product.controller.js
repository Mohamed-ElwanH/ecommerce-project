const Product = require("../models/product.model");
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, price, stock, category, subCategory, slug } = req.body;
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "At least one image required" });
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
    res.status(500).json({error: e.message});
  }
};
exports.updateProduct = async (req, res)=>{
    try{
        const {id} = req.params;
        const updates = req.body
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {new:true, runValidators:true});
        if(!updatedProduct) 
            return res.status(404).json({error:"Product not found"})

    }catch(e){
        res.status(500).json({error: e.message});
    }
}
