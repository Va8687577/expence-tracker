// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashbord';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import History from './components/Histroy';
// Import other components as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history" element={<History/>}/>
        </Routes>
    </Router>
  );
};

export default App;
