import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Professional Checkmark Icon */}
        <div style={styles.iconCircle}>
          <span style={styles.checkmark}>✓</span>
        </div>
        
        <h1 style={styles.heading}>Subscription Confirmed</h1>
        
        <p style={styles.subtext}>
          Welcome to <span style={styles.brandName}>Netflix Premium</span>. 
          Your account is now active and ready to use.
        </p>

        <div style={styles.divider}></div>

        <p style={styles.infoText}>
          You now have unlimited access to thousands of movies, TV shows, and original series. 
          Start your journey with us today.
        </p>

        <Link to="/" style={styles.button}>
          Start Watching
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Netflix black
    color: "#fff",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    textAlign: "center",
    padding: "20px"
  },
  card: {
    maxWidth: "500px",
    width: "100%"
  },
  iconCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    border: "2px solid #4CAF50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 30px"
  },
  checkmark: {
    color: "#4CAF50",
    fontSize: "2.5rem",
    fontWeight: "bold"
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "800",
    letterSpacing: "-1px",
    marginBottom: "15px"
  },
  subtext: {
    fontSize: "1.2rem",
    color: "#e6e6e6",
    lineHeight: "1.5",
    marginBottom: "20px"
  },
  brandName: {
    color: "#e50914", // Netflix Red
    fontWeight: "bold"
  },
  divider: {
    height: "1px",
    backgroundColor: "#333",
    width: "80%",
    margin: "25px auto"
  },
  infoText: {
    fontSize: "1rem",
    color: "#a9a9a9",
    marginBottom: "40px",
    lineHeight: "1.6"
  },
  button: {
    display: "inline-block",
    padding: "15px 40px",
    backgroundColor: "#e50914",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    transition: "background 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }
};

export default SuccessPage;