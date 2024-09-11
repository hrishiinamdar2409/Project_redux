import './Register.css';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    homeAddress: '',
    primaryColor: '',
    secondaryColor: '',
    logo: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    navigate('/signin');
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={15}
                style={{ backgroundColor: '#fff', color: '#333', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                minLength={3}
                maxLength={15}
                style={{ backgroundColor: '#fff', color: '#333', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={50}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min={10}
              max={115}
            />
          </div>
          <div>
            <label>Home Address:</label>
            <input
              type="text"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={100}
              style={{ backgroundColor: '#fff', color: '#333', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div className="color-row">
            <div>
              <label>Primary Color:</label>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Secondary Color:</label>
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label>Logo (URL):</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={500}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
