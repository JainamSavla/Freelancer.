import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm } from "../controllers/order.controller.js";
import Order from "../models/order.model.js"; // Fixed: lowercase 'order'

const router = express.Router();

router.get("/", verifyToken, async (req, res, next) => {
  try {
    console.log(
      "Fetching orders for user:",
      req.userId,
      "isSeller:",
      req.isSeller
    );

    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      // Removed isCompleted: true filter
    });

    console.log("Found orders:", orders.length);
    res.status(200).send(orders);
  } catch (err) {
    console.error("Order fetch error:", err);
    next(err);
  }
});
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } }
    );
    res.status(200).send("Order has been updated!");
  } catch (err) {
    next(err);
  }
});

export default router;
