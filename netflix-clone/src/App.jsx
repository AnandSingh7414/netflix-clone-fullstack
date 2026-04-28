import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import SearchPage from "./pages/SearchPage";
import MyListPage from "./pages/MyListPage";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// --- Naye Stripe Pages Import ---
import PlansPage from "./pages/PlansPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";

// --- Protected Route: User logged in nahi hai toh Login bhej do ---
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

// --- Admin Route: Role check karega ---
function AdminRoute({ children }) {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) return <Navigate to="/login" replace />;
  
  try {
    const user = JSON.parse(userStr);
    return user?.role === "ADMIN" ? children : <Navigate to="/" replace />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  const location = useLocation();
  const userStr = localStorage.getItem("user"); 
  
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app">
      {/* Navbar sirf tab dikhega jab user logged in ho AUR login page par na ho */}
      {!isLoginPage && userStr && <Navbar />}

      <Routes>
        {/* Login Route: Agar user logged in hai toh wapas Home bhej do */}
        <Route 
          path="/login" 
          element={userStr ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* Protected Routes: Bina login ke inme se kuch nahi khulega */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute>
              <MoviesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tv" 
          element={
            <ProtectedRoute>
              <TVShowsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/mylist" 
          element={
            <ProtectedRoute>
              <MyListPage />
            </ProtectedRoute>
          } 
        />

        {/* --- Naye Stripe Payment Routes --- */}
        <Route 
          path="/plans" 
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/success" 
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/cancel" 
          element={
            <ProtectedRoute>
              <CancelPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        
        {/* Default: Agar kuch samajh na aaye toh Home bhej do */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}