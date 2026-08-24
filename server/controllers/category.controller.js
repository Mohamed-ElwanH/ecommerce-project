const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const newCategory = await Category.create({ name, slug });
    res.status(200).json({ message: "Category created", data: newCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) return res.status(404).json("Category not found");
       res.status(200).json({ message: "Category updated", data: updatedCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({ message: "Categories list", data: allCategories });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getCategoryBySlug = async (req, res)=>{
    const slug = req.params.slug;
    if(!slug) 
        return res.status(400).json({error: 'Slug param required'})
    try{
        const category = await Category.findOne({slug});
        res.status(200).json({message:`Get category by slug: ${slug}`, data: category});

    }catch(e){
        res.status(500).json({error: e.message})
    }
}

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json({ message: "Category deleted", data: category });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};