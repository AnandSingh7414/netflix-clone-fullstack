import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../services/api"; // 🔥 signUp import kar liya hai
import styles from "./Login.module.css";

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(""); 
    try {
      if (isSignIn) {
        // --- SIGN IN LOGIC (Existing User) ---
        const response = await signIn({ email, password });
        
        if (response && response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data));
          if (response.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } else {
        // --- SIGN UP LOGIC (New User) ---
        // 🔥 Real API Call for SignUp
        const response = await signUp({ email, password });
        
        if (response && (response.status === 201 || response.status === 200)) {
          alert("Sign Up successful! Now please Sign In with your credentials.");
          setIsSignIn(true); // Signup ke baad seedha Sign In screen par
          setError(""); // Clear any previous errors
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Backend errors handling
      if (err.response?.status === 401) {
        setError("Incorrect password. Please try again.");
      } else if (err.response?.status === 404) {
        setError("User not found. Please Sign Up first.");
      } else if (err.response?.status === 400) {
        setError("Email already registered! Try Signing In.");
      } else {
        setError("Server is offline. Check your Spring Boot backend.");
      }
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.backgroundLayer}>
        <img
          src="https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg"
          alt="Background"
          className={styles.bgImage}
        />
        <div className={styles.bgOverlay}></div>
      </div>

      <header className={styles.header}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix"
          className={styles.logo}
        />
      </header>

      <main className={styles.loginContent}>
        <div className={styles.loginBox}>
          <h1>{isSignIn ? "Sign In" : "Sign Up"}</h1>
          
          {error && <div className={styles.errorAlert} style={{ 
            background: "#e87c03", color: "white", padding: "10px", 
            borderRadius: "4px", marginBottom: "15px", fontSize: "14px" 
          }}>
            {error}
          </div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email or phone number"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.signInButton}>
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
            
            <div className={styles.formHelp}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#">Need help?</a>
            </div>
          </form>

          <div className={styles.loginFooter}>
            <p>
              {isSignIn ? "New to Netflix?" : "Already have an account?"}
              <span 
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError(""); 
                }} 
                className={styles.signUpLink}
                style={{ marginLeft: '5px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}
              >
                {isSignIn ? "Sign up now." : "Sign in now."}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}