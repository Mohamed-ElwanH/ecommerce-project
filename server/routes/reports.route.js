const express = require("express");
const { authenticate } = require("../middlewares/auth.middlewares");
const { authorize } = require("../middlewares/role.middlewares");
const { getSalesReport } = require("../controllers/reports.controller");

const router = express.Router();

router.get("/sales", authenticate, authorize("admin"), getSalesReport);

module.exports = router;
