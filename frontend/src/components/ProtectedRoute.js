import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`/api/auth/verify/${subdomain}`);
                if (response.data.verified) {
                    setIsAuthenticated(true);
                } else {
                    navigate('/register');
                }
            } catch (error) {
                navigate('/register');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate, subdomain]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
