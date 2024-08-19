import React, { useState } from 'react';
import Login from './components/Login';
import MainApp from './components/MainApp';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const setTokenAndSave = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  if (!token) {
    return <Login setToken={setTokenAndSave} />;
  }

  return <MainApp />;
}

export default App;
