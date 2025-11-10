import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  return (
    <div className="success">
      <div className="container">
        <div className="icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <p className="redirect-text">
          Redirecting to orders page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default Success;
