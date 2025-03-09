import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 6 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters, include a number and a special character.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/auth/signup", { username, password });
    
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        console.log("Signup Response:", res.data);
        alert(`Signup successful! Welcome ${res.data.username}!`); // Show username
        navigate("/signin");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
    
  };

  return (

    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading} // Prevent input while submitting
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading} 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
    </div>

  );
  
}

export default Signup;
