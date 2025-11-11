import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [amount, setAmount] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        setLoading(true);
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}?currency=${currency}`
        );
        setClientSecret(res.data.clientSecret);
        setAmount(res.data.amount);
      } catch (err) {
        console.error("Payment intent error:", err);
        setError(err.response?.data?.message || "Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };
    makeRequest();
  }, [id, currency]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      <div className="container">
        <h1>Complete Your Payment</h1>

        <div className="currency-selector">
          <label>Select Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="usd">USD - US Dollar</option>
            <option value="inr">INR - Indian Rupee</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - British Pound</option>
            <option value="jpy">JPY - Japanese Yen</option>
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="aud">AUD - Australian Dollar</option>
          </select>
          {amount > 0 && (
            <p className="amount-display">
              Amount: {amount} {currency.toUpperCase()}
            </p>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading payment details...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : clientSecret ? (
          <div className="payment-wrapper">
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        ) : (
          <div className="error">Unable to load payment form</div>
        )}
      </div>
    </div>
  );
};

export default Pay;
