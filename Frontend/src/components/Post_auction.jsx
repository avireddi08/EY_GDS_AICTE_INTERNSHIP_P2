import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handlePostAuction = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!itemName.trim() || !description.trim()) {
      setMessage('Item name and description are required.');
      return;
    }

    if (isNaN(startingBid) || startingBid <= 0) {
      setMessage('Starting bid must be a positive number.');
      return;
    }

    const currentTime = new Date().toISOString();
    if (new Date(closingTime).toISOString() <= currentTime) {
      setMessage('Closing time must be in the future.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('You must be signed in to post an auction.');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5001/auction/auctions',
        { itemName, description, startingBid, closingTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Auction item posted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to post auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Post New Auction</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handlePostAuction}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Starting Bid"
          value={startingBid}
          onChange={(e) => setStartingBid(e.target.value)}
          min="1"
          required
        />
        <input
          type="datetime-local"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Auction'}
        </button>
      </form>
    </div>
  );
}

export default PostAuction;
