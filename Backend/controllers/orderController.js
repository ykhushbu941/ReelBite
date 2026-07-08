const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No order items" });
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cod"
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

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.food", "name videoUrl price restaurant")
      .populate("user", "name phone email address");
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching order", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

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
    const allOrders = await Order.find()
      .populate({
        path: "items.food",
        select: "name price restaurant createdBy"
      })
      .populate("user", "name phone address")
      .sort({ createdAt: -1 });

    const partnerOrders = allOrders.filter(order => {
      return order.items.some(item => 
        item.food && item.food.createdBy.toString() === req.user.id
      );
    });

    res.json(partnerOrders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching partner orders", error: err.message });
  }
};
