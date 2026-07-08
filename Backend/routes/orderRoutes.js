const express = require("express");
const { protect, isPartner } = require("../middleware/authMiddleware");
const { placeOrder, getUserOrders, updateOrderStatus, cancelOrder, getPartnerOrders, getOrderById } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getUserOrders);
router.get("/partner", protect, isPartner, getPartnerOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, isPartner, updateOrderStatus); 
router.put("/:id/cancel", protect, cancelOrder); 

module.exports = router;
