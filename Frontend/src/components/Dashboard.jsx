import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/auction/auctions', {
          headers: { Authorization: `Bearer ${token}` }, // Secure API requests
        });
        setItems(res.data);
      } catch (err) {
        setError('Error fetching auctions. Please try again later.');
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      navigate('/signin');
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Auction Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <Link to="/post-auction">
        <button className="post-auction-btn">Post New Auction</button>
      </Link>

      {loading ? (
        <p>Loading auctions...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="auction-list">
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item._id} className={`auction-item ${item.isClosed ? 'closed' : ''}`}>
                <Link to={`/auction/${item._id}`}>
                  <strong>{item.itemName}</strong> - Current Bid: ${item.currentBid} {item.isClosed && '(Closed)'}
                </Link>
              </li>
            ))
          ) : (
            <p>No auctions available.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
