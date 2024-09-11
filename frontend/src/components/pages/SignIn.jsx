import './SignIn.css';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        localStorage.setItem('token', resultAction.payload.token);
        navigate('/home'); // Redirect to Home after login
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form-wrapper">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p className="register-link">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')}>Register here</button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;