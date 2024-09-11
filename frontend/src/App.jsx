// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/pages/SignIn';
import Register from './components/pages/Register';
import Home from './components/Home/Home';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, fetchProfile } from './components/store/authSlice';

// Import the global CSS file
import './style.css';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/signin" />;
};

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(loginUser.fulfilled({ token: storedToken }));
      dispatch(fetchProfile()); // Fetch profile (including colors)
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
