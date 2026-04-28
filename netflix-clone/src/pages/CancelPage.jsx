import React from "react";
import { Link } from "react-router-dom";

const CancelPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>❌ Payment Cancelled</h1>
      <p style={styles.text}>Aapka transaction poora nahi ho paya. Koi charge nahi kata gaya hai.</p>
      <Link to="/plans" style={styles.button}>Try Again</Link>
    </div>
  );
};

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#111", color: "white" },
  heading: { color: "#e50914", fontSize: "3rem", marginBottom: "10px" },
  text: { fontSize: "1.2rem", marginBottom: "30px" },
  button: { padding: "12px 24px", backgroundColor: "white", color: "#111", textDecoration: "none", borderRadius: "5px", fontSize: "1.1rem", fontWeight: "bold" }
};

export default CancelPage;