const express = require("express");
const { authenticate } = require("../middlewares/auth.middlewares");
const { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { authorize } = require("../middlewares/role.middlewares");
const { upload } = require("../middlewares/uploads.middleware");
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorize('admin'),upload.array('images') ,createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)
module.exports = router;