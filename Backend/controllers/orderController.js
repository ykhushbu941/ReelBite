const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No order items" });
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ msg: "Error placing order", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food", "name videoUrl price restaurant")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Ensure only partner or admin can do this realistically, though for now we are open
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: "Error updating order status", error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ msg: "Only Pending orders can be cancelled." });
    }

    order.status = "Cancelled";
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling order", error: err.message });
  }
};

exports.getPartnerOrders = async (req, res) => {
  try {
    // We fetch all orders and populate the food
    const allOrders = await Order.find()
      .populate({
        path: "items.food",
        select: "name price restaurant createdBy"
      })
      .populate("user", "name phone address")
      .sort({ createdAt: -1 });

    // Filter to effectively keep orders where the food belongs to THIS partner
    const partnerOrders = allOrders.filter(order => {
      // Check if any of the items in this order were created by this partner
      return order.items.some(item => 
        item.food && item.food.createdBy.toString() === req.user.id
      );
    });

    res.json(partnerOrders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching partner orders", error: err.message });
  }
};
