import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import both dispatch and selector hooks
import { logoutUser } from '../store/authSlice'; // Import logout action
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import './Header.css';

const Header = ({ onEditClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize react-router's navigate hook
  
  // Accessing logo from the user object in the auth state
  const logoURL = useSelector((state) => state.auth.user?.logo);
  
  console.log('Logo URL:', logoURL); // Debug output to verify the logo URL

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    navigate('/signin'); // Redirect to the sign-in page after logout
  };

  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Left section - Edit Profile Button */}
      <div className="header-left">
        <button className="edit-btn" onClick={onEditClick}>
          Edit Profile
        </button>
      </div>

      {/* Center section - Logo */}
      <div className="header-center" style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        {logoURL ? (
          <img 
            src={logoURL} 
            alt="Logo" 
            style={{
              height: '80px', // Increase the size
              width: '80px',
              objectFit: 'contain'
            }} 
          />
        ) : (
          <p>No Logo Available</p>
        )}
      </div>

      {/* Right section - Logout Button */}
      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;


