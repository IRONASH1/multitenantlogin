import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setToken }) => {
    const navigate = useNavigate();
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const welcomeMessage = subdomain === 'localhost' ? 'Welcome to the dashboard' : `Welcome ${subdomain}`;

    const handleLogout = () => {
        setToken('');
        navigate('/login');
    };

    return (
        <div>
            <h1>{welcomeMessage}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
