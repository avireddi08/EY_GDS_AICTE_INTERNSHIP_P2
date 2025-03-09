import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signin() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/auth/signin', { username, password });

      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem("username", res.data.username);
        console.log('Signin Response:', res.data);
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error('Signin Error:', err);
      setError(err.response?.data?.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="form-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>

  );
  
}

export default Signin;
