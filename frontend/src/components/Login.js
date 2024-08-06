import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // Fetch the welcome message based on the subdomain
    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            try {
                const response = await axios.get(`/api/welcome/${subdomain}`);
                console.log('Welcome message response:', response.data); // Debug log
                setWelcomeMessage(response.data.message);
            } catch (error) {
                console.error('Error fetching welcome message:', error); // Debug log
                setWelcomeMessage('Welcome to the login portal');
            }
        };

        fetchWelcomeMessage();
    }, [subdomain]);

    // Check if the user is verified when the component mounts
    useEffect(() => {
        const checkUserVerification = async () => {
            try {
                const response = await axios.get(`/api/auth/verify/${subdomain}`);
                console.log('User verification response:', response.data); // Debug log
                
                if (!response.data.verified) {
                    console.log('User not verified, redirecting to register'); // Debug log
                    window.location.href = 'http://localhost:3000/register';
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error verifying user:', error); // Debug log
                window.location.href = 'http://localhost:3000/register';
            }
        };

        checkUserVerification();
    }, [subdomain, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', formData);
            console.log('Login response:', data); // Debug log
            setToken(data.token);
            alert('Login successful');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Login error:', error); // Debug log
            alert('Login failed');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{welcomeMessage}</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange} 
                    required 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
