import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuctionItem() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [bid, setBid] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auction/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setError(`Error fetching auction item: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();

    // Optional: Polling for real-time bid updates every 5 seconds
    const interval = setInterval(fetchItem, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBid = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username.');
      return;
    }

    const bidValue = parseFloat(bid);
    if (isNaN(bidValue) || bidValue <= item.currentBid) {
      setMessage('Bid must be a valid number and higher than the current bid.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5001/auction/bid/${id}`, { bid: bidValue, username });
      setMessage(res.data.message);
      setItem((prev) => ({
        ...prev,
        currentBid: bidValue,
        highestBidder: username,
      }));
    } catch (error) {
      setError(`Error in placing a bid: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <p>Loading auction details...</p>;
  }

  return (
    <div className="auction-container">
      <h2>{item.itemName}</h2>
      <p>{item.description}</p>
      <p><strong>Current Bid:</strong> ${item.currentBid}</p>
      <p><strong>Highest Bidder:</strong> {item.highestBidder || 'No bids yet'}</p>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        placeholder="Enter your bid"
        min={item.currentBid + 1}
      />
      <button onClick={handleBid}>Place Bid</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuctionItem;
