import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(""); // Store logged-in username
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      navigate("/signin");
      return;
    }

    setUsername(storedUsername || "User"); // Load username

    const fetchAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auction/auctions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Error fetching auctions. Please try again later."
        );
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [navigate]);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/signin"); // Redirect to Sign-in after logout
  };

  return (

    <div className="dashboard-container">
      <header className="dashboard-header">

        <h2>Welcome, {username ? username : "User"} !!</h2>
        <button onClick={handleLogout} className="button logout-btn">
          Logout
        </button>

      </header>
      <h3>Auction Items</h3>

      {loading ? (
        <p>Loading auctions...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : auctions.length > 0 ? (
        <ul className="auction-list">
          {auctions.map((auction) => (
            <li key={auction._id}>
              <Link to={`/auction/${auction._id}`}>
                <strong>{auction.itemName}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No auctions available.</p>
      )}
    </div>

  );
  
}

export default Dashboard;
