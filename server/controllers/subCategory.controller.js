const SubCategory = require("../models/subCategory.models")

exports.createSubCategory = async (req, res) => {
  try {
    const { name, slug, category } = req.body;
    const newSubCategory = await SubCategory.create({ name, slug, category });
    res.status(200).json({ message: "SubCategory created", data: newSubCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedSubCategory) return res.status(404).json("SubCategory not found");
       res.status(200).json({ message: "SubCategory updated", data: updatedSubCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getAllSubCategories = async (req, res) => {
  try {
    const allSubCategories = await SubCategory.find();
    res.status(200).json({ message: "SubCategories list", data: allSubCategories });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getSubCategoryBySlug = async (req, res)=>{
    const slug = req.params.slug;
    if(!slug) 
        return res.status(400).json({error: 'Slug param required'})
    try{
        const subCategory = await SubCategory.findOne({slug});
        res.status(200).json({message:`Get category by slug: ${slug}`, data: subCategory});

    }catch(e){
        res.status(500).json({error: e.message})
    }
}
exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!subCategory) return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "SubCategory deleted", data: subCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};