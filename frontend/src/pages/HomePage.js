import React from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Admin Panel</h1>
            <Register />
            <Login />
        </div>
    );
};

export default HomePage;
