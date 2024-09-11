import React, { useState, useEffect } from 'react';
import Header from './Header';
import Profile from './Profile';
import CalculatorWithLog from './CalculatorWithLog';
import { useSelector } from 'react-redux';
import './Home.css'; // Ensure this file is present and correctly applied

const Home = () => {
  const user = useSelector((state) => state.profile); // Get the user profile including colors
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   // Update CSS variables for primary and secondary colors on the root element
  //   if (user.primaryColor && user.secondaryColor) {
  //     document.documentElement.style.setProperty('--primary-color', user.primaryColor);
  //     document.documentElement.style.setProperty('--secondary-color', user.secondaryColor);
  //   }
  // }, [user.primaryColor, user.secondaryColor]);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="home">
      <Header onEditClick={handleEditClick} />
      <div className="home-content">
        {isEditing && <Profile user={user} />} {/* Toggle Profile on Edit */}
        <CalculatorWithLog />
      </div>
    </div>
  );
};

export default Home;

















