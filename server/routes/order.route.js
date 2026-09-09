const express = require("express");
const { authenticate } = require("../middlewares/auth.middlewares");
const {
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getUserOrdersHistory,
  getAllOrdersHistory,
} = require("../controllers/order.controller");
const { authorize } = require("../middlewares/role.middlewares");
const { preventBlocked } = require("../middlewares/block.middlewares");

const router = express.Router();

router.post("/", authenticate, preventBlocked,createOrder);
router.put("/cancel", authenticate, preventBlocked,cancelOrder);
router.put("/status/:id", authenticate, authorize("admin"), updateOrderStatus);
router.get("/user-orders", authenticate, getUserOrdersHistory);
router.get(
  "/all-orders",
  authenticate,
  authorize("admin"),
  getAllOrdersHistory,
);

module.exports = router;
