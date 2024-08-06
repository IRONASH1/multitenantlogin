import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import WelcomeMessage from './components/WelcomeMessage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';

const App = () => {
    const [token, setToken] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard setToken={setToken} />
                    </ProtectedRoute>
                } />
                <Route path="/" element={
                    <ProtectedRoute>
                        <>
                            <WelcomeMessage />
                            <HomePage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </Router>
    );
};

export default App;
