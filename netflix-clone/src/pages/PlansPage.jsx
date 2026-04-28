import React, { useState } from "react";
import styles from "./PlansPage.module.css";

const PlansPage = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (planName, price) => {
    setLoading(true);
    console.log(`Initing checkout for ${planName}...`);

    try {
      const amountInPaise = price * 100;

      // Axios ki jagah Fetch use kar rahe hain for better compatibility
      const response = await fetch("http://localhost:8081/api/payment/create-checkout-session", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: planName,
          amount: amountInPaise,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe URL not found in response");
      }

    } catch (error) {
      console.error("Payment error:", error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.plansContainer}>
      <h1 className={styles.title}>Choose the plan that's right for you</h1>
      
      <div className={styles.cardsWrapper}>
        {/* Mobile Plan */}
        <div className={styles.planCard}>
          <h2>Mobile</h2>
          <p className={styles.price}>₹149 / month</p>
          <ul className={styles.features}>
            <li>Good video quality (480p)</li>
            <li>Phone, Tablet</li>
          </ul>
          <button 
            disabled={loading} 
            onClick={() => handleCheckout("Mobile", 149)}
            className={styles.subscribeBtn}
          >
            {loading ? "Redirecting..." : "Subscribe"}
          </button>
        </div>

        {/* Basic Plan */}
        <div className={styles.planCard}>
          <h2>Basic</h2>
          <p className={styles.price}>₹199 / month</p>
          <ul className={styles.features}>
            <li>Great video quality (720p)</li>
            <li>Phone, Tablet, Computer, TV</li>
          </ul>
          <button 
            disabled={loading} 
            onClick={() => handleCheckout("Basic", 199)}
            className={styles.subscribeBtn}
          >
            {loading ? "Redirecting..." : "Subscribe"}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`${styles.planCard} ${styles.premiumCard}`}>
          <h2>Premium</h2>
          <p className={styles.price}>₹499 / month</p>
          <ul className={styles.features}>
            <li>Best video quality (4K + HDR)</li>
            <li>Phone, Tablet, Computer, TV</li>
            <li>Spatial audio</li>
          </ul>
          <button 
            disabled={loading} 
            onClick={() => handleCheckout("Premium", 499)}
            className={styles.subscribeBtn}
          >
            {loading ? "Redirecting..." : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;   