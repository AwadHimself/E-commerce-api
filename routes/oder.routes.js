const express = require("express");
const router = express.Router();

const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrdersForLoggedUsers,
  updatePaidStatus,
  updateDeliveredStatus,
} = require("../services/order.service");
const { protect, allowedTo } = require("../services/auth.service");

router.route("/:cartId").post(protect, allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    protect,
    allowedTo("admin", "manager", "user"),
    filterOrdersForLoggedUsers,
    getAllOrders,
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin", "manager", "user"), getSpecificOrder);

router
  .route("/:orderId/pay")
  .put(protect, allowedTo("admin", "manager"), updatePaidStatus);

router
  .route("/:orderId/delivered")
  .put(protect, allowedTo("admin", "manager"), updateDeliveredStatus);

module.exports = router;
