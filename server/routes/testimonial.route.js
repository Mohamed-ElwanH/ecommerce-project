const express = require("express");
const {
  createTist,
  getApprovedTist,
  getAllTist,
  approveTist,
  hideTist,
  deleteTist,
} = require("../controllers/testimonial.controller");
const { authenticate } = require("../middlewares/auth.middlewares");
const { authorize } = require("../middlewares/role.middlewares");

const router = express.Router();

router.post("/", createTist);
router.get("/", getApprovedTist);
router.get("/all-testimonial", authenticate, authorize("admin"), getAllTist);
router.put(
  "/approve-testimonial/:id",
  authenticate,
  authorize("admin"),
  approveTist,
);
router.put("/hide-testimonial/:id", authenticate, authorize("admin"), hideTist);
router.delete(
  "/delete-testimonial/:id",
  authenticate,
  authorize("admin"),
  deleteTist,
);

module.exports = router;
