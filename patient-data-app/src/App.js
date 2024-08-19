import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MainApp from './components/MainApp';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const setTokenAndSave = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setToken={setTokenAndSave} />} 
        />
        <Route 
          path="/" 
          element={token ? <MainApp /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
