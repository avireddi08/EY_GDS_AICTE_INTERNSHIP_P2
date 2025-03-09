import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AuctionItem() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auction/auctions");
        setAuctions(res.data);
      } catch (err) {
        setError("Error fetching auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchAuctionDetails = async () => {
        try {
          const res = await axios.get(`http://localhost:5001/auction/auctions/${id}`);
          setSelectedAuction(res.data);
        } catch (err) {
          setError("Error fetching auction details.");
        }
      };

      fetchAuctionDetails();

      // Refresh auction details every 5 seconds for real-time updates
      const interval = setInterval(fetchAuctionDetails, 5000);
      return () => clearInterval(interval);
    } else {
      setSelectedAuction(null);
    }
  }, [id]);

  const placeBid = async () => {
    setError("");
    setMessage("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to place a bid.");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const minBid = selectedAuction?.highestBid ? selectedAuction.highestBid + 1 : selectedAuction?.startingBid || 1;

    if (isNaN(bidValue) || bidValue < minBid) {
      setError(`Bid must be greater than $${minBid}.`);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5001/auction/auctions/${id}/bid`,
        { bidAmount: bidValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Bid placed successfully!");
      setSelectedAuction((prev) => ({
        ...prev,
        highestBid: bidValue,
        highestBidder: res.data.highestBidder || prev.highestBidder, // Update highest bidder
      }));
      setBidAmount(""); // Reset bid input after successful bid
    } catch (err) {
      setError(err.response?.data?.message || "Error placing bid.");
    }
  };

  const goBackToList = () => {
    navigate("/dashboard"); // Navigate back to auction list
    setSelectedAuction(null); // Reset selected auction
  };

  if (loading) {
    return <p>Loading auctions...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (

    <div className="auction-container">
      {!selectedAuction ? (
        <div>
          <ul>
            {auctions.map((auction) => (
              <li key={auction._id}>
                <Link to={`auctions/${auction._id}`}>{auction.itemName}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>{selectedAuction.itemName}</h2>
          <p><strong>Starting Bid:</strong> ${selectedAuction.startingBid}</p>
          <p><strong>Highest Bid:</strong> ${selectedAuction.highestBid || "No bids yet"}</p>
          <p><strong>Highest Bidder:</strong> {selectedAuction.highestBidder?.username || "No bids yet"}</p>
          <p><strong>Closing Time:</strong> {selectedAuction.closingTime ? new Date(selectedAuction.closingTime).toLocaleString() : "N/A"}</p>
          <p><strong>Status:</strong> {selectedAuction.isClosed ? "Closed" : "Open"}</p>

          {!selectedAuction.isClosed && (
            <div className="bidding-section">
              <h3>Place a Bid</h3>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={selectedAuction.highestBid ? selectedAuction.highestBid + 1 : selectedAuction.startingBid}
                placeholder="Enter your bid"
              />
              <button onClick={placeBid}>Submit Bid</button>
            </div>
          )}

          {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

          <br />
          <button onClick={goBackToList}>Back to Auctions List</button>
        </div>
      )}
    </div>

  );
  
}

export default AuctionItem;
