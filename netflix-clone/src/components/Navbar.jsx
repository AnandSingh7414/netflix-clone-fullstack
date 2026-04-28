import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMovies } from "../context/MoviesContext";
import { searchMovies } from "../services/api"; 
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { dispatch } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // User data check
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Updated: Role based check (Backend se "ADMIN" aata hai)
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (location.pathname === "/search") {
      try {
        const res = await searchMovies(value);
        dispatch({ type: "SET_SEARCH_RESULTS", payload: res.data || [] });
      } catch (err) {
        console.error("Search error:", err);
        dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${searchQuery}`);
    try {
      const res = await searchMovies(searchQuery);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: res.data || [] });
    } catch (err) {
      console.error("Search error:", err);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
    }
    setSearchOpen(false);
  };

  // NAYA LINK YAHAN ADD KIYA HAI 👇
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "TV Shows", path: "/tv" },
    { label: "Movies", path: "/movies" },
    { label: "My List", path: "/mylist" },
    { label: "Subscribe", path: "/plans" }, // <-- Ye raha tumhara Plans page ka link
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>NETFLIX</Link>
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.link} ${location.pathname === link.path ? styles.activeLink : ""}`}
            >
              {link.label}
            </Link>
          ))}
          {/* Admin Panel Link */}
          {isAdmin && (
            <Link to="/admin" className={`${styles.link} ${location.pathname === "/admin" ? styles.activeLink : ""}`}>
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <form 
          onSubmit={handleSearch} 
          className={`${styles.searchBox} ${searchOpen ? styles.searchOpen : ""}`}
        >
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className={styles.iconBtn}
          >
            🔍
          </button>
          
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Titles, people, genres"
            className={styles.input}
            onBlur={() => !searchQuery && setSearchOpen(false)}
          />
        </form>

        <div
          className={styles.profile}
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profile" 
            className={styles.avatar}
          />
          <span className={`${styles.caret} ${profileOpen ? styles.caretUp : ""}`}>▼</span>

          {profileOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownArrow}></div>
              {/* Profile Context */}
              <div className={styles.userInfo}>{user?.email}</div>
              <div className={styles.divider}></div>
              
              <div className={styles.dropdownItem} onClick={() => navigate("/mylist")}>My List</div>
              {/* Dropdown mein bhi link add kar sakte hain extra feel ke liye */}
              <div className={styles.dropdownItem} onClick={() => navigate("/plans")}>Upgrade Plan</div>
              {isAdmin && <div className={styles.dropdownItem} onClick={() => navigate("/admin")}>Admin Panel</div>}
              
              <div className={styles.divider}></div>
              <div
                className={styles.dropdownItem}
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Sign out of Netflix
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}