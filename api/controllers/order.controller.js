import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";
import axios from "axios";

// Currency conversion helper
const convertCurrency = async (amount, fromCurrency = "USD", toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  try {
    // Using exchangerate-api.com (free tier)
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const rate = response.data.rates[toCurrency];
    return Math.round(amount * rate * 100) / 100;
  } catch (err) {
    console.error("Currency conversion error:", err);
    return amount; // Fallback to original amount
  }
};

export const intent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE);
    const gig = await Gig.findById(req.params.id);

    // Get currency from request (default USD)
    const currency = (req.query.currency || "usd").toLowerCase();

    // Convert price if needed
    let price = gig.price;
    if (currency !== "usd") {
      price = await convertCurrency(gig.price, "USD", currency.toUpperCase());
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents/paisa
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        gigId: gig._id.toString(),
        originalPrice: gig.price,
        originalCurrency: "USD",
      },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: price,
      payment_intent: paymentIntent.id,
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      amount: price,
      currency: currency,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      // Show all orders, not just completed
    });
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } }
    );
    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
