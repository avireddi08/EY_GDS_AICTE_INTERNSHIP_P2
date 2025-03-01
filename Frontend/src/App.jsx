import React from "react";
import { useState, useEffect } from 'react';
import {Route, Routes, Link, useNavigate } from 'react-router-dom';
import Signup from './components/Sign_up.jsx';
import Signin from './components/Sign_in.jsx';
import Dashboard from './components/Dashboard.jsx';
import AuctionItem from './components/Auction_item.jsx';
import PostAuction from './components/Post_auction.jsx';
import Landing from './components/Landing.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css"; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Check authentication status when component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      toast.success("Welcome back! 🎉");
    }
    setLoading(false);

    // Load dark mode preference
    const savedTheme = localStorage.getItem("darkMode");
    setDarkMode(savedTheme === "enabled");
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    toast.info("Logged out successfully! 👋");
    navigate('/signin');
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
      return newMode;
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="header">
        {/* Logo and Menu */}
        <div className="header-left">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>
          <h1 className="logo">Online Auction Platform</h1>
        </div>

        {/* Auth Links */}
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
            <div className="more-options">
              <button className="more-button" onClick={() => setShowOptions(!showOptions)}>⋮</button>
              {showOptions && (
                <div className="dropdown">
                  <button onClick={toggleDarkMode} className="dropdown-item">
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Side Navigation */}
      {showMenu && (
        <nav className="sidebar">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/post-auction" className="nav-link">Post Auction</Link>
            </>
          )}
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auction/:id" element={<AuctionItem />} />
          <Route path="/post-auction" element={<PostAuction />} />
        </Routes>

        {/* Auction Images Section */}
        <section className="auction-images">
          <h2>Featured Auctions</h2>
          <div className="image-grid">
            <div className="image-item"><img src="images/i1.jpeg" alt="Wrist Watches" /></div>
            <div className="image-item"><img src="images/i2.jpeg" alt="Paintings" /></div>
            <div className="image-item"><img src="images/i3.jpeg" alt="Furniture" /></div>
          </div>
        </section>

      </main>

      <footer>
        <p>&copy; 2025 Online Auction Platform | All rights reserved.</p>
        <p>Your Online Auction Destination</p>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;