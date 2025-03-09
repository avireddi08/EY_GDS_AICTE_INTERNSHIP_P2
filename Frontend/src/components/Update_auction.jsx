import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateAuction() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [updateData, setUpdateData] = useState({ startingBid: "", closingTime: "" });
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Store the logged-in user ID

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/signin");
          return;
        }
  
        // Fetch user details first
        const userRes = await axios.get("http://localhost:5001/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const loggedInUserId = userRes.data?.id || userRes.data?._id; // Handle both `id` and `_id`
        setUserId(loggedInUserId); // Store the user ID
  
        // Fetch auction details 
        const auctionRes = await axios.get(`http://localhost:5001/auction/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Auction Created By:", auctionRes.data.createdBy);
  
        // Ensure user ID is available before checking ownership 
        if (loggedInUserId && loggedInUserId === auctionRes.data.createdBy) {
          setIsOwner(true);
          setAuction(auctionRes.data);
          setUpdateData({
            startingBid: auctionRes.data.startingBid,
            closingTime: new Date(auctionRes.data.closingTime).toISOString().slice(0, 16),
          });
        } else {
          setError("You are not authorized to update this auction.");
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err);
        setError("Error fetching auction details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAuction();
  }, [id, navigate]);
  
  const handleUpdate = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/signin");
            return;
        }

        // Ensure the new starting bid is greater than the previous one 
        if (parseFloat(updateData.startingBid) <= parseFloat(auction.startingBid)) {
            setError("Starting bid must be greater than the previous bid!");
            return;
        }

        console.log("Updating Auction:", id, "New Data:", updateData); 

        const response = await axios.put(
            `http://localhost:5001/auction/auctions/${id}`,
            updateData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Update Response:", response.data); 
        alert("Auction updated successfully!");
        navigate(`/my-auctions`);
    } catch (err) {
        console.error("Failed to update auction:", err.response ? err.response.data : err);
        setError(err.response ? err.response.data.message : "Failed to update auction.");
    }
};

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="error">{error}</p>;

  return (

    <div className="auction-container">
      <h2>Update Auction</h2>
      {message && <p className="success">{message}</p>}

      {isOwner && auction && (
        <div>
          <label>Starting Bid:</label>
          <input
            type="number"
            value={updateData.startingBid}
            onChange={(e) => setUpdateData({ ...updateData, startingBid: e.target.value })}
          />

          <label>Closing Time:</label>
          <input
            type="datetime-local"
            value={updateData.closingTime}
            onChange={(e) => setUpdateData({ ...updateData, closingTime: e.target.value })}
          />

          <button onClick={handleUpdate}>Update Auction</button>
        </div>
      )}
    </div>

  );
  
}

export default UpdateAuction;
