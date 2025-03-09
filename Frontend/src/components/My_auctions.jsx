import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyAuctions() {

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null); // Store logged-in user ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setError("No authentication token found.");
                    setLoading(false);
                    return;
                }
    
                // Get logged-in user data
                const userRes = await axios.get("http://localhost:5001/auth/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                // Fix: Extract correct field
                setUserId(userRes.data.id || userRes.data._id); // Some APIs return `_id`
    
                // Get user's auctions
                const res = await axios.get("http://localhost:5001/auction/my-auctions", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                console.log("Fetched Auctions:", res.data);
                setAuctions(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (

        <div>
            <h2>My Auctions</h2>
            {auctions.length === 0 ? (
                <p>You haven't created any auctions yet.</p>
            ) : (
                <ul>
                    {auctions.map((auction) => {
                    
                        return (

                            <li key={auction._id}>
                                <Link to={`/auction/${auction._id}`}>{auction.itemName}</Link>

                                {String(auction.createdBy) === String(userId) ? ( 
                                    <>
                                        <Link to={`/auction/edit/${auction._id}`} style={{ marginLeft: "10px" }}>
                                            ✏️ Edit
                                        </Link>
                                        <Link to={`/auction/delete/${auction._id}`} style={{ marginLeft: "10px", color: "red" }}>
                                            ❌ Delete
                                        </Link>
                                    </>
                                ) : (
                                    <p>Not your auction</p> 
                                )}
                            </li>
                        );
                    })}

                </ul>
            )}
        </div>

    );
    
}

export default MyAuctions;
