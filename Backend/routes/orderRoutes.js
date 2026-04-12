const express = require("express");
const { protect, isPartner } = require("../middleware/authMiddleware");
const { placeOrder, getUserOrders, updateOrderStatus, cancelOrder, getPartnerOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/partner", protect, isPartner, getPartnerOrders);
router.put("/:id/status", protect, isPartner, updateOrderStatus); // Only partner updates status
router.put("/:id/cancel", protect, cancelOrder); // User can cancel

module.exports = router;
