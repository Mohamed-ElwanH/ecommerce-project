const express = require("express");
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth.middlewares");
const { authorize } = require("../middlewares/role.middlewares");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", authenticate, authorize("admin"), createCategory);
router.put("/:id", authenticate, authorize("admin"), updateCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

module.exports = router;
