import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', subdomain: '', password: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // Check if the subdomain is verified when the component mounts
    useEffect(() => {
        const checkSubdomainVerification = async () => {
            try {
                const response = await axios.get(`/api/auth/verify/${subdomain}`);
                if (!response.data.verified) {
                    // Redirect to the home page if the subdomain is not verified
                    window.location.href = 'http://localhost:3000/register';
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error verifying subdomain:', error);
                // Handle error, e.g., redirect to home page
                window.location.href = 'http://localhost:3000/register';
            }
        };

        checkSubdomainVerification();
    }, [subdomain]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert('Registration successful');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="subdomain" placeholder="Subdomain" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
