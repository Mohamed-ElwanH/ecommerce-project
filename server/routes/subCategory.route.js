const express = require("express");
const {
  getAllSubCategories,
  getSubCategoryBySlug,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} = require("../controllers/subCategory.controller");
const { authenticate } = require("../middlewares/auth.middlewares");
const { authorize } = require("../middlewares/role.middlewares");
const router = express.Router();

router.get("/", getAllSubCategories);
router.get("/:slug", getSubCategoryBySlug);
router.post("/", authenticate, authorize("admin"), createSubCategory);
router.put("/:id", authenticate, authorize("admin"), updateSubCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteSubCategory);

module.exports = router;
