import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function DeleteAuction() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null); // Store the logged-in user ID

  useEffect(() => {
    const fetchUserAndAuction = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/signin");
          return;
        }

        console.log("Fetching User Details...");
        const userRes = await axios.get("http://localhost:5001/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Logged-in User:", userRes.data);
        const loggedInUserId = userRes.data?.id || userRes.data?._id;
        setUserId(loggedInUserId);

        console.log("Fetching Auction Details...");
        const auctionRes = await axios.get(`http://localhost:5001/auction/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (loggedInUserId && loggedInUserId === auctionRes.data.createdBy) {
          setIsOwner(true);
        } else {
          setError("You are not authorized to delete this auction.");
        }
      } catch (err) {
        console.error("Error fetching user/auction:", err);
        setError("Error verifying ownership.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAuction();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/signin");
        return;
      }

      console.log("Deleting Auction:", id);
      const response = await axios.delete(`http://localhost:5001/auction/auctions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete Response:", response.data);
      alert("Auction deleted successfully!");
      navigate("/my-auctions");
    } catch (err) {
      console.error("Error deleting auction:", err);
      setError(err.response?.data?.message || "Failed to delete auction.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (

    <div className="auction-container">
      <h2>Delete Auction</h2>

      {isOwner ? (
        <button onClick={handleDelete} className="delete-btn">
          Delete Auction
        </button>
      ) : (
        <p>You do not have permission to delete this auction.</p>
      )}
    </div>

  );
  
}

export default DeleteAuction;
