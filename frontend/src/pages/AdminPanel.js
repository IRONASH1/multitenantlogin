import React from 'react';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { token } = useAuth();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {token ? <Dashboard token={token} /> : <p>Please log in to see the dashboard</p>}
        </div>
    );
};

export default AdminPanel;
