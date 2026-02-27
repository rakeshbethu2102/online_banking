import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import { authService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Force fresh login by clearing stale auth data on app startup
  useEffect(() => {
    // Clear localStorage to ensure users must login fresh
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const login = (userData) => {
    // Store token and user data
    localStorage.setItem('token', userData.token);
    localStorage.setItem('currentUser', JSON.stringify(userData.user));
    setIsAuthenticated(true);
    setCurrentUser(userData.user);
  };

  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage login={login} />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage login={login} />} 
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard user={currentUser} logout={logout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;