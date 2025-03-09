import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Signup from "./components/Sign_up.jsx";
import Signin from "./components/Sign_in.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AuctionItem from "./components/Auction_item.jsx";
import PostAuction from "./components/Post_auction.jsx";
import Landing from "./components/Landing.jsx";
import UpdateAuction from "./components/Update_auction.jsx";
import DeleteAuction from "./components/Delete_auction.jsx";
import MyAuctions from "./components/My_auctions.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Check authentication status when component mounts
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setLoading(false);

    // Load dark mode preference
    const savedTheme = localStorage.getItem("darkMode");
    setDarkMode(savedTheme === "enabled");
  }, []);


  // Update authentication after successful login
  const handleLoginSuccess = (token, username) => {
    localStorage.setItem("authToken", token);  
    localStorage.setItem("username", username); 
    setIsAuthenticated(true);
    setUser(username);
    toast.success(`Welcome, ${username}!`);
    navigate("/dashboard", { replace: true }); 
  };
  
  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    toast.info("Logged out successfully !!");
    navigate("/signin");
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="header">

        <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </button>

        <h1 className="logo">Online Auction Platform</h1>

        <div className="auth-container">
          {!isAuthenticated ? (
            <>
              <div className="auth-box">
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </div>
              <div className="auth-box">
                <Link to="/signin" className="nav-link">Sign In</Link>
              </div>
            </>
          ) : (
            <button onClick={handleLogout} className="button logout-btn">
              Logout
            </button>
          )}
        </div>

      </header>

      {/* Sidebar - Hidden by default, shown when menu button is clicked */}
      {showMenu && (
        <nav className="sidebar">
          <Link to="/" className="nav-link" onClick={() => setShowMenu(false)}>Home</Link>
          <Link to={isAuthenticated ? "/dashboard" : "/signin"} className="nav-link" onClick={() => setShowMenu(false)}>Dashboard</Link>
          <Link to={isAuthenticated ? "/post-auction" : "/signin"} className="nav-link" onClick={() => setShowMenu(false)}>Post Auction</Link>
          <Link to={isAuthenticated ? "/my-auctions" : "/signin"} className="nav-link" onClick={() => setShowMenu(false)}>My Auctions</Link>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/auction/:id" element={<AuctionItem />} />
          <Route path="/post-auction" element={isAuthenticated ? <PostAuction /> : <Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/auction/edit/:id" element={isAuthenticated ? <UpdateAuction /> : <Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/auction/delete/:id" element={isAuthenticated ? <DeleteAuction /> : <Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/my-auctions" element={isAuthenticated ? <MyAuctions /> : <Signin onLoginSuccess={handleLoginSuccess} />} />
        </Routes>

        {/* Auction Images Section */}
        <section className="auction-images">
          <h3>Featured Auctions</h3>
          <div className="image-grid">
            <div className="image-item">
              <img src="images/i1.jpeg" alt="Wrist Watches" />
            </div>
            <div className="image-item">
              <img src="images/i2.jpeg" alt="Paintings" />
            </div>
            <div className="image-item">
              <img src="images/i3.jpeg" alt="Furniture" />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Online Auction Platform | All rights reserved.</p>
        <p>Your Online Auction Destination</p>
      </footer>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>

  );
  
}

export default App;
