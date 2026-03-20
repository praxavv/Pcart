import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Assuming you have a CSS file for styling

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(() => {
    // Get the saved state from localStorage or default to true (login view)
    return localStorage.getItem('authMode') !== 'register';
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Save auth mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('authMode', isLogin ? 'login' : 'register');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await axios.post('/api/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.removeItem('authMode'); // Clear the auth mode after successful login
        onLogin && onLogin();
        navigate('/');
      } else {
        await axios.post('/api/users/register', { username, email, password });
        setSuccess('Registration successful!');
        setIsLogin(true);
      }
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Try a different email or username.');
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required={!isLogin}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
        </button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
      <div className="auth-toggle" onClick={toggleMode}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </div>
    </div>
  );
};

export default Login;
